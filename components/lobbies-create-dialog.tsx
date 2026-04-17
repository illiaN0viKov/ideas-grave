"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
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
import { createLobby } from "@/lib/actions/lobby"
import { useRouter } from "next/navigation"
import React, { useState } from "react";

interface FormData {
  name: string
  description: string
}

const INITIAL_FORM_DATA: FormData = {
  name: "",
  description: "",
};

export default function LobbiesCreateDialog() {
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.name.trim()) return

    setSubmitting(true)

    try {
      await createLobby({
        name: formData.name.trim(),
        description: formData.description.trim(),
      })
      setFormData(INITIAL_FORM_DATA)
      setOpen(false)
    } catch (error) {
      console.error("Failed to create lobby", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="inline-flex h-11 items-center justify-center rounded-3xl border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-black/5"
        >
          <Plus className=" h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create lobby</DialogTitle>
          <DialogDescription>
            Add a new shared room for ideas, suggestions, and voting.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit}>
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <DialogClose asChild>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Creating..." : "Create lobby"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}