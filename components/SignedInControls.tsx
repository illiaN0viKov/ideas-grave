"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth/auth-client"

export default function SignedInControls({ email }: { email?: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSignOut() {
    setLoading(true)

    try {
      await signOut()
      router.push("/")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
      <p className="text-sm text-slate-300">
        Signed in as <span className="font-semibold text-white">{email ?? "you"}</span>
      </p>
      <Button variant="secondary" size="lg" onClick={handleSignOut} disabled={loading}>
        {loading ? "Signing out..." : "Log out"}
      </Button>
    </div>
  )
}
