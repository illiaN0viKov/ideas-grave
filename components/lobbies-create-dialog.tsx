"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { createLobby, joinLobby } from "@/lib/actions/lobby"
import React, { useState } from "react";

interface FormData {
  name: string
  description: string
}

const INITIAL_FORM_DATA: FormData = { name: "", description: "" }

export default function LobbiesCreateDialog() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"create" | "join">("create")
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [inviteCode, setInviteCode] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleClose() {
    setOpen(false)
    setStep("create")
    setFormData(INITIAL_FORM_DATA)
    setInviteCode("")
    setError(null)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.name.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await createLobby({
        name: formData.name.trim(),
        description: formData.description.trim(),
      })
      handleClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteCode.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      await joinLobby({ inviteCode: inviteCode.trim() })
      handleClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else setOpen(true) }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="inline-flex h-11 items-center justify-center rounded-3xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-black/5"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{step === "create" ? "Create lobby" : "Join lobby"}</DialogTitle>
          <DialogDescription>
            {step === "create"
              ? "Add a new shared room for ideas, suggestions, and voting."
              : "Enter an invite code to join an existing lobby."}
          </DialogDescription>

          {/* Tab switcher */}
          <div className="flex gap-1 mt-3 rounded-xl bg-black/5 p-1">
            <button
              type="button"
              onClick={() => { setStep("create"); setError(null) }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${
                step === "create"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => { setStep("join"); setError(null) }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition ${
                step === "join"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Join
            </button>
          </div>
        </DialogHeader>

        {/* Create form */}
        {step === "create" && (
          <form className="space-y-6" onSubmit={handleCreate}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lobby-name">Lobby name</Label>
                <Input
                  id="lobby-name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Product roadmap"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lobby-description">Description</Label>
                <Textarea
                  id="lobby-description"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is this lobby for?"
                />
              </div>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create lobby"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* Join form */}
        {step === "join" && (
          <form className="space-y-6" onSubmit={handleJoin}>
            <div className="space-y-2">
              <Label htmlFor="invite-code">Invite code</Label>
              <Input
                id="invite-code"
                required
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                placeholder="e.g. ABC12345"
                className="font-mono tracking-widest"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Joining..." : "Join lobby"}
              </Button>
            </DialogFooter>
          </form>
        )}

      </DialogContent>
    </Dialog>
  );
}