"use client"

import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const clerk = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await clerk.signOut()
    router.push("/")
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleSignOut}>
      Sign Out
    </Button>
  )
}
