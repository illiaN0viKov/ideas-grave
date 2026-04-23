"use client";

import { Settings, Trash2 } from "lucide-react";
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
import React, { useEffect, useState } from "react";
import { IdeaType } from "@/lib/types/types.project";
import { deleteIdea, updateIdea } from "@/lib/actions/idea";

type IdeaStatus = "active" | "abandoned" | "done";

interface IdeaConfigDialogProps {
  idea: IdeaType
  isIdeaOwner?: boolean;
  isLobbyOwner?: boolean;
selectIdea: (idea: IdeaType | null) => void
    onDelete: ()=>void


}

export default function IdeasConfigDialog({
  idea,
  isIdeaOwner,
  isLobbyOwner,
  selectIdea,
  onDelete


}: IdeaConfigDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(idea.title);
  const [status, setStatus] = useState<IdeaStatus>(idea.status);
  const [description, setDescription] = useState(idea.description);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const isCreator = isIdeaOwner

      useEffect(() => {
        setTitle(idea.title)
        setStatus(idea.status)
        setDescription(idea.description)
    }, [idea])

        async function handleSave() {
        setLoading(true);
        try {
            await updateIdea({
            ideaId: idea._id.toString(),
            title,
            status,
            description
            });
            selectIdea({
             ...idea!,
            title,
            description,
            status
            })
            setOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        }

  async function handleDelete() {
    setShowDeleteConfirm(false);
    setLoading(true);
    try {
      await deleteIdea({ideaId:idea._id.toString()});
      selectIdea(null)
      onDelete()
      setOpen(false);
    } 
    finally {
      setLoading(false);
    }
  }

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-2xl">
          <Settings className="mr-2 h-4 w-4" />
          Config
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Idea Config</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title (editable only by creator) */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              disabled={!isCreator}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              value={status}
                disabled={!isCreator}
              onChange={(e) => setStatus(e.target.value as IdeaStatus)}
              className="w-full rounded-md border px-3 py-2 text-sm"
            >
              <option value="active">Active</option>
              <option value="done">Done</option>
              <option value="abandoned">Abandoned</option>
            </select>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          {/* Delete (only lobby owner) */}
          {isLobbyOwner && (
            <Button
            
              variant="destructive"
                onClick={() => {
                setShowDeleteConfirm(true);
                }}
              disabled={loading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}

        <Button onClick={!isCreator ? () => setOpen(false) : handleSave} disabled={isCreator && loading}>
          {!isCreator ? "Close" : loading ? "Saving..." : "Save"}
        </Button>
        
        </DialogFooter>
      </DialogContent>
    </Dialog>

        {/* Delete Confirmation Dialog */}
    <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Idea?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the idea? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Idea
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}