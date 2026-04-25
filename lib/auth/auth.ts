import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import connectDB from "../db";

// const client = new MongoClient(process.env.MONGODB_URI!)
// const db =client.db()

const mongooseInstance = await connectDB();
const client = mongooseInstance.connection.getClient();
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),
    session: {
        cookieCache: {
            enabled:true,
            maxAge:60*60
        },
    },

        trustedOrigins: [
        process.env.NEXT_PUBLIC_APP_URL!,
        ],
    
    emailAndPassword: {
        enabled: true, 
    }, 
        socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    databaseHooks: {

    }
})

export async function getSession() {
    const result = await auth.api.getSession({
        headers: await headers()
    })

    return result
}

export { db }