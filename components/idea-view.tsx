import { IdeaType, LobbyType } from "@/lib/types/types.project"
import React from "react"
import Idea from "./Idea"
import IdeasConfigDialog from "./idea-config-dialog"
import { useSession } from "@/lib/auth/auth-client"

interface Props {
    idea:IdeaType
    lobby:LobbyType
    selectIdea: (idea: IdeaType | null) => void
    onDelete: ()=>void

}

export default function IdeaView ({idea, selectIdea, lobby, onDelete} : Props) {

    const session = useSession()


    const isIdeaOwner = session.data?.user.id.toString() === idea.creator.toString()
    const isLobbyOwner = session.data?.user.id.toString() === lobby.owner.toString()


    return (
<section className="rounded-[2rem] border border-black/10 bg-black/5 p-8 sm:p-10">
      
      {/* Header */}
      <div className="space-y-2 border-b border-black/10 pb-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Lobby ideas
        </p>

        <h2 className="text-2xl font-semibold uppercase text-slate-950">
          {lobby.name}
        </h2>

        <p className="text-sm text-slate-500">
          {lobby.description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-start py-4">
        <IdeasConfigDialog idea={idea} onDelete={onDelete}  isIdeaOwner={isIdeaOwner} isLobbyOwner={isLobbyOwner} 
        selectIdea={selectIdea}/>
      </div>

      {/* Content */}
      <div className="flex space-y-4 justify-start ">
            <Idea idea={idea}/>
      </div>
      
    </section>
    )
}