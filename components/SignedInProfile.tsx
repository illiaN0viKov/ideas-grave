import SignedInControls from "@/components/SignedInControls"

type Props = {
  userEmail?: string
  lobbyCount: number
  ideaCount: number
}

export default function SignedInProfile({ userEmail, lobbyCount, ideaCount }: Props) {
  return (
    <section className="rounded-[2rem] border border-black/10 bg-black/5 p-10 sm:p-14">
      <div className="space-y-6 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">My profile</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Welcome back, {userEmail ? userEmail.split("@")[0] : "creator"}.
        </h1>
        <p className="text-base leading-8 text-slate-700 sm:text-lg">
          Your activity, lobby membership, and idea status all live here. Pick a lobby to view ideas below.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Lobbies</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{lobbyCount} active rooms</p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white p-5">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Ideas</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{ideaCount} total items across your workspaces</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <SignedInControls email={userEmail} />
      </div>
    </section>
  )
}
