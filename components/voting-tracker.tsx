"use client"

import { useEffect, useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { castVote, getActiveVotingSession } from "@/lib/actions/vote"
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface ActiveSession {
  _id: string
  type: "change" | "abandon"
  payload?: { newName?: string }
  ups: number
  downs: number
  totalVotes: number
  userVote: "up" | "down" | null
}

interface Props {
  ideaId: string
  memberCount: number
  onSessionEnd: () => void
}

export default function VotingTracker({ ideaId, memberCount, onSessionEnd }: Props) {
  const [session, setSession] = useState<ActiveSession | null>(null)
  const [isPending, startTransition] = useTransition()

  async function fetchSession() {
    const data = await getActiveVotingSession(ideaId)
    setSession(data)
    if (!data) onSessionEnd()
  }

  useEffect(() => {
    fetchSession()
    const interval = setInterval(fetchSession, 10000) // poll every 10s
    return () => clearInterval(interval)
  }, [ideaId])

  async function handleVote(value: "up" | "down") {
    if (!session) return
    startTransition(async () => {
      await castVote({ sessionId: session._id, ideaId, value })
      await fetchSession()
    })
  }

  if (!session){return null}

  const majority = Math.floor(memberCount / 2) + 1

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 space-y-4">

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Active Vote</p>
        <p className="text-sm font-semibold text-slate-950">
          {session.type === "abandon" ? "Propose to abandon this idea" : `Rename to "${session.payload?.newName}"`}
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400">
          <span>{session.totalVotes} / {memberCount} voted</span>
          <span>needs {majority} to decide</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-black/5 overflow-hidden">
          <div
            className="h-full bg-slate-950 rounded-full transition-all"
            style={{ width: `${(session.totalVotes / memberCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Vote counts */}
      <div className="flex gap-3">
        <div className="flex-1 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-center">
          <p className="text-lg font-semibold text-emerald-700">{session.ups}</p>
          <p className="text-xs text-emerald-500">For</p>
        </div>
        <div className="flex-1 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-center">
          <p className="text-lg font-semibold text-red-700">{session.downs}</p>
          <p className="text-xs text-red-400">Against</p>
        </div>
      </div>

      {/* Vote buttons */}
      {session.userVote ? (
        <p className="text-center text-xs text-slate-400">
          You voted <span className="font-medium text-slate-600">{session.userVote === "up" ? "for" : "against"}</span>
        </p>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-2 rounded-xl"
            onClick={() => handleVote("up")}
            disabled={isPending}
          >
            <ThumbsUp className="h-4 w-4" /> For
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2 rounded-xl"
            onClick={() => handleVote("down")}
            disabled={isPending}
          >
            <ThumbsDown className="h-4 w-4" /> Against
          </Button>
        </div>
      )}

    </div>
  )
}