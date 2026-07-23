"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Activity,
  Plug,
  Workflow,
  Timer,
  Bot,
  Cable,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Box,
  Sparkles,
} from "lucide-react"
import { connectors, getConnector } from "@/lib/connectors"
import { ConnectorIcon } from "@/components/connector-icons"

interface ConnectorStatus {
  connected: boolean
  providerAccountEmail?: string | null
  createdAt?: string | null
}

interface WorkflowItem {
  id: string
  name: string
  status: string
  created_at?: string
  updated_at?: string
}

export function DashboardHome() {
  const router = useRouter()
  const [statuses, setStatuses] = useState<Record<string, ConnectorStatus>>({})
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/connectors/status").then((r) => r.json()),
      fetch("/api/workflows").then((r) => r.json()),
    ])
      .then(([statusData, workflowData]) => {
        setStatuses(statusData.statuses || {})
        setWorkflows(Array.isArray(workflowData) ? workflowData : workflowData.workflows || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const connectedCount = Object.values(statuses).filter((s) => s.connected).length
  const activeWorkflows = workflows.filter((w) => w.status === "active" || w.status === "running").length
  const recentRuns = workflows.slice(0, 5)

  const productivityConnectors = connectors.filter((c) => c.category === "productivity")
  const crmConnectors = connectors.filter((c) => c.category === "crm")

  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LayoutDashboard size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Dashboard</h1>
            <p className="text-sm text-text-secondary">Platform overview and quick actions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={Plug}
            label="Connectors"
            value={`${connectedCount} / ${connectors.length}`}
            sub={`${connectedCount} connected`}
            gradient="from-blue-500/10 to-blue-600/5"
            iconColor="text-blue-400"
          />
          <StatCard
            icon={Workflow}
            label="Workflows"
            value={workflows.length}
            sub={`${activeWorkflows} active`}
            gradient="from-purple-500/10 to-purple-600/5"
            iconColor="text-purple-400"
          />
          <StatCard
            icon={Activity}
            label="Total Runs"
            value={recentRuns.length}
            sub="Last 5 executions"
            gradient="from-emerald-500/10 to-emerald-600/5"
            iconColor="text-emerald-400"
          />
          <StatCard
            icon={Timer}
            label="Available Tools"
            value="22"
            sub="Across 7 platforms"
            gradient="from-amber-500/10 to-amber-600/5"
            iconColor="text-amber-400"
          />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Connector Fleet */}
          <div className="lg:col-span-2 space-y-4">
            <SectionHeader icon={Box} title="Connector Fleet" sub={`${connectors.length} available`} />

            <div className="space-y-4">
              <ConnectorGroup
                label="Productivity"
                items={productivityConnectors}
                statuses={statuses}
                loading={loading}
              />
              <ConnectorGroup
                label="CRM & Messaging"
                items={crmConnectors}
                statuses={statuses}
                loading={loading}
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <SectionHeader icon={Activity} title="Recent Activity" sub="Latest workflow runs" />

            <div className="rounded-xl border border-border bg-surface p-5">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="size-8 animate-pulse rounded-lg bg-surface-hover" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 w-3/4 animate-pulse rounded bg-surface-hover" />
                        <div className="h-2.5 w-1/2 animate-pulse rounded bg-surface-hover" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentRuns.length > 0 ? (
                <div className="space-y-3">
                  {recentRuns.map((run) => (
                    <div
                      key={run.id}
                      className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-surface-hover transition-colors cursor-pointer"
                      onClick={() => router.push(`/workflows/${run.id}`)}
                    >
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                          run.status === "active" || run.status === "running"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : run.status === "failed" || run.status === "error"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-surface-hover text-text-tertiary"
                        }`}
                      >
                        {run.status === "active" || run.status === "running" ? (
                          <Sparkles size={14} />
                        ) : run.status === "failed" || run.status === "error" ? (
                          <XCircle size={14} />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-text-primary">
                          {run.name || `Workflow ${run.id.slice(0, 8)}`}
                        </p>
                        <p className="text-xs text-text-tertiary capitalize">
                          {run.status.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Sparkles}
                  title="No runs yet"
                  description="Create a workflow to see execution history here."
                />
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <SectionHeader icon={Cable} title="Quick Actions" sub="Jump to any section" />

          <div className="grid gap-4 sm:grid-cols-3">
            <ActionCard
              icon={Bot}
              label="AI Chat"
              desc="Describe what to automate in plain English"
              href="/dashboard/chat"
              gradient="from-primary/10 to-primary/5"
              iconColor="text-primary"
            />
            <ActionCard
              icon={Workflow}
              label="Workflows"
              desc="Create and manage automated workflows"
              href="/workflows"
              gradient="from-purple-500/10 to-purple-600/5"
              iconColor="text-purple-400"
            />
            <ActionCard
              icon={Plug}
              label="Connectors"
              desc="Connect your apps and services"
              href="/settings/connectors"
              gradient="from-emerald-500/10 to-emerald-600/5"
              iconColor="text-emerald-400"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function LayoutDashboard({ size, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size || 22}
      height={size || 22}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  gradient,
  iconColor,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: string | number
  sub: string
  gradient: string
  iconColor: string
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface p-5">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div className="relative z-10 space-y-3">
        <div className={`flex size-9 items-center justify-center rounded-lg bg-black/20 ${iconColor}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-2xl font-semibold text-text-primary">{value}</p>
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="text-xs text-text-tertiary mt-0.5">{sub}</p>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  sub,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  sub: string
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex size-8 items-center justify-center rounded-lg bg-surface text-text-secondary border border-border">
        <Icon size={15} />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
        <p className="text-xs text-text-tertiary">{sub}</p>
      </div>
    </div>
  )
}

function ConnectorGroup({
  label,
  items,
  statuses,
  loading,
}: {
  label: string
  items: typeof connectors
  statuses: Record<string, ConnectorStatus>
  loading: boolean
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-text-tertiary">{label}</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {items.map((connector) => {
          const status = statuses[connector.key]
          const isConnected = status?.connected

          return (
            <div
              key={connector.key}
              className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
                isConnected
                  ? "border-success/20 bg-success/5"
                  : "border-border bg-black/20 opacity-60 hover:opacity-100 hover:border-border-hover"
              }`}
            >
              <div className="relative shrink-0">
                <ConnectorIcon connector={connector.key} size={22} />
                {loading ? (
                  <div className="absolute -right-1 -top-1 size-2.5 animate-pulse rounded-full bg-surface-hover" />
                ) : (
                  <div
                    className={`absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-surface ${
                      isConnected ? "bg-success" : "bg-text-tertiary"
                    }`}
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">
                  {connector.name}
                </p>
                <p className="truncate text-[10px] text-text-tertiary">
                  {isConnected ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ActionCard({
  icon: Icon,
  label,
  desc,
  href,
  gradient,
  iconColor,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  desc: string
  href: string
  gradient: string
  iconColor: string
}) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push(href)}
      className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 text-left transition-all hover:border-border-hover hover:shadow-sm"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-3">
          <div className={`flex size-10 items-center justify-center rounded-xl ${iconColor} bg-black/20`}>
            <Icon size={20} />
          </div>
          <div>
            <p className="font-semibold text-text-primary">{label}</p>
            <p className="text-sm text-text-secondary mt-0.5">{desc}</p>
          </div>
        </div>
        <ArrowRight
          size={18}
          className="mt-3 shrink-0 text-text-tertiary transition-all group-hover:translate-x-0.5 group-hover:text-primary"
        />
      </div>
    </button>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-surface-hover text-text-tertiary">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="text-xs text-text-tertiary mt-0.5">{description}</p>
      </div>
    </div>
  )
}
