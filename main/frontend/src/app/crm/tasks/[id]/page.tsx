"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CalendarDays, Clock, Trash2, CheckSquare, Circle, AlertTriangle, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Task {
  id: string
  title: string
  description: string | null
  priority: "high" | "medium" | "low"
  dueDate: string | null
  completed: boolean
  createdAt: string
  updatedAt: string
}

const priorityStyles: Record<string, string> = {
  high: "text-rose-500 bg-rose-500/10",
  medium: "text-amber-500 bg-amber-500/10",
  low: "text-text-tertiary bg-surface-secondary",
}

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editPriority, setEditPriority] = useState<"high" | "medium" | "low">("medium")
  const [editDueDate, setEditDueDate] = useState("")
  const [saving, setSaving] = useState(false)
  const [taskId, setTaskId] = useState<string | null>(null)

  useEffect(() => {
    params.then(({ id }) => {
      setTaskId(id)
      fetch(`/api/tasks/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found")
          return res.json()
        })
        .then((data) => setTask(data.task))
        .catch(() => router.push("/crm/tasks"))
        .finally(() => setLoading(false))
    })
  }, [params, router])

  const openEdit = () => {
    if (!task) return
    setEditTitle(task.title)
    setEditDescription(task.description || "")
    setEditPriority(task.priority)
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "")
    setEditOpen(true)
  }

  const handleSave = async () => {
    if (!task || !editTitle.trim()) return
    setSaving(true)
    const prev = { ...task }
    setTask({
      ...task,
      title: editTitle.trim(),
      description: editDescription.trim() || null,
      priority: editPriority,
      dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
    })
    setEditOpen(false)
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim() || null,
          priority: editPriority,
          dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
        }),
      })
      if (!res.ok) setTask(prev)
    } catch {
      setTask(prev)
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async () => {
    if (!task) return
    const updated = { completed: !task.completed }
    setTask({ ...task, completed: !task.completed })
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      })
      if (!res.ok) setTask(task)
    } catch {
      setTask(task)
    }
  }

  const handleDelete = async () => {
    if (!task) return
    setDeleting(true)
    try {
      await fetch(`/api/tasks/${task.id}`, { method: "DELETE" })
      router.push("/crm/tasks")
    } catch {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  }

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
  }

  const isOverdue = (dateStr: string | null) => {
    if (!dateStr) return false
    const d = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return d < today
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4 max-w-2xl">
          <div className="h-8 w-48 bg-surface rounded-lg" />
          <div className="h-4 w-96 bg-surface rounded-lg" />
          <div className="h-32 bg-surface rounded-xl" />
        </div>
      </div>
    )
  }

  if (!task) return null

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/crm/tasks"
          className="flex items-center justify-center size-8 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Task Details</h1>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <div className="flex items-start gap-3">
            <button onClick={handleToggle} className="shrink-0 mt-0.5">
              {task.completed ? (
                <CheckSquare size={20} className="text-success" />
              ) : (
                <Circle size={20} className="text-text-tertiary hover:text-primary transition-colors" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <h2
                className={cn(
                  "text-lg font-semibold",
                  task.completed ? "line-through text-text-tertiary" : "text-text-primary"
                )}
              >
                {task.title}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", priorityStyles[task.priority])}>
                  {task.priority}
                </span>
                {task.completed ? (
                  <span className="text-xs text-success flex items-center gap-1">
                    <CheckSquare size={12} />
                    Completed
                  </span>
                ) : (
                  <span className="text-xs text-text-tertiary flex items-center gap-1">
                    <Circle size={12} />
                    Pending
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={openEdit}
                className="shrink-0 size-8 flex items-center justify-center rounded-lg text-text-tertiary hover:text-primary hover:bg-primary-muted transition-colors"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="shrink-0 size-8 flex items-center justify-center rounded-lg text-text-tertiary hover:text-error hover:bg-error/10 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>

        {task.description && (
          <div className="px-6 py-4 border-b border-border">
            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">{task.description}</p>
          </div>
        )}

        <div className="px-6 py-4 space-y-3">
          {task.dueDate && (
            <div className="flex items-center gap-3 text-sm">
              <CalendarDays size={15} className="text-text-tertiary shrink-0" />
              <span
                className={cn(
                  !task.completed && isOverdue(task.dueDate) ? "text-rose-400 font-medium" : "text-text-secondary"
                )}
              >
                {!task.completed && isOverdue(task.dueDate) && "Overdue — "}
                Due {formatDate(task.dueDate)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-3 text-sm">
            <Clock size={15} className="text-text-tertiary shrink-0" />
            <span className="text-text-secondary">Created {formatDateTime(task.createdAt)}</span>
          </div>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Update the task details.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Title</label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && editTitle.trim()) handleSave()
                }}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Add more details..."
                rows={3}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Priority</label>
              <Select value={editPriority} onValueChange={(v: "high" | "medium" | "low") => setEditPriority(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Due Date</label>
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!editTitle.trim() || saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-full bg-error/10 text-error">
                <AlertTriangle size={20} />
              </div>
              <div>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete &ldquo;{task.title}&rdquo;? This cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} disabled={deleting} className="bg-error hover:bg-error/80 text-white">
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
