import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Clock, AlertTriangle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const dynamic = "force-dynamic"

export default async function ApprovalsPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Approvals</h1>
          <p className="text-sm text-text-secondary">Review and approve pending workflow executions</p>
        </div>
      </div>

      <div className="space-y-3">
        <ApprovalCard
          title="Process Invoice Attachments"
          description="Check Gmail for new invoice emails, download attachments, upload to Google Drive, notify Slack"
          trigger="New email from invoices@company.com"
          createdAt="5 minutes ago"
          status="pending"
        />
        <ApprovalCard
          title="Sync HubSpot Contacts to Salesforce"
          description="Fetch new HubSpot contacts and create corresponding leads in Salesforce"
          trigger="Daily sync schedule"
          createdAt="1 hour ago"
          status="pending"
        />
        <ApprovalCard
          title="Slack Daily Digest"
          description="Collect messages from #announcements, summarize with AI, post to #digest"
          trigger="Daily at 9:00 AM"
          createdAt="2 hours ago"
          status="approved"
        />
        <ApprovalCard
          title="GitHub PR Review Request"
          description="When PR is opened, check diff, add reviewers, post summary to Slack"
          trigger="New PR opened in workos-ai"
          createdAt="1 day ago"
          status="rejected"
        />
      </div>
    </div>
  )
}

function ApprovalCard({
  title,
  description,
  trigger,
  createdAt,
  status,
}: {
  title: string
  description: string
  trigger: string
  createdAt: string
  status: "pending" | "approved" | "rejected"
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-text-primary truncate">{title}</h3>
            {status === "pending" && (
              <span className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[10px] text-warning shrink-0">
                <Clock size={10} />
                Pending
              </span>
            )}
            {status === "approved" && (
              <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] text-success shrink-0">
                <CheckCircle size={10} />
                Approved
              </span>
            )}
            {status === "rejected" && (
              <span className="flex items-center gap-1 rounded-full bg-error/10 px-2 py-0.5 text-[10px] text-error shrink-0">
                <AlertTriangle size={10} />
                Rejected
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary mt-1 line-clamp-1">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[11px] text-text-tertiary mb-3">
        <span className="truncate">Trigger: {trigger}</span>
        <span className="shrink-0">{createdAt}</span>
      </div>

      {status === "pending" && (
        <div className="flex items-center gap-2">
          <Button size="sm" asChild>
            <Link href="/workflows/sample-id/approve">
              <CheckCircle size={14} className="mr-1" />
              Review
            </Link>
          </Button>
          <Button size="sm" variant="secondary">
            Dismiss
          </Button>
        </div>
      )}

      {status !== "pending" && (
        <Link
          href="/workflows/sample-id/runs/run-0"
          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-light transition-colors"
        >
          View details <ArrowRight size={12} />
        </Link>
      )}
    </div>
  )
}
