import { SuggestionType } from "@/lib/types/types.project";

export const mockSuggestions = [
  {
    _id: "s1",
    idea: "i1",
    author: "u1",
    content: "We could turn this idea into a mobile app with a simple onboarding flow.",
    createdAt: "2026-04-20T10:15:00.000Z",
    updatedAt: "2026-04-20T10:15:00.000Z",
  },
  {
    _id: "s2",
    idea: "i1",
    author: "u2",
    content: "Maybe start with a landing page to validate interest before building.",
    createdAt: "2026-04-20T11:05:00.000Z",
    updatedAt: "2026-04-20T11:05:00.000Z",
  },
  {
    _id: "s3",
    idea: "i1",
    author: "u3",
    content: "We should add a voting system so users can prioritize features.",
    createdAt: "2026-04-20T12:30:00.000Z",
    updatedAt: "2026-04-20T12:30:00.000Z",
  },
  {
    _id: "s4",
    idea: "i1",
    author: "u1",
    content: "Consider integrating notifications for updates and new proposals.",
    createdAt: "2026-04-20T13:45:00.000Z",
    updatedAt: "2026-04-20T13:45:00.000Z",
  }
]

const authorColors: Record<string, string> = {
  u1: "bg-violet-400",
  u2: "bg-sky-400",
  u3: "bg-emerald-400",
  u4: "bg-rose-400",
}

function getColor(authorId: string) {
  return authorColors[authorId] ?? "bg-slate-400"
}

interface Props {
  suggests?: SuggestionType[]
}

export default function SuggestionsList({ suggests }: Props) {
  const items = suggests ?? mockSuggestions

  return (
    <div className="flex flex-col gap-3">
      {items.map((s) => (
        <div key={s._id} className=" overflow-hidden">
          
          {/* Author bar */}
          <div className={`h-1 w-full ${getColor(s.author)}`} />
          
          <div className="px-4 pt-3 pb-4">
            {/* Author label */}
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              {s.author}
            </p>

            {/* Content */}
            <p className="text-sm leading-relaxed text-slate-700">
              {s.content}
            </p>
          </div>

        </div>
      ))}
    </div>
  )
}