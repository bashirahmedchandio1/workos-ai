import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { CheckSquare, Circle, User, CalendarDays } from "lucide-react"

export const dynamic = "force-dynamic"

const tasks = [
  { title: "Follow up with Sarah Chen on proposal", assignee: "You", due: "Today", priority: "high", completed: false },
  { title: "Prepare quarterly review deck", assignee: "You", due: "Tomorrow", priority: "high", completed: false },
  { title: "Update contact records for Acme Corp", assignee: "You", due: "Tomorrow", priority: "medium", completed: false },
  { title: "Send contract to Michael Torres", assignee: "You", due: "Jul 24", priority: "high", completed: false },
  { title: "Review DataLake analytics requirements", assignee: "Alex K.", due: "Jul 24", priority: "medium", completed: false },
  { title: "Schedule demo with Nexus Corp", assignee: "You", due: "Jul 25", priority: "low", completed: false },
  { title: "Call James Wilson about support ticket", assignee: "You", due: "Jul 25", priority: "medium", completed: true },
  { title: "Update pipeline forecast", assignee: "You", due: "Jul 22", priority: "high", completed: true },
  { title: "Send meeting notes from sprint planning", assignee: "You", due: "Jul 21", priority: "low", completed: true },
]

const priorityStyles: Record<string, string> = {
  high: "text-rose-500 bg-rose-500/10",
  medium: "text-amber-500 bg-amber-500/10",
  low: "text-text-tertiary bg-surface-secondary",
}

export default async function CRMTasksPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  const pendingCount = tasks.filter((t) => !t.completed).length

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-text-primary">Tasks</h1>
        <p className="text-sm text-text-secondary">{pendingCount} pending tasks</p>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background/50">
          <CheckSquare size={16} className="text-text-tertiary" />
          <span className="text-xs font-medium text-text-secondary">All Tasks</span>
        </div>

        <div className="divide-y divide-border">
          {tasks.map((task, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors cursor-pointer ${task.completed ? "opacity-60" : ""}`}
            >
              <button className="shrink-0">
                {task.completed ? (
                  <CheckSquare size={18} className="text-success" />
                ) : (
                  <Circle size={18} className="text-text-tertiary hover:text-primary transition-colors" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <span className={`text-sm ${task.completed ? "line-through text-text-tertiary" : "text-text-primary"}`}>
                  {task.title}
                </span>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-text-tertiary">
                    <User size={11} />
                    {task.assignee}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-tertiary">
                    <CalendarDays size={11} />
                    {task.due}
                  </span>
                </div>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${priorityStyles[task.priority]}`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
