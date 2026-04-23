
import { SuggestionType } from "@/lib/types/types.project"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import { useSession } from "@/lib/auth/auth-client"
import { deleteSuggestion } from "@/lib/actions/suggestion"

const COLORS = [
  "bg-violet-400",
  "bg-sky-400",
  "bg-emerald-400",
  "bg-rose-400",
  "bg-amber-400",
  "bg-indigo-400",
]

function getColor(authorId: string) {
  let hash = 0

  for (let i = 0; i < authorId.length; i++) {
    hash = authorId.charCodeAt(i) + ((hash << 5) - hash)
  }

  return COLORS[Math.abs(hash) % COLORS.length]
}

interface Props {
  suggests: SuggestionType[]
  isLobbyOwner:boolean
  onDelete: () => void
}

export default function SuggestionsList({ suggests, isLobbyOwner, onDelete }: Props) {
  const items = suggests

  async function handleDeleteSuggestion(id:string) {
    try {
      await deleteSuggestion({ suggestionId: id })
      onDelete()
    } catch (error) {
      console.error("Failed to delete suggestion:", error)
    }
  }


  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-6 text-s text-slate-400">
        No suggestions yet
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((s) => (
        <div key={s._id.toString()} className="overflow-hidden relative">
          
          <div className={`h-1 w-full ${getColor(s.author)}`} />

          <div className="px-4 pt-3 pb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              {s.author}
            </p>

            <p className="text-sm leading-relaxed text-slate-700">
              {s.content}
            </p>
          </div>

          {isLobbyOwner && (
            <Button 
              size="lg"
              variant="ghost"
              className="absolute top-9 right-2 h-7 w-7 p-0 text-slate-400 hover:text-red-500"
              onClick={() => handleDeleteSuggestion(s._id.toString())}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}

        </div>
      ))}
    </div>
  )
}
