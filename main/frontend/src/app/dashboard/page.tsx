import { getAuth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SignOutButton } from "./sign-out-button"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const auth = await getAuth().catch(() => null)
  if (!auth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-2xl font-semibold text-text-primary">Configuration Required</h1>
          <p className="text-text-secondary">
            Set <code className="text-primary">DATABASE_URL</code> in{" "}
            <code className="text-primary">.env.local</code> with your NeonDB connection string
            to enable authentication.
          </p>
        </div>
      </div>
    )
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary">⟐</span>
            <span className="font-semibold text-text-primary">WorkOS AI</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">
              {session.user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-text-primary">
              Welcome, {session.user.name}
            </h1>
            <p className="text-text-secondary">
              You are signed in to WorkOS AI. Your workflows and automations will appear here.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="p-6 bg-surface border border-border rounded-xl">
              <h2 className="font-semibold text-text-primary mb-2">Account Details</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Name</dt>
                  <dd className="text-text-primary">{session.user.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Email</dt>
                  <dd className="text-text-primary">{session.user.email}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
