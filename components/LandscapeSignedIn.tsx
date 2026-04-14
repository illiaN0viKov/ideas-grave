
import SignedInProfile from "@/components/SignedInProfile"
import SignedInIdeas from "@/components/SignedInIdeas"
import { ideas } from "@/app/data/ideas"
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth/auth";
import { Lobby } from "@/lib/models/lobby";
import LobbiesClient from "./lobbies-client";


  async function getLobbies() {
  await connectDB();

  const session = await getSession();

  const lobbies = await Lobby.find({
    members: session?.user?.id,
  }).lean();
  
  return {lobbies, session}


  }


export default async function LandscapeSignedIn() {

    const {lobbies, session} = await getLobbies()


  return (
    <div className="space-y-12">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <SignedInProfile userEmail={session?.user?.email} lobbyCount={lobbies.length} ideaCount={ideas.length} />
        <LobbiesClient lobbies={lobbies} />
      </div>

    </div>
  )
}
