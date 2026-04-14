import Link from "next/link"

export default function LandscapeSignedOut() {
  return (
    <div className="space-y-12">
      <section className="rounded-[2rem] border border-black/10 bg-black/5 p-10 sm:p-14">
        <div className="space-y-6 max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">ideas-grave</p>
          <h1 className="text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Build idea lobbies, grave stalled plans, and keep completed work in the clouds.
          </h1>
          <p className="text-base leading-8 text-slate-700 sm:text-lg">
            A minimal collaboration home where everyone can post ideas, suggest changes, vote on direction, and mark every item as active, graved, or done.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-3xl border border-black/10 bg-black px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-950"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center rounded-3xl border border-black/10 bg-transparent px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-black/5"
          >
            Sign up
          </Link>
        </div>
      </section>

      <section className="rounded-[2rem] border border-black/10 bg-black/5 p-10 sm:p-12">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">How it works</p>
          <h2 className="text-3xl font-semibold text-slate-950">Organize ideas without clutter.</h2>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Lobbies</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Create shared rooms for idea threads and keep the conversation focused on what matters.
            </p>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Statuses</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Ideas can be active, graved if not moving forward, or moved into the clouds once they are done.
            </p>
          </div>
          <div className="rounded-3xl border border-black/10 bg-white p-5">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Input</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Everyone can post suggestions and vote to change or abandon ideas as a team.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
