"use client"

import { useMemo, useState } from "react"
import SignedInProfile from "@/components/SignedInProfile"
import SignedInLobbies from "@/components/SignedInLobbies"
import SignedInIdeas from "@/components/SignedInIdeas"
import { ideas } from "@/app/data/ideas"

type Lobby = {
  id: string
  title: string
  description: string
  ideaIds: string[]
}

const lobbies: Lobby[] = [
  {
    id: "l1",
    title: "Core product lobby",
    description: "Active ideas and votes around the product roadmap.",
    ideaIds: ["i1", "i2"],
  },
  {
    id: "l2",
    title: "Design review",
    description: "Feedback, suggestions, and visual updates for UI decisions.",
    ideaIds: ["i1", "i3"],
  },
  {
    id: "l3",
    title: "Long-term backlog",
    description: "Ideas waiting to be graved or moved to the clouds.",
    ideaIds: ["i3"],
  },
]

type Props = {
  userEmail?: string
}

export default function LandscapeSignedIn({ userEmail }: Props) {
    
  const [selectedLobbyId, setSelectedLobbyId] = useState(lobbies[0].id)
  const selectedLobby = lobbies.find((lobby) => lobby.id === selectedLobbyId)

  const selectedIdeas = useMemo(
    () => ideas.filter((idea) => selectedLobby?.ideaIds.includes(idea.id)),
    [selectedLobbyId]
  )

  return (
    <div className="space-y-12">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <SignedInProfile userEmail={userEmail} lobbyCount={lobbies.length} ideaCount={ideas.length} />
        <SignedInLobbies
          lobbies={lobbies}
          selectedLobbyId={selectedLobbyId}
          onSelectLobby={setSelectedLobbyId}
          selectedLobby={selectedLobby}
        />
      </div>

      {selectedLobby ? (
        <SignedInIdeas selectedLobbyTitle={selectedLobby.title} selectedIdeas={selectedIdeas} />
      ) : null}
    </div>
  )
}
