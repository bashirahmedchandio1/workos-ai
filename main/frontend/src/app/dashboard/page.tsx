import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { syncUser } from "@/lib/sync-user"

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

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-text-primary">
            Welcome, {user?.fullName ?? user?.firstName ?? "User"}
          </h1>
          <p className="text-text-secondary">
            Your workflows and automations will appear here.
          </p>
        </div>

        <div className="grid gap-4">
          <div className="p-6 bg-surface border border-border rounded-xl">
            <h2 className="font-semibold text-text-primary mb-2">Account Details</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-secondary">Name</dt>
                <dd className="text-text-primary">{user?.fullName ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">Email</dt>
                <dd className="text-text-primary">{user?.emailAddresses[0]?.emailAddress ?? "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">User ID</dt>
                <dd className="text-text-primary font-mono text-xs">{user?.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}
