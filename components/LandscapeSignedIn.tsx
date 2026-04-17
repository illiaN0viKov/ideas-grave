
import SignedInProfile from "@/components/SignedInProfile"
import IdeasClient from "@/components/ideas-client"
import connectDB from "@/lib/db";
import { getSession } from "@/lib/auth/auth";
import { Lobby } from "@/lib/models/lobby";
import LobbiesClient from "./lobbies-client";
import LandscapeSignedInClient from "./landscape-signedin-client";
import { Idea } from "@/lib/models/idea";

async function getLobbiesAndIdeas() {
  await connectDB();

  const session = await getSession();

  const lobbies = await Lobby.find({
    members: session?.user?.id,
  }).lean();

  

  const lobbyIds = lobbies.map((l) => l._id);

  const ideas = await Idea.find({
    lobby: { $in: lobbyIds },
  })
    .sort({ createdAt: -1 })
    .lean();

  return {lobbies: JSON.parse(JSON.stringify(lobbies)), ideas, session };
}


export default async function LandscapeSignedIn() {

    const {lobbies, session, ideas} = await getLobbiesAndIdeas()


  return (
    <div className="space-y-12">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <SignedInProfile userEmail={session?.user?.email} lobbyCount={lobbies?.length} ideaCount={ideas?.length} />
        {/* <LobbiesClient lobbies={lobbies} />
        <div className="lg:col-span-2">
          <IdeasClient />
        </div> */}
        <LandscapeSignedInClient lobbies={lobbies}/>
      </div>

    </div>
  )
}
