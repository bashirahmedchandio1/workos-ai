"use client"

import { CheckCircle, XCircle, RefreshCw, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApprovalBarProps {
  onApprove?: () => void
  onReject?: () => void
  onEdit?: () => void
  onRegenerate?: () => void
  status?: "pending" | "approved" | "rejected"
}

export function ApprovalBar({
  onApprove,
  onReject,
  onEdit,
  onRegenerate,
  status = "pending",
}: ApprovalBarProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-text-primary">Approval Required</h3>
          <p className="text-xs text-text-tertiary">
            Review the workflow plan before execution
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onRegenerate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
            >
              <RefreshCw size={14} className="mr-1" />
              Regenerate
            </Button>
          )}
          {onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onEdit}
            >
              <Edit3 size={14} className="mr-1" />
              Edit
            </Button>
          )}
          {onReject && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onReject}
              className="text-error border-error/20 hover:bg-error/10"
            >
              <XCircle size={14} className="mr-1" />
              Reject
            </Button>
          )}
          {onApprove && (
            <Button
              size="sm"
              onClick={onApprove}
            >
              <CheckCircle size={14} className="mr-1" />
              Approve & Run
            </Button>
          )}
        </div>
      </div>

      {status === "approved" && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-xs text-success">
          <CheckCircle size={14} />
          Workflow approved — execution started
        </div>
      )}

      {status === "rejected" && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-error/10 px-3 py-2 text-xs text-error">
          <XCircle size={14} />
          Workflow rejected — you can edit and resubmit
        </div>
      )}
    </div>
  )
}
