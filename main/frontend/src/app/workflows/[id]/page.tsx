import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Play, History, AlertCircle, CheckCircle, Clock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function WorkflowDetailPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          href="/workflows"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Workflows
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">Workflow Name</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-text-tertiary">
                <Clock size={12} />
                Created 2 hours ago
              </span>
              <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                <CheckCircle size={12} />
                Active
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/workflows/sample-id/approve`}>
                <CheckCircle size={14} className="mr-1" />
                Approve Run
              </Link>
            </Button>
            <Button size="sm">
              <Play size={14} className="mr-1" />
              Run Now
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border p-4">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Workflow Plan</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-lg border border-warning/20 bg-warning/5 px-3 py-2.5">
                <ZapIcon />
                <span className="text-sm text-text-primary font-medium">New Gmail Email</span>
              </div>
              <div className="flex justify-center">
                <ArrowDownSmall />
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
                <SparklesIcon />
                <div>
                  <span className="text-sm text-text-primary font-medium">Save Attachment to Drive</span>
                  <span className="block text-xs text-text-tertiary">Google Drive</span>
                </div>
              </div>
              <div className="flex justify-center">
                <ArrowDownSmall />
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
                <SparklesIcon />
                <div>
                  <span className="text-sm text-text-primary font-medium">Notify Slack Channel</span>
                  <span className="block text-xs text-text-tertiary">Slack</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border p-4">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Run History</h2>
            <div className="space-y-2">
              {[
                { status: "completed", time: "2 min ago", duration: "12s" },
                { status: "completed", time: "1 hour ago", duration: "8s" },
                { status: "failed", time: "3 hours ago", duration: "45s" },
              ].map((run, i) => (
                <Link
                  key={i}
                  href={`/workflows/sample-id/runs/run-${i}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {run.status === "completed" ? (
                      <CheckCircle size={14} className="text-success" />
                    ) : (
                      <AlertCircle size={14} className="text-error" />
                    )}
                    <div>
                      <span className="text-xs text-text-primary">{run.time}</span>
                      <span className="block text-[10px] text-text-tertiary">{run.duration}</span>
                    </div>
                  </div>
                  <History size={14} className="text-text-tertiary" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ZapIcon() {
  return (
    <div className="flex size-7 items-center justify-center rounded-full bg-warning/10 text-warning">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10" /></svg>
    </div>
  )
}

function SparklesIcon() {
  return (
    <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/></svg>
    </div>
  )
}

function ArrowDownSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
  )
}
