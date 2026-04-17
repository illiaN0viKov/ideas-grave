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
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-black/10 pt-4">
      
      <p className="text-sm text-black/70">
        {email ? (
          <>
            Signed in as <span className="text-black font-medium">{email}</span>
          </>
        ) : (
          "Signed in"
        )}
      </p>

      <Button
        variant="outline"
        onClick={handleSignOut}
        disabled={loading}
        className="text-black hover:bg-black/5"
      >
        {loading ? "..." : "Log out"}
      </Button>
    </div>
  )
}