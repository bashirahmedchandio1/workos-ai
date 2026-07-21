import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { PlusCircle, Workflow, Play, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function WorkflowsPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Workflows</h1>
          <p className="text-sm text-text-secondary">Manage your automation workflows</p>
        </div>
        <Button asChild>
          <Link href="/workflows/new">
            <PlusCircle size={16} className="mr-1" />
            New Workflow
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-border">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-surface text-text-tertiary">
            <Workflow size={24} />
          </div>
          <h3 className="text-sm font-medium text-text-primary mb-1">No workflows yet</h3>
          <p className="text-xs text-text-secondary mb-4 max-w-xs">
            Create your first automation workflow by describing what you want to do in plain English.
          </p>
          <Button asChild>
            <Link href="/workflows/new">
              <PlusCircle size={16} className="mr-1" />
              Create Workflow
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
