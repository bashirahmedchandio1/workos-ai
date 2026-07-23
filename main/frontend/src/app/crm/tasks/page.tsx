"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { CheckSquare, Circle, Plus, Trash2, CalendarDays, AlertTriangle } from "lucide-react"
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
}

const priorityStyles: Record<string, string> = {
  high: "text-rose-500 bg-rose-500/10",
  medium: "text-amber-500 bg-amber-500/10",
  low: "text-text-tertiary bg-surface-secondary",
}

export default function CRMTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium")
  const [newDueDate, setNewDueDate] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks")
      const data = await res.json()
      setTasks(data.tasks || [])
    } catch {
      console.error("Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleCreate = async () => {
    if (!newTitle.trim()) return
    setSaving(true)
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim() || null,
          priority: newPriority,
          dueDate: newDueDate ? new Date(newDueDate).toISOString() : null,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setTasks((prev) => [data.task, ...prev])
        setDialogOpen(false)
        setNewTitle("")
        setNewDescription("")
        setNewPriority("medium")
        setNewDueDate("")
      }
    } catch {
      console.error("Failed to create task")
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (task: Task) => {
    const updated = { completed: !task.completed }
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
    )
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      })
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: task.completed } : t))
      )
    }
  }

  const handleDelete = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    setDeleteId(null)
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" })
    } catch {
      fetchTasks()
    }
  }

  const pendingCount = tasks.filter((t) => !t.completed).length

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null
    const d = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (d.toDateString() === today.toDateString()) return "Today"
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow"
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const isOverdue = (dateStr: string | null) => {
    if (!dateStr) return false
    const d = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return d < today
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Tasks</h1>
          <p className="text-sm text-text-secondary">{pendingCount} pending tasks</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-1.5">
          <Plus size={15} />
          Add Task
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background/50">
          <CheckSquare size={16} className="text-text-tertiary" />
          <span className="text-xs font-medium text-text-secondary">All Tasks</span>
          <span className="ml-auto text-[10px] text-text-tertiary">{tasks.length} total</span>
        </div>

        {loading ? (
          <div className="px-4 py-8 text-center text-sm text-text-tertiary">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <CheckSquare size={32} className="mx-auto text-text-tertiary mb-3" />
            <p className="text-sm text-text-secondary">No tasks yet</p>
            <p className="text-xs text-text-tertiary mt-1">Create your first task to get started</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDialogOpen(true)}
              className="mt-4"
            >
              <Plus size={14} />
              Create Task
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="group relative flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors"
              >
                <button onClick={() => handleToggle(task)} className="shrink-0 z-10">
                  {task.completed ? (
                    <CheckSquare size={18} className="text-success" />
                  ) : (
                    <Circle size={18} className="text-text-tertiary hover:text-primary transition-colors" />
                  )}
                </button>
                <Link
                  href={`/crm/tasks/${task.id}`}
                  className={cn("flex-1 min-w-0", task.completed && "opacity-60")}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-sm",
                        task.completed ? "line-through text-text-tertiary" : "text-text-primary"
                      )}
                    >
                      {task.title}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0",
                        priorityStyles[task.priority]
                      )}
                    >
                      {task.priority}
                    </span>
                  </div>
                  {task.description ? (
                    <p className="text-xs text-text-tertiary truncate mt-0.5">{task.description}</p>
                  ) : task.dueDate ? (
                    <div className="flex items-center gap-1 mt-0.5">
                      <CalendarDays size={11} className="text-text-tertiary" />
                      <span
                        className={cn(
                          "text-xs",
                          !task.completed && isOverdue(task.dueDate)
                            ? "text-rose-400"
                            : "text-text-tertiary"
                        )}
                      >
                        {isOverdue(task.dueDate) && !task.completed && "Overdue — "}
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                  ) : null}
                </Link>
                <button
                  onClick={() => setDeleteId(task.id)}
                  className="shrink-0 size-7 flex items-center justify-center rounded-lg text-text-tertiary hover:text-error hover:bg-error/10 opacity-0 group-hover:opacity-100 transition-all z-10"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>Add a new task to your list.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Title</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newTitle.trim()) handleCreate()
                }}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Add more details..."
                rows={3}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-text-secondary mb-1.5 block">Priority</label>
              <Select value={newPriority} onValueChange={(v: "high" | "medium" | "low") => setNewPriority(v)}>
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
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all [color-scheme:dark]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newTitle.trim() || saving}>
              {saving ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null) }}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-full bg-error/10 text-error">
                <AlertTriangle size={20} />
              </div>
              <div>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this task? This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="secondary" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-error hover:bg-error/80 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
