"use client"

import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/sign-in")
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleSignOut}>
      Sign Out
    </Button>
  )
}
