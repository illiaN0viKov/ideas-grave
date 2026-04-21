"use client"

import React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type Step = "suggestion" | "voting"
type VoteType = "abandon" | "change_name" | null

export default function SuggestVoteDialog() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("suggestion")
  const [suggestionText, setSuggestionText] = useState("")
  const [voteType, setVoteType] = useState<VoteType>(null)
  const [newName, setNewName] = useState("")
  const [loading, setLoading] = useState(false)

  function handleClose() {
    setOpen(false)
    setStep("suggestion")
    setSuggestionText("")
    setVoteType(null)
    setNewName("")
  }

  async function handleSendSuggestion() {
    if (!suggestionText.trim()) return
    setLoading(true)
    try {
      // await createSuggestion({ content: suggestionText })
      handleClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleStartVote() {
    if (!voteType) return
    if (voteType === "change_name" && !newName.trim()) return
    setLoading(true)
    try {
      // await createVote({ type: voteType, newName: voteType === "change_name" ? newName : undefined })
      handleClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else setOpen(true) }}>

      <DialogTrigger asChild>
        <Button variant="outline"
          className="h-20 py-6 px-6 text-sm font-semibold rounded-xl">
            Suggest | Vote</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            {step === "suggestion" ? "Write a suggestion" : "Start a vote"}
          </DialogTitle>

          {/* Tab switcher */}
          <div className="flex gap-1 mt-3 rounded-xl bg-black/5 p-1">
            <button
              onClick={() => setStep("suggestion")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${
                step === "suggestion"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Suggestion
            </button>
            <button
              onClick={() => setStep("voting")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${
                step === "voting"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Voting
            </button>
          </div>
        </DialogHeader>

        {/* Suggestion step */}
        {step === "suggestion" && (
          <>
            <div className="space-y-2">
              <Label className="text-xs text-slate-500">Your suggestion</Label>
              <Textarea
                rows={4}
                placeholder="Share your idea or improvement..."
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                className="resize-none rounded-xl border-black/10 bg-black/5 text-sm focus-visible:ring-0"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button
                onClick={handleSendSuggestion}
                disabled={loading || !suggestionText.trim()}
              >
                {loading ? "Sending..." : "Send"}
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Voting step */}
        {step === "voting" && (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-slate-500">Vote type</Label>
                <div className="flex flex-col gap-2">
                  {[
                    { value: "abandon", label: "Abandon", desc: "Propose to drop this idea entirely" },
                    { value: "change_name", label: "Change name", desc: "Propose a new name for this idea" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setVoteType(opt.value as VoteType)}
                      className={`flex flex-col items-start rounded-xl border px-4 py-3 text-left transition ${
                        voteType === opt.value
                          ? "border-slate-950 bg-slate-950 text-white"
                          : "border-black/10 bg-white hover:bg-black/5 text-slate-950"
                      }`}
                    >
                      <span className="text-sm font-medium">{opt.label}</span>
                      <span className={`text-xs mt-0.5 ${voteType === opt.value ? "text-slate-300" : "text-slate-400"}`}>
                        {opt.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {voteType === "change_name" && (
                <div className="space-y-2">
                  <Label className="text-xs text-slate-500">Proposed name</Label>
                  <Textarea
                    rows={2}
                    placeholder="Enter the new name..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="resize-none rounded-xl border-black/10 bg-black/5 text-sm focus-visible:ring-0"
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button
                onClick={handleStartVote}
                disabled={loading || !voteType || (voteType === "change_name" && !newName.trim())}
              >
                {loading ? "Starting..." : "Start vote"}
              </Button>
            </DialogFooter>
          </>
        )}

      </DialogContent>
    </Dialog>
  )
}