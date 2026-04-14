type Lobby = {
  id: string
  title: string
  description: string
}

type Props = {
  lobbies: Lobby[]
  selectedLobbyId: string
  onSelectLobby: (id: string) => void
  selectedLobby?: Lobby
}

export default function SignedInLobbies({ lobbies, selectedLobbyId, onSelectLobby, selectedLobby }: Props) {
  return (
    <section className="min-h-[320px] rounded-[2rem] border border-black/10 bg-black/5 p-10 sm:p-12">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">My lobbies</p>
        <h2 className="text-3xl font-semibold text-slate-950">Select a room</h2>
      </div>

      <div className="mt-6 flex max-h-[320px] flex-col gap-4 overflow-y-auto pr-2">
        {lobbies.map((lobby) => {
          const isActive = lobby.id === selectedLobbyId
          return (
            <button
              key={lobby.id}
              type="button"
              onClick={() => onSelectLobby(lobby.id)}
              className={`rounded-3xl border px-5 py-4 text-left transition ${
                isActive
                  ? "border-black bg-slate-950 text-white"
                  : "border-black/10 bg-white text-slate-950 hover:bg-black/5"
              }`}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{lobby.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{lobby.description}</p>
            </button>
          )
        })}
      </div>

      <div className="mt-6 rounded-3xl border border-black/10 bg-white p-5">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Selected lobby</p>
        <p className="mt-2 text-lg font-semibold text-slate-950">{selectedLobby?.title}</p>
        <p className="mt-3 text-sm leading-6 text-slate-700">{selectedLobby?.description}</p>
      </div>
    </section>
  )
}
