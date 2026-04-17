import Ideas from "@/components/Ideas"
import type { IdeaType, LobbyType } from "@/lib/types/types.project"
import IdeasCreateDialog from "./ideas-create-dialog"

type Props = {
  lobby: LobbyType
  ideas: IdeaType[]
  onCreate:()=>void
}

export default function IdeasClient({ lobby, ideas, onCreate }: Props) {
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
        <IdeasCreateDialog lobbyId={lobby._id.toString()} onCreate={onCreate}/>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {ideas.length > 0 ? (
          <Ideas ideas={ideas} />
        ) : (
          <div className="rounded-3xl border border-black/10 bg-white p-8 text-slate-600">
            No ideas have been added yet.
          </div>
        )}
      </div>
      
    </section>
  )
}
