"use client"

import { useState, useCallback } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { DashboardSidebar } from "./dashboard-sidebar"

const sidebarRoutes = ["/dashboard", "/workflows", "/settings", "/crm"]

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const showSidebar = sidebarRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))

  const handleCollapsedChange = useCallback((v: boolean) => setCollapsed(v), [])

  if (!showSidebar) return <>{children}</>

  return (
    <div className="min-h-screen">
      <DashboardSidebar collapsed={collapsed} onCollapsedChange={handleCollapsedChange} />
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          collapsed ? "ml-16" : "ml-60"
        )}
      >
        {children}
      </main>
    </div>
  )
}
