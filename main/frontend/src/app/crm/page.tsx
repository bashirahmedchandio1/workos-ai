import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Inbox, Users, Briefcase, CheckSquare, Phone, Calendar, TrendingUp, ArrowUpRight } from "lucide-react"

export const dynamic = "force-dynamic"

const stats = [
  { label: "Open Deals", value: "$128,400", change: "+12.5%", icon: Briefcase, href: "/crm/deals" },
  { label: "Active Contacts", value: "2,847", change: "+8.2%", icon: Users, href: "/crm/contacts" },
  { label: "Tasks Due", value: "34", change: "-3", icon: CheckSquare, href: "/crm/tasks" },
  { label: "Unread Inbox", value: "12", change: "+5", icon: Inbox, href: "/crm/inbox" },
]

const quickLinks = [
  { label: "Inbox", icon: Inbox, href: "/crm/inbox", description: "Manage emails and conversations", color: "text-blue-500" },
  { label: "Contacts", icon: Users, href: "/crm/contacts", description: "View and manage contacts", color: "text-emerald-500" },
  { label: "Deals", icon: Briefcase, href: "/crm/deals", description: "Track sales pipeline", color: "text-amber-500" },
  { label: "Tasks", icon: CheckSquare, href: "/crm/tasks", description: "Manage follow-ups and to-dos", color: "text-violet-500" },
  { label: "Calls", icon: Phone, href: "/crm/calls", description: "Call logs and schedules", color: "text-rose-500" },
  { label: "Meetings", icon: Calendar, href: "/crm/meetings", description: "Scheduled meetings", color: "text-cyan-500" },
]

export default async function CRMPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-text-primary">CRM Dashboard</h1>
        <p className="text-sm text-text-secondary">Overview of your sales pipeline and customer relationships</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isPositive = stat.change.startsWith("+")
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-xl border border-border bg-surface p-4 hover:border-primary/30 transition-all hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={20} className="text-text-tertiary" />
                <span className={`flex items-center gap-0.5 text-xs ${isPositive ? "text-success" : "text-destructive"}`}>
                  <TrendingUp size={12} />
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-semibold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
            </Link>
          )
        })}
      </div>

      <h2 className="text-sm font-medium text-text-primary mb-3">Quick Access</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-xl border border-border bg-surface p-4 hover:border-primary/30 transition-all hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`${link.color}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{link.label}</p>
                    <p className="text-xs text-text-secondary">{link.description}</p>
                  </div>
                </div>
                <ArrowUpRight size={16} className="text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
