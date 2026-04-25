import Ideas from "@/components/Ideas"
import type { IdeaType, LobbyType } from "@/lib/types/types.project"
import IdeasCreateDialog from "./ideas-create-dialog"
import { Button } from "./ui/button"
import { Copy, Link } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

type Props = {
  lobby: LobbyType
  ideas: IdeaType[]
  onCreate:()=>void
  onIdeaSelect: (idea: IdeaType | null) => void


}

export default function IdeasClient({ lobby, ideas, onCreate, onIdeaSelect }: Props) {
  return (
    <section className="rounded-[2rem] border border-black/10 bg-black/5 p-8 sm:p-10">
      
            {/* Header */}
            <div className="space-y-2 border-b border-black/10 pb-6">
            <div className="flex items-start justify-between">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                Lobby ideas
                </p>

                <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5">
                    <Link className="h-3.5 w-3.5" />
                    Invite
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                    <DialogTitle className="text-base font-semibold">Invite to lobby</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-black/5 px-4 py-3">
                    <p className="flex-1 font-mono text-sm tracking-widest text-slate-700">
                        {lobby.inviteCode}
                    </p>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => navigator.clipboard.writeText(lobby.inviteCode)}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                    </div>
                </DialogContent>
                </Dialog>
            </div>

                <h2 className="text-2xl font-semibold uppercase text-slate-950">
                    {lobby.name}
                </h2>

                <p className="text-lg text-slate-500">
                    {lobby.description}
                </p>

                <p className="text-md text-slate-400">
                    {lobby.members.length} active {lobby.members.length === 1 ? "member" : "members"}
                </p>
                </div>

      {/* Actions */}
      <div className="flex justify-start py-4">
        <IdeasCreateDialog lobbyId={lobby._id.toString()} onCreate={onCreate}/>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {ideas.length > 0 ? (
          <Ideas ideas={ideas} selectIdea={onIdeaSelect} />
        ) : (
          <div className="rounded-3xl border border-black/10 bg-white p-8 text-slate-600">
            No ideas have been added yet.
          </div>
        )}
      </div>
      
    </section>
  )
}
