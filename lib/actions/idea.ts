"use server"

import { Types } from "mongoose"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { getSession } from "@/lib/auth/auth"
import { Idea } from "@/lib/models/idea"
import { Lobby } from "@/lib/models/lobby"

export type CreateIdeaParams = {
  title: string
  description?: string
  lobbyId: string
}

export type UpdateIdeaParams = {
  ideaId: string
  title?: string
  description?: string
  status?: "active" | "abandoned" | "done"
}

export async function getIdeas(lobbyId: string) {
  await connectDB()

  if (!Types.ObjectId.isValid(lobbyId)) {
    throw new Error("Invalid lobby id")
  }

  const ideas = await Idea.find({ lobby: new Types.ObjectId(lobbyId) })
    .sort({ createdAt: -1 })
    .lean()

return JSON.parse(JSON.stringify(ideas))
}

export async function createIdea({ title, description, lobbyId }: CreateIdeaParams) {
  await connectDB()

  const session = await getSession()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized")
  }

  if (!Types.ObjectId.isValid(lobbyId)) {
    throw new Error("Invalid lobby id")
  }

  const lobby = await Lobby.findOne({
    _id: new Types.ObjectId(lobbyId),
    members: new Types.ObjectId(userId),
  })

  if (!lobby) {
    throw new Error("You must be a lobby member to create ideas")
  }

  const idea = await Idea.create({
    title: title.trim(),
    lobby: new Types.ObjectId(lobbyId),
    creator: new Types.ObjectId(userId),
  })

  revalidatePath("/")
return JSON.parse(JSON.stringify(idea))
}

export async function updateIdea({ ideaId, title, description, status }: UpdateIdeaParams) {
  await connectDB()

  const session = await getSession()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized")
  }

  if (!Types.ObjectId.isValid(ideaId)) {
    throw new Error("Invalid idea id")
  }

  const idea = await Idea.findById(ideaId)

  if (!idea) {
    throw new Error("Idea not found")
  }

  if (idea.creator.toString() !== userId.toString()) {
    throw new Error("You can only update ideas you created")
  }

  const update: Partial<{ title: string; description: string; status: "active" | "abandoned" | "done" }> = {}

  if (typeof title === "string") update.title = title.trim()
  if (typeof description === "string") update.description = description.trim()
  if (typeof status === "string") update.status = status

  const updatedIdea = await Idea.findByIdAndUpdate(ideaId, { $set: update }, { new: true })

  revalidatePath("/")
  return JSON.parse(JSON.stringify(updatedIdea))
}

export async function deleteIdea({ ideaId }: { ideaId: string }) {
  await connectDB()

  const session = await getSession()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized")
  }

  if (!Types.ObjectId.isValid(ideaId)) {
    throw new Error("Invalid idea id")
  }

  const idea = await Idea.findById(ideaId)

  if (!idea) {
    throw new Error("Idea not found")
  }

  const lobby = await Lobby.findById(idea.lobby)

  if (!lobby) {
    throw new Error("Lobby not found")
  }

  if (lobby.owner.toString() !== userId.toString()) {
    throw new Error("Only the lobby owner can delete ideas")
  }

  await Idea.findByIdAndDelete(ideaId)
  revalidatePath("/")
}
