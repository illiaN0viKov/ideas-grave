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
import type { IdeaType } from "@/lib/types/types.project";
import React, { useState } from "react";
import { createIdea } from "@/lib/actions/idea";

interface FormData {
  title: string
}

const INITIAL_FORM_DATA: FormData = {
  title: "",
};

type IdeasCreateDialogProps = {
  lobbyId: string
  onCreate: () => void
}

export default function IdeasCreateDialog({ lobbyId, onCreate }: IdeasCreateDialogProps) {
  const [open, setOpen] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault()
      if (!formData.title.trim()) return

      setSubmitting(true)

      try {
        const idea = await createIdea({
          title: formData.title.trim(),
          lobbyId,
        })
        setFormData(INITIAL_FORM_DATA)
        setOpen(false)
        onCreate()  // call AFTER close, state update is async anyway
      } catch (error) {
        console.error("Failed to create idea", error)
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
          <Plus className="mr-2 h-4 w-4" />
          Add Idea
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add idea</DialogTitle>
          <DialogDescription>
            Add a new idea.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idea-name">Idea</Label>
              <Input
                id="idea-name"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Finish book"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating..." : "Add idea"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}