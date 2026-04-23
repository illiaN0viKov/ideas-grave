"use client"

import { IdeaType, LobbyType, SuggestionType } from "@/lib/types/types.project"
import React, { useEffect, useState } from "react"
import Idea from "./Idea"
import IdeasConfigDialog from "./idea-config-dialog"
import { useSession } from "@/lib/auth/auth-client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Plus, Pencil, Copy, Link, ArrowLeft } from "lucide-react"
import { getIdeas, updateIdea } from "@/lib/actions/idea"
import SuggestionsList from "./suggestions"
import SuggestVoteDialog from "./suggest-vote-dialog"
import VotingTracker from "./voting-tracker"
import { getSuggestions } from "@/lib/actions/suggestion"
import { getActiveVotingSession } from "@/lib/actions/vote"

interface Props {
    idea: IdeaType
    lobby: LobbyType
    selectIdea: (idea: IdeaType | null) => void
    onDelete: () => void
}

export default function IdeaView({ idea, selectIdea, lobby, onDelete }: Props) {


    // useEffect(() => {
    // async function fetchSuggestions() {
    //     try {
    //     const suggestions = await getSuggestions(idea._id.toString())
    //     setSuggestions(suggestions)
    //     } catch (err) {
    //     console.error(err)
    //     }
    // }
    // fetchSuggestions()
    // },  [idea, lobby, selectIdea])
    
    

    const session = useSession()
    const isIdeaOwner = session.data?.user.id.toString() === idea.creator.toString()
    const isLobbyOwner = session.data?.user.id.toString() === lobby.owner.toString()

    const [open, setOpen] = useState(false)
    const [description, setDescription] = useState(idea.description ?? "")
    const [suggestions, setSuggestions] = useState<SuggestionType[] | []>([])
    const [saving, setSaving] = useState(false)

    const [activeVoting, setActiveVoting] = useState(false)
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
    const [currentIdea, setCurrentIdea] = useState<IdeaType>(idea)


        function updateIdeaLocal(updated: IdeaType) {
            setCurrentIdea(updated)
            selectIdea(updated)
        }

    useEffect(() => {
        async function fetchInitialData() {
            try {
                const [suggestions, activeSession] = await Promise.all([
                    getSuggestions(idea._id.toString()),
                    getActiveVotingSession(idea._id.toString()),
                ])
                setSuggestions(suggestions)
                if (activeSession) {
                    setActiveVoting(true)
                    setActiveSessionId(activeSession._id)
                } else {
                    setActiveVoting(false)
                    setActiveSessionId(null)
                }
            } catch (err) {
                console.error(err)
            }
        }
        fetchInitialData()
    }, [idea, lobby, selectIdea])


    async function handleSaveDescription() {
        if (!description.trim()) return
        setSaving(true)
        try {
            await updateIdea({ ideaId: idea._id.toString(), description: description.trim() })
            selectIdea({ ...idea, description })
            setOpen(false)
        } catch (err) {
            console.error(err)
        } finally {
            setSaving(false)
        }
    }

    async function refetchSuggestions() {
        const suggestions = await getSuggestions(idea._id.toString())
        setSuggestions(suggestions)

        }

        async function refetchIdea() {
            const ideas = await getIdeas(lobby._id.toString())
            const updated = ideas.find((i: IdeaType) => i._id.toString() === currentIdea._id.toString())
            if (updated) updateIdeaLocal(updated)
        }

        async function refetchAll() {
            await Promise.all([refetchSuggestions(), refetchIdea()])
        }

    return (
        <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_0.8fr]">

            {/* Left — IdeaView */}
            <section className="rounded-[2rem] border border-black/10 bg-black/5 p-8 sm:p-10">

            {/* Header */}
            <div className="space-y-2 border-b border-black/10 pb-6">
            <div className="flex items-start justify-between">

                <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => selectIdea(null)}
                    className="h-8 w-8 p-0 -ml-2"
                >
                    <ArrowLeft className="h-8 w-8" />
                </Button>

                <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5">
                    <Link className="h-3.5 w-3.5" />
                    Invite
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                    <DialogTitle className="text-base font-semibold">Invite to lobby</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-black/5 px-4 py-3">
                    <p className="flex-1 font-mono text-sm tracking-widest text-slate-700">
                        {lobby.inviteCode}
                    </p>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => navigator.clipboard.writeText(lobby.inviteCode)}
                    >
                        <Copy className="h-4 w-4" />
                    </Button>
                    </div>
                </DialogContent>
                </Dialog>
            </div>

                <h2 className="text-2xl font-semibold uppercase text-slate-950">
                    {lobby.name}
                </h2>

                <p className="text-lg text-slate-500">
                    {lobby.description}
                </p>

                <p className="text-md text-slate-400">
                    {lobby.members.length} active {lobby.members.length === 1 ? "member" : "members"}
                </p>
                </div>

                <div className="flex justify-start py-4">
                <IdeasConfigDialog
                    idea={currentIdea}
                    onDelete={onDelete}
                    isIdeaOwner={isIdeaOwner}
                    isLobbyOwner={isLobbyOwner}
                    selectIdea={selectIdea}
                />
                </div>
                

            <div className="flex items-center justify-between mt-4">

                <Idea idea={idea} className1="w-52 h-52" className2="w-36 h-36"/>

                    {activeVoting ? (
                    <VotingTracker
                        memberCount={lobby.members.length}
                        ideaId={idea._id.toString()}
                        onSessionEnd={() => {
                            setActiveVoting(false)
                            setActiveSessionId(null)
                            refetchAll()
                        }}/> 
                    ) : (
                        <SuggestVoteDialog onVoteStart={setActiveVoting} ideaId={idea._id.toString()}
                        lobbyId={lobby._id.toString()} onSuggestChange={refetchSuggestions}/>

                    )}



            </div>

            </section>

        <div className="flex flex-col gap-6">


            {/* Right — Notes */}
            <div className="rounded-2xl border border-black/15 bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Idea Notes</p>
                    {idea.description && isIdeaOwner && (
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <button className="text-slate-400 hover:text-slate-700 transition">
                                    <Pencil className="h-3.5 w-3.5" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="text-base font-semibold">Edit notes</DialogTitle>
                                </DialogHeader>
                                <Textarea
                                    rows={5}
                                    placeholder="Describe this idea..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="resize-none rounded-xl border-black/10 bg-black/5 text-sm focus-visible:ring-0"
                                />
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                    <Button onClick={handleSaveDescription} disabled={saving || !description.trim()}>
                                        {saving ? "Saving..." : "Save"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                

                {idea.description ? (
                    <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap break-words">
                        {idea.description}
                    </p>
                ) : isIdeaOwner  ? ( 
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <button className="group flex w-full items-center justify-center rounded-xl border border-dashed border-black/20 py-6 transition hover:border-black/40 hover:bg-black/5">
                                <Plus className="h-4 w-4 text-slate-400 group-hover:text-slate-700 transition" />
                            </button>
                        </DialogTrigger>

                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-base font-semibold">Add notes</DialogTitle>
                            </DialogHeader>
                            <Textarea
                                rows={5}
                                placeholder="Describe this idea..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="resize-none rounded-xl border-black/10 bg-black/5 text-sm focus-visible:ring-0"
                            />
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button onClick={handleSaveDescription} disabled={saving || !description.trim()}>
                                    {saving ? "Saving..." : "Save"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog> ) :
                    (
                          <div className="flex items-center justify-center py-6 text-xs text-slate-400">
                        No notes
                    </div>
                )}

            </div>



                {/* Proposals History */}
                <div className="rounded-2xl border border-black/15 bg-white p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Proposals History</p>
                    </div>

                    <SuggestionsList suggests={suggestions} isLobbyOwner={isLobbyOwner} onDelete={refetchSuggestions}/>

                </div>

        </div>


        </div>
    )
}