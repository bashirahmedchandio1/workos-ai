import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { syncUser } from "@/lib/sync-user"
import { DashboardHome } from "./dashboard-home"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const { isAuthenticated } = await auth()

  if (!isAuthenticated) {
    redirect("/sign-in")
  }

  const user = await currentUser()

  if (user) {
    await syncUser({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      name: user.fullName ?? user.firstName ?? user.username ?? "User",
      image: user.imageUrl,
    })
  }

  return <DashboardHome />
}
