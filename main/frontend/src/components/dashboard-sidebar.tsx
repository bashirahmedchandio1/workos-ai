"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { UserButton, useUser } from "@clerk/nextjs"
import {
  LayoutDashboard,
  MessageSquarePlus,
  Workflow,
  CheckCircle,
  Plug,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Inbox,
  Users,
  Briefcase,
  CheckSquare,
  Phone,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"

const otherNavHrefs = [
  "/dashboard",
  "/dashboard/chat",
  "/workflows",
  "/workflows/approvals",
  "/settings/connectors",
  "/settings",
]

const crmSubItems = [
  { label: "Inbox", href: "/crm/inbox", icon: Inbox },
  { label: "Contacts", href: "/crm/contacts", icon: Users },
  { label: "Deals", href: "/crm/deals", icon: Briefcase },
  { label: "Tasks", href: "/crm/tasks", icon: CheckSquare },
  { label: "Calls", href: "/crm/calls", icon: Phone },
  { label: "Meetings", href: "/crm/meetings", icon: Calendar },
]

function NavLink({
  href,
  icon: Icon,
  label,
  collapsed,
  pathname,
}: {
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  collapsed: boolean
  pathname: string
}) {
  const isActive =
    pathname === href ||
    (pathname.startsWith(href + "/") &&
      !otherNavHrefs.some((h) => h !== href && (pathname === h || pathname.startsWith(h + "/"))))
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        collapsed && "justify-center px-2",
        isActive
          ? "bg-primary-muted text-primary font-medium"
          : "text-text-secondary hover:bg-surface-hover hover:text-zinc-100"
      )}
      title={collapsed ? label : undefined}
    >
      <Icon size={20} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  )
}

export function DashboardSidebar({
  collapsed,
  onCollapsedChange,
}: {
  collapsed: boolean
  onCollapsedChange: (v: boolean) => void
}) {
  const pathname = usePathname()
  const { isLoaded, user } = useUser()
  const clerk = useClerk()
  const router = useRouter()
  const [crmOpen, setCrmOpen] = useState(false)

  useEffect(() => {
    if (pathname.startsWith("/crm")) {
      setCrmOpen(true)
    }
  }, [pathname])

  const isCrmHighlighted =
    pathname === "/crm" ||
    (pathname.startsWith("/crm/") &&
      !otherNavHrefs.some((h) => pathname === h || pathname.startsWith(h + "/")))

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-border bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex h-16 shrink-0 items-center border-b border-border px-4">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2 text-zinc-100 font-semibold",
            collapsed && "justify-center w-full"
          )}
        >
          <span className="text-primary shrink-0">⟐</span>
          {!collapsed && <span className="truncate">WorkOS AI</span>}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-1 p-3">
        <NavLink href="/dashboard" icon={LayoutDashboard} label="Home" collapsed={collapsed} pathname={pathname} />

        <div>
          <button
            onClick={() => {
              if (collapsed) {
                router.push("/crm")
              } else {
                setCrmOpen(!crmOpen)
              }
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              collapsed && "justify-center px-2",
              isCrmHighlighted
                ? "bg-primary-muted text-primary font-medium"
                : "text-text-secondary hover:bg-surface-hover hover:text-zinc-100"
            )}
            title={collapsed ? "CRM" : undefined}
          >
            <Users size={20} className="shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left truncate">CRM</span>
                <ChevronDown
                  size={14}
                  className={cn(
                    "shrink-0 transition-transform text-text-tertiary",
                    crmOpen && "rotate-180"
                  )}
                />
              </>
            )}
          </button>

          <AnimatePresence initial={false}>
            {!collapsed && crmOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-1 pl-3 pt-1 pb-1 border-l border-border ml-[11px]">
                  {crmSubItems.map((sub) => {
                    const SubIcon = sub.icon
                    const isSubActive = pathname === sub.href || pathname.startsWith(sub.href + "/")
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors",
                          isSubActive
                            ? "bg-primary-muted text-primary font-medium"
                            : "text-text-secondary hover:bg-surface-hover hover:text-zinc-100"
                        )}
                      >
                        <SubIcon size={16} className="shrink-0" />
                        <span className="truncate">{sub.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <NavLink href="/dashboard/chat" icon={MessageSquarePlus} label="Chat" collapsed={collapsed} pathname={pathname} />
        <NavLink href="/workflows" icon={Workflow} label="Workflows" collapsed={collapsed} pathname={pathname} />
        <NavLink href="/workflows/approvals" icon={CheckCircle} label="Approvals" collapsed={collapsed} pathname={pathname} />
        <NavLink href="/settings/connectors" icon={Plug} label="Connectors" collapsed={collapsed} pathname={pathname} />
        <NavLink href="/settings" icon={Settings} label="Settings" collapsed={collapsed} pathname={pathname} />
      </nav>

      <div className="border-t border-border p-3">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}
        >
          <UserButton />
          {!collapsed && isLoaded && user && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {user.fullName ?? "User"}
              </p>
              <p className="text-xs text-text-tertiary truncate">
                {user.primaryEmailAddress?.emailAddress ?? ""}
              </p>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={() => {
              clerk.signOut()
              router.push("/")
            }}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-surface-hover hover:text-zinc-100 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      <button
        onClick={() => onCollapsedChange(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-border text-text-secondary hover:text-zinc-100 transition-colors shrink-0"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  )
}
