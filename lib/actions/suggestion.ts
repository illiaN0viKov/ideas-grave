"use server"

import { Types } from "mongoose"
import { revalidatePath } from "next/cache"

import connectDB from "@/lib/db"
import { getSession } from "@/lib/auth/auth"

import { Suggestion } from "../models/suggest"
import { Lobby } from "../models/lobby"
import { Idea } from "../models/idea"

export type CreateSuggestionParams = {
  content: string
  ideaId: string
  lobbyId: string
  author?:string
}


export async function getSuggestions(ideaId: string) {
  await connectDB()

  if (!Types.ObjectId.isValid(ideaId)) {
    throw new Error("Invalid idea id")
  }

  const suggestions = await Suggestion.find({
    idea: new Types.ObjectId(ideaId),
  })
    .sort({ createdAt: -1 })
    .lean()

  return JSON.parse(JSON.stringify(suggestions))
}


export async function createSuggestion({
  content,
  ideaId,
  lobbyId,
  author
}: CreateSuggestionParams) {
  await connectDB()

  const session = await getSession()
  const userId =author ? author : session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized")
  }

  if (!Types.ObjectId.isValid(ideaId)) {
    throw new Error("Invalid idea id")
  }

  if (!Types.ObjectId.isValid(lobbyId)) {
    throw new Error("Invalid lobby id")
  }

  if (!content.trim()) {
    throw new Error("Suggestion cannot be empty")
  }

  const lobby = await Lobby.findOne({
    _id: new Types.ObjectId(lobbyId),
    members: new Types.ObjectId(userId),
  })

  if (!lobby) {
    throw new Error("You must be a lobby member to create suggestions")
  }

  const newSuggestion = await Suggestion.create({
    content: content.trim(),
    idea: new Types.ObjectId(ideaId),
    author: new Types.ObjectId(userId),
  })

  revalidatePath("/") // optionally make this more specific

  return JSON.parse(JSON.stringify(newSuggestion))
}


export async function deleteSuggestion({
  suggestionId,
}: {
  suggestionId: string
}) {
  await connectDB()

  const session = await getSession()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized")
  }
  

  if (!Types.ObjectId.isValid(suggestionId)) {
    throw new Error("Invalid suggestion id")
  }

  const suggestion = await Suggestion.findById(suggestionId)

  if (!suggestion) {
    throw new Error("Suggestion not found")
  }

  const idea = await Idea.findById(suggestion.idea)
  if (!idea) {
    throw new Error("Idea not found")
  }

  const lobby = await Lobby.findById(idea.lobby)
  if (!lobby) {
    throw new Error("Lobby not found")
  }

  const isLobbyOwner = lobby.owner.toString() === userId.toString()

  if (!isLobbyOwner) {
    throw new Error("Not allowed to delete this suggestion")
  }

  await Suggestion.findByIdAndDelete(suggestionId)

  revalidatePath("/") 
}