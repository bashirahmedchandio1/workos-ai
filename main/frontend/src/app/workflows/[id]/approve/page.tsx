import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, AlertTriangle, Info } from "lucide-react"
import { ApprovalBar } from "@/components/approval-bar"

export const dynamic = "force-dynamic"

export default async function ApprovalPage() {
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
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Approve Workflow</h1>
          <p className="text-sm text-text-secondary">
            Review the workflow plan, connected apps, and permissions before execution
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border p-4">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Workflow Graph</h2>
            <div className="flex flex-col items-center py-8">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 rounded-xl border-2 border-warning/30 bg-warning/5 px-5 py-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-warning/10 text-warning">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/></svg>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-primary">New Gmail Email</span>
                    <span className="block text-xs text-warning">Trigger</span>
                  </div>
                </div>

                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>

                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-5 py-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/></svg>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-primary">Download Attachment</span>
                    <span className="block text-xs text-text-tertiary">Gmail</span>
                  </div>
                </div>

                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>

                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-5 py-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/></svg>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-primary">Upload to Google Drive</span>
                    <span className="block text-xs text-text-tertiary">Google Drive</span>
                  </div>
                </div>

                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>

                <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-5 py-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/></svg>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-primary">Notify Slack</span>
                    <span className="block text-xs text-text-tertiary">Slack</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border p-4">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Connected Apps</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2">
                <GmailIconSmall />
                <span className="text-sm text-text-primary">Gmail</span>
                <span className="ml-auto text-xs text-success">Connected</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2">
                <DriveIconSmall />
                <span className="text-sm text-text-primary">Google Drive</span>
                <span className="ml-auto text-xs text-success">Connected</span>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2">
                <SlackIconSmall />
                <span className="text-sm text-text-primary">Slack</span>
                <span className="ml-auto text-xs text-success">Connected</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Required Permissions</h2>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs text-text-secondary">
                <Info size={12} className="mt-0.5 shrink-0" />
                <span>Gmail: Read emails, download attachments</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-text-secondary">
                <Info size={12} className="mt-0.5 shrink-0" />
                <span>Google Drive: Upload and create files</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-text-secondary">
                <Info size={12} className="mt-0.5 shrink-0" />
                <span>Slack: Send messages to channels</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="shrink-0 text-warning mt-0.5" />
              <div>
                <h3 className="text-xs font-medium text-warning mb-1">Warnings</h3>
                <ul className="space-y-1 text-xs text-text-secondary">
                  <li>• Large attachments may take time to download</li>
                  <li>• Slack rate limits: max 1 message per second</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ApprovalBar />
      </div>
    </div>
  )
}

function GmailIconSmall() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="#4285F4"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.91 12 9.548l6.545-4.637 1.528-1.418C21.691 2.28 24 3.434 24 5.457Z"/></svg>
}
function DriveIconSmall() {
  return <svg width="16" height="16" viewBox="0 0 24 24"><path d="M8.946 1.5 2.25 13.232l3.268 5.66 6.357-11.01L8.946 1.5Z" fill="#0066DA"/><path d="m15.768 9.998-6.375 11.04h12.357l3.25-5.629-6.25-5.44-3.267.03Z" fill="#00AC47"/><path d="m12.444 11.348-3.107 5.38 5.174 5.21h3.16l-5.227-10.59Z" fill="#EA4335"/></svg>
}
function SlackIconSmall() {
  return <svg width="16" height="16" viewBox="0 0 24 24"><path d="M6 13.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" fill="#E01E5A"/><path d="M8.25 13.5a2.25 2.25 0 0 1 4.5 0v5.625a2.25 2.25 0 1 1-4.5 0V13.5Z" fill="#E01E5A"/><path d="M10.5 6A2.25 2.25 0 1 1 10.5 1.5 2.25 2.25 0 0 1 10.5 6Z" fill="#36C5F0"/><path d="M10.5 8.25a2.25 2.25 0 0 1 0 4.5H4.875a2.25 2.25 0 1 1 0-4.5H10.5Z" fill="#36C5F0"/><path d="M18 10.5a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z" fill="#2EB67D"/><path d="M15.75 10.5a2.25 2.25 0 0 1-4.5 0V4.875a2.25 2.25 0 1 1 4.5 0V10.5Z" fill="#2EB67D"/><path d="M13.5 18a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5Z" fill="#ECB22E"/><path d="M13.5 15.75a2.25 2.25 0 0 1 0-4.5h5.625a2.25 2.25 0 1 1 0 4.5H13.5Z" fill="#ECB22E"/></svg>
}
