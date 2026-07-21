import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function RunDetailPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  const logs = [
    { level: "info", message: "Workflow execution started", time: "0.0s" },
    { level: "info", message: "Checking Gmail for new invoice emails...", time: "0.3s" },
    { level: "info", message: "Found 1 new email matching criteria", time: "1.2s" },
    { level: "info", message: "Downloading attachment: invoice_2026.pdf", time: "1.8s" },
    { level: "info", message: "Uploading invoice_2026.pdf to Google Drive...", time: "3.5s" },
    { level: "success", message: "Uploaded to Drive: /Invoices/invoice_2026.pdf", time: "4.2s" },
    { level: "info", message: "Sending notification to Slack #finance-alerts...", time: "4.5s" },
    { level: "success", message: "Slack notification sent", time: "4.8s" },
    { level: "success", message: "Workflow completed successfully", time: "5.0s" },
  ]

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
            <h1 className="text-lg font-semibold text-text-primary">Run Details</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-text-tertiary">
                <Clock size={12} />
                Started 2 minutes ago
              </span>
              <span className="flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs text-success">
                <CheckCircle size={12} />
                Completed
              </span>
              <span className="text-xs text-text-tertiary">Duration: 5.0s</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-border">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold text-text-primary">Execution Logs</h2>
            </div>
            <div className="p-4">
              <div className="space-y-1 font-mono text-xs">
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded px-2 py-1.5 hover:bg-surface/50"
                  >
                    <span className="shrink-0 w-10 text-text-tertiary">{log.time}</span>
                    {log.level === "success" ? (
                      <CheckCircle size={12} className="shrink-0 mt-0.5 text-success" />
                    ) : log.level === "error" ? (
                      <AlertCircle size={12} className="shrink-0 mt-0.5 text-error" />
                    ) : (
                      <Loader2 size={12} className="shrink-0 mt-0.5 text-text-tertiary" />
                    )}
                    <span
                      className={
                        log.level === "success"
                          ? "text-success"
                          : log.level === "error"
                          ? "text-error"
                          : "text-text-primary"
                      }
                    >
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-border p-4">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-text-secondary">Status</dt>
                <dd className="flex items-center gap-1 text-success">
                  <CheckCircle size={12} />
                  Completed
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">Duration</dt>
                <dd className="text-text-primary">5.0s</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">Steps</dt>
                <dd className="text-text-primary">4</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">Retries</dt>
                <dd className="text-text-primary">0</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-text-secondary">Errors</dt>
                <dd className="text-text-primary">0</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-border p-4">
            <h2 className="text-sm font-semibold text-text-primary mb-3">Steps</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 px-3 py-2">
                <CheckCircle size={12} className="text-success shrink-0" />
                <span className="text-xs text-text-primary">Check Gmail</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 px-3 py-2">
                <CheckCircle size={12} className="text-success shrink-0" />
                <span className="text-xs text-text-primary">Download Attachment</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 px-3 py-2">
                <CheckCircle size={12} className="text-success shrink-0" />
                <span className="text-xs text-text-primary">Upload to Drive</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 px-3 py-2">
                <CheckCircle size={12} className="text-success shrink-0" />
                <span className="text-xs text-text-primary">Notify Slack</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
