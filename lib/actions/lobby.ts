"use server"

import { Types } from "mongoose"
import connectDB from "@/lib/db"
import { getSession } from "@/lib/auth/auth"
import { Lobby } from "@/lib/models/lobby"
import { revalidatePath } from "next/cache"

export type CreateLobbyParams = {
  name: string
  description: string
  isPrivate?: boolean
}

export type UpdateLobbyParams = {
  lobbyId: string
  name?: string
  description?: string
  isPrivate?: boolean
}

export async function createLobby({
  name,
  description,
  isPrivate = false,
}: CreateLobbyParams) {
  await connectDB()

  const session = await getSession()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const inviteCode = generateInviteCode(8)
  const lobby = await Lobby.create({
    name,
    description,
    owner: new Types.ObjectId(userId),
    members: [new Types.ObjectId(userId)],
    inviteCode,
    isPrivate,
  })



  revalidatePath("/");


return JSON.parse(JSON.stringify(lobby))
}

export async function updateLobby({
  lobbyId,
  name,
  description,
  isPrivate,
}: UpdateLobbyParams) {
  await connectDB()

  const update: Partial<{
    name: string
    description: string
    isPrivate: boolean
  }> = {}

  if (typeof name === "string") update.name = name.trim()
  if (typeof description === "string") update.description = description.trim()
  if (typeof isPrivate === "boolean") update.isPrivate = isPrivate

  const lobby = await Lobby.findByIdAndUpdate(
    lobbyId,
    { $set: update },
    { new: true }
  )

  revalidatePath("/");

return JSON.parse(JSON.stringify(lobby))
}

export async function deleteLobby({ lobbyId }: { lobbyId: string }) {
  await connectDB()

  await Lobby.findByIdAndDelete(lobbyId)
  revalidatePath("/")
}

function generateInviteCode(length = 8) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""

  for (let i = 0; i < length; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }

  return code
}
