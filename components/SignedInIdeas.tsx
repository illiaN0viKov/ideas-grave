import Ideas from "@/components/Ideas"
import type { Idea } from "@/lib/types/types-ideas"

type Props = {
  selectedLobbyTitle: string
  selectedIdeas: Idea[]
}

export default function SignedInIdeas({ selectedLobbyTitle, selectedIdeas }: Props) {
  return (
    <section className="rounded-[2rem] border border-black/10 bg-black/5 p-8 sm:p-10">
      <div className="mb-8 space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Lobby ideas</p>
        <h2 className="text-3xl font-semibold text-slate-950">Ideas in {selectedLobbyTitle}</h2>
      </div>
      <Ideas ideas={selectedIdeas} />
    </section>
  )
}
