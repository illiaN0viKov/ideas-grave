"use client";

import { LobbyType } from "@/lib/types/types.project";
import { useRef, useState, useEffect } from "react";
import LobbiesCreateDialog from "./lobbies-create-dialog";
import autoAnimate from "@formkit/auto-animate"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { deleteLobby, updateLobby } from "@/lib/actions/lobby";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Dialog } from "./ui/dialog";

export default function LobbiesClient({ lobbies, onSelectLobby  }: 
  { lobbies: LobbyType[], onSelectLobby: (lobby: LobbyType | null) => void; }) {
  const [selectedLobbyId, setSelectedLobbyId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false)
      const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    
  

  
  const selectedLobby = lobbies.find((l) => l._id.toString() === selectedLobbyId);


    const [formData, setFormData] = useState({
    name: selectedLobby?.name|| "",
    description: selectedLobby?.description || "",
  });

  useEffect(() => {
  if (selectedLobby) {
    setFormData({
      name: selectedLobby.name,
      description: selectedLobby.description,
    });
  }
}, [selectedLobby]);

    const [isEditing, setIsEditing] = useState(false);

  const parent = useRef<HTMLDivElement | null>(null)

      async function handleDelete() {
        if (!selectedLobbyId) return;
        setShowDeleteConfirm(false)

      await deleteLobby({ lobbyId: selectedLobbyId })
      }


          const handleSelectLobby = (lobby: LobbyType) => {
            setSelectedLobbyId(lobby._id.toString());
            onSelectLobby(lobby);
          };

      async function handleUpdate(e: React.FormEvent) {
        e.preventDefault();

        if (!selectedLobbyId) return;

        try {
          setSubmitting(true);

          await updateLobby({
            lobbyId: selectedLobbyId,
            name: formData.name,
            description: formData.description,
          });

          setIsEditing(false);
        } catch (err) {
          console.error(err);
        } finally {
          setSubmitting(false);
        }
      }
  

  useEffect(() => {
    if (parent.current) {
      autoAnimate(parent.current)
    }
  }, [parent])

  return (
    <section className="min-h-[320px] rounded-[2rem] border border-black/10 bg-black/5 p-10 sm:p-12">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
            My lobbies
          </p>
          <h2 className="text-3xl font-semibold text-slate-950">
            Select a room
          </h2>
        </div>

            <LobbiesCreateDialog />

      </div>

      <div ref={parent} className="mt-6 flex max-h-[320px] flex-col gap-4 overflow-y-auto pr-2">

        {lobbies.map((lobby) => {
          const isActive = lobby._id.toString() === selectedLobbyId;
          

          return (
            <div
              key={lobby._id.toString()}
              onClick={() => handleSelectLobby(lobby)}
              className={`rounded-3xl border px-5 py-4 text-left transition ${
                isActive
                  ? "border-black bg-slate-950 text-white"
                  : "border-black/10 bg-white text-slate-950 hover:bg-black/5"
              }`}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                {lobby.name}
              </p>

              {isActive && (

                 <div className="flex justify-between gap-1">

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {lobby.description}
                </p>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6"
                   onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={()=>setShowDeleteConfirm(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              

            </div>
              )}
            </div>
          );
        })}

      </div>

          <Dialog open={isEditing} onOpenChange={setIsEditing}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit lobby</DialogTitle>
          <DialogDescription>
            Add a new shared room for ideas, suggestions, and voting.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-6" onSubmit={handleUpdate}>
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
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <DialogClose asChild>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save lobby"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
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


    </section>

    
  );
}