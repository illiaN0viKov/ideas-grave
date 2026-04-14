import { getSession } from "@/lib/auth/auth"
import LandscapeSignedIn from "@/components/LandscapeSignedIn"
import LandscapeSignedOut from "@/components/LandscapeSignedOut"

export default async function Home() {
  const session = await getSession()
  const userEmail = session?.user?.email ?? session?.user?.name

  return (
    <main className="min-h-screen bg-white text-slate-950 px-6 py-16 sm:px-10">
      {session?.user ? <LandscapeSignedIn userEmail={userEmail} /> : <LandscapeSignedOut />}
    </main>
  )
}
