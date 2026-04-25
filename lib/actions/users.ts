"use server"

import { db } from "@/lib/auth/auth"
import { ObjectId } from "mongodb"

export async function getUsers(ids: string[]) {
    const users = await db.collection("user")
        .find({ _id: { $in: ids.map(id => new ObjectId(id)) } })
        .project({ _id: 1, email: 1 })
        .toArray()

    return users.map(u => ({
        id: u._id.toString(),
        email: u.email as string,
    }))
}