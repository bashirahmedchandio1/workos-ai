"use client"

import { CheckSquare, ExternalLink, Calendar, Flag, User } from "lucide-react"

interface TaskCardProps {
  title: string
  description?: string
  priority?: "low" | "medium" | "high" | "urgent"
  status?: "todo" | "in_progress" | "done" | "backlog"
  assignee?: string
  dueDate?: string
  url?: string
  tool: string
  toolColor?: string
}

const priorityColors: Record<string, string> = {
  urgent: "bg-error/10 text-error border-error/20",
  high: "bg-warning/10 text-warning border-warning/20",
  medium: "bg-primary/10 text-primary border-primary/20",
  low: "bg-text-tertiary/10 text-text-tertiary border-text-tertiary/20",
}

const statusLabels: Record<string, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
  backlog: "Backlog",
}

export function TaskCard({
  title,
  description,
  priority,
  status,
  assignee,
  dueDate,
  url,
  tool,
  toolColor,
}: TaskCardProps) {
  return (
    <div className="my-3 rounded-xl border border-border bg-background p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CheckSquare size={18} />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
              <span className="text-[11px] text-text-tertiary uppercase tracking-wide">{tool}</span>
            </div>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-[11px] font-medium text-text-secondary hover:text-primary hover:border-primary transition-colors"
              >
                Open <ExternalLink size={12} />
              </a>
            )}
          </div>

          {description && (
            <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {priority && (
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${priorityColors[priority] || priorityColors.medium}`}>
                <Flag size={10} />
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </span>
            )}
            {status && (
              <span className="inline-flex items-center gap-1 rounded-full bg-surface border border-border px-2 py-0.5 text-[10px] font-medium text-text-secondary">
                <CheckSquare size={10} />
                {statusLabels[status] || status}
              </span>
            )}
            {assignee && (
              <span className="inline-flex items-center gap-1 text-[10px] text-text-tertiary">
                <User size={10} />
                {assignee}
              </span>
            )}
            {dueDate && (
              <span className="inline-flex items-center gap-1 text-[10px] text-text-tertiary">
                <Calendar size={10} />
                {dueDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
