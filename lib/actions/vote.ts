"use server"

import { revalidatePath } from "next/cache"
import { getSession } from "../auth/auth"
import connectDB from "../db"
import { VotingSession } from "../models/voting-session"
import { Vote } from "../models/vote"
import { Types } from "mongoose"
import { Idea } from "../models/idea"
import { createSuggestion } from "./suggestion"
import { Lobby } from "../models/lobby"

export async function createVotingSession({
  ideaId,
  type,
  newName,
}: {
  ideaId: string
  type: "change" | "abandon"
  newName?: string
}) {
  await connectDB()
  const session = await getSession()
  if (!session?.user?.id) throw new Error("Unauthorized")

  // only one active session per idea at a time
  const existing = await VotingSession.findOne({ idea: ideaId, status: "active" })
  if (existing) throw new Error("A voting session is already active for this idea")

  const votingSession = await VotingSession.create({
    idea: new Types.ObjectId(ideaId),
    type,
    payload: type === "change" ? { newName } : undefined,
    initiator: new Types.ObjectId(session.user.id),

  })

  revalidatePath("/")
  return JSON.parse(JSON.stringify(votingSession))
}

export async function endVotingSession({ sessionId, ideaId }: { sessionId: string; ideaId:string }) {
  await connectDB()

    const votingSession = await VotingSession.findById(sessionId)
    if (!votingSession) throw new Error("Session not found")

    const idea = await Idea.findById(votingSession?.idea)
    if (!idea) throw new Error("Idea not found")

    const lobby = await Lobby.findById(idea.lobby)
    if (!lobby) throw new Error("Lobby not found")


  const votes = await Vote.find({ session: sessionId })
  const ups = votes.filter(v => v.value === "up").length
  const downs = votes.filter(v => v.value === "down").length
  const approved = ups > downs

  votingSession.status = "ended"
  votingSession.result = approved ? "approved" : "rejected"
  await votingSession.save()

    if (approved) {
    if (votingSession.type === "abandon") {
        await Idea.findByIdAndUpdate(votingSession.idea, { status: "abandoned" })
        await createSuggestion({
        content: "Idea was abandoned by vote",
        ideaId,
        author: votingSession.initiator.toString(),
        lobbyId: lobby._id.toString()
        })
    }
    if (votingSession.type === "change" && votingSession.payload?.newName) {
        await Idea.findByIdAndUpdate(votingSession.idea, { title: votingSession.payload.newName })
        await createSuggestion({
        content: `Idea was renamed to "${votingSession.payload.newName}" by vote`,
        ideaId,
        author: votingSession.initiator.toString(),
        lobbyId: lobby._id.toString()
        })
    }
    }

  revalidatePath("/")
}

export async function castVote({
  sessionId,
  ideaId,
  value,
}: {
  sessionId: string
  ideaId: string
  value: "up" | "down"
}) {
  await connectDB()
  const session = await getSession()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const votingSession = await VotingSession.findById(sessionId)
  if (!votingSession || votingSession.status !== "active") throw new Error("No active session")

  // upsert — one vote per user per session
  await Vote.findOneAndUpdate(
    { session: sessionId, user: session.user.id },
    { session: sessionId, idea: ideaId, user: session.user.id, target: votingSession.type, value },
    { upsert: true, new: true }
  )

  // check if we should auto-close
  const lobby = await Lobby.findOne({ ideas: ideaId }) // or however you reference lobby
  const memberCount = lobby?.members?.length ?? 0
  const votes = await Vote.find({ session: sessionId })
  const ups = votes.filter(v => v.value === "up").length
  const downs = votes.filter(v => v.value === "down").length
  const majority = Math.floor(memberCount / 2) + 1

  const allVoted = votes.length >= memberCount
  const obviousMajority = ups >= majority || downs >= majority

  if (allVoted || obviousMajority) {
    await endVotingSession({ sessionId, ideaId })
  }

  revalidatePath("/")
}

export async function getActiveVotingSession(ideaId: string) {
  await connectDB()

  const votingSession = await VotingSession.findOne({
    idea: new Types.ObjectId(ideaId),
    status: "active",
  }).lean()

  if (!votingSession) return null

  const votes = await Vote.find({ session: votingSession._id }).lean()
  const ups = votes.filter(v => v.value === "up").length
  const downs = votes.filter(v => v.value === "down").length

  return JSON.parse(JSON.stringify({
    ...votingSession,
    ups,
    downs,
    totalVotes: votes.length,
    userVote: votes.find(v => v.user.toString())?.value ?? null,
  }))
}

export async function deleteVotingSession({ sessionId }: { sessionId: string }) {
  await connectDB()

  const session = await getSession()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const votingSession = await VotingSession.findById(sessionId)
  if (!votingSession) throw new Error("Session not found")

  const idea = await Idea.findById(votingSession.idea)
  if (!idea) throw new Error("Idea not found")

  const lobby = await Lobby.findById(idea.lobby)
  if (!lobby) throw new Error("Lobby not found")

  const canDelete =
    session.user.id === votingSession.initiator.toString() ||
    session.user.id === lobby.owner.toString()

  if (!canDelete) throw new Error("Not authorized")

  await Vote.deleteMany({ session: sessionId })
  await VotingSession.findByIdAndDelete(sessionId)

  revalidatePath("/")
}