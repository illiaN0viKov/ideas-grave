"use client";

import { LobbyType } from "@/lib/types/types.project";
import { useRef, useState, useEffect } from "react";
import LobbiesCreateDialog from "./lobbies-create-dialog";
import autoAnimate from "@formkit/auto-animate"

export default function LobbiesClient({ lobbies }: { lobbies: LobbyType[] }) {
  const [selectedLobbyId, setSelectedLobbyId] = useState<string | null>(null);

  const selectedLobby = lobbies.find((l) => l._id.toString() === selectedLobbyId);

  const parent = useRef<HTMLDivElement | null>(null)

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
            <button
              key={lobby._id.toString()}
              onClick={() => setSelectedLobbyId(lobby._id.toString())}
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
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {lobby.description}
                </p>
              )}
            </button>
          );
        })}
      </div>


    </section>
  );
}