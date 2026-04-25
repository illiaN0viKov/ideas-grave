"use client";

import { useEffect, useState, useTransition } from "react";
import LobbiesClient from "./lobbies-client";
import IdeasClient from "./ideas-client";
import { IdeaType, LobbyType } from "@/lib/types/types.project";
import { getIdeas } from "@/lib/actions/idea";
import IdeaView from "./idea-view";

export default function LandscapeSignedInClient({ lobbies, userId }: { lobbies: LobbyType[]; userId:string }) {
  const [selectedLobby, setSelectedLobby] = useState<LobbyType | null>(null);
  const [selectedIdeas, setSelectedIdeas] = useState<IdeaType[]>([]);
  const [loadingIdeas, setLoadingIdeas] = useState(false);
  const [ideasError, setIdeasError] = useState<string | null>(null);
  const [refreshIdeas, setRefreshIdeas] = useState(0)
  const [selectedIdea, setSelectedIdea] = useState<IdeaType | null>(null);

 const [isPending, startTransition] = useTransition()

useEffect(() => {
  if (!selectedLobby) {
    setSelectedIdeas([])
    return
  }

  startTransition(async () => {
    try {
      const data = await getIdeas(selectedLobby._id.toString())
      setSelectedIdeas(data)
      setSelectedIdea(null) 
    } catch (err) {
      console.error(err)
    }
  })

  console.log(selectedLobby.description)
}, [selectedLobby, refreshIdeas])


  return (
    <>
      <LobbiesClient lobbies={lobbies} onSelectLobby={setSelectedLobby} userId={userId}
        onDeleteLobby={() => {
        setSelectedLobby(null)
        setSelectedIdeas([])
        setSelectedIdea(null)
      }}
        onUpdateLobby={(lobby)=>setSelectedLobby(lobby)}
        />

      <div className="lg:col-span-2">
        {selectedLobby && !selectedIdea && (
          <IdeasClient lobby={selectedLobby} ideas={selectedIdeas} onCreate={() => setRefreshIdeas(prev => prev + 1)} onIdeaSelect={setSelectedIdea} />
        )}

        {selectedLobby && selectedIdea && (
            <IdeaView idea={selectedIdea} onBackRefetch={() => setRefreshIdeas(prev => prev + 1)} selectIdea={setSelectedIdea}  lobby={selectedLobby} onDelete={() => setRefreshIdeas(prev => prev + 1)} />
        )}

        {selectedLobby && isPending && (
          <div className="mt-6 rounded-[2rem] border border-black/10 bg-black/5 p-8 sm:p-10">
            Loading ideas...
          </div>
        )}



        {/* {selectedLobby && ideasError && (
          <div className="mt-6 rounded-[2rem] border border-red-200 bg-red-50 p-8 sm:p-10 text-red-700">
            {ideasError}
          </div>
        )} */}
      </div>
    </>
  )
}