"use client"

import { useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { connectors, categoryLabels } from "@/lib/connectors"
import { ConnectorIcon } from "@/components/connector-icons"
import { toast } from "sonner"

interface ConnectorStatus {
  connected: boolean
  providerAccountEmail?: string | null
  createdAt?: string | null
}

export default function ConnectorMarketplacePage() {
  const searchParams = useSearchParams()
  const [statuses, setStatuses] = useState<Record<string, ConnectorStatus>>({})
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    const connected = searchParams.get("connected")
    if (connected) {
      const name = connectors.find((c) => c.key === connected)?.name || connected
      toast.success(`${name} connected successfully!`)
    }
    const error = searchParams.get("error")
    if (error) {
      const messages: Record<string, string> = {
        access_denied: "Access was denied",
        invalid_request: "Invalid request",
        invalid_state: "Invalid state parameter",
        csrf_mismatch: "Security validation failed",
        unauthenticated: "You must be signed in",
        unknown_connector: "Unknown connector",
        unknown_provider: "Unknown provider",
        provider_not_configured: "Provider is not configured",
        token_exchange_failed: "Failed to exchange authorization code",
        database_not_available: "Database is not available",
      }
      toast.error(messages[error] || `Connection failed: ${error}`)
    }
  }, [searchParams])

  const fetchStatuses = useCallback(async () => {
    try {
      const res = await fetch("/api/connectors/status")
      if (res.ok) {
        const data = await res.json()
        setStatuses(data.statuses || {})
      }
    } catch {
      console.error("Failed to fetch connector statuses")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatuses()
  }, [fetchStatuses])

  const handleConnect = (connectorKey: string) => {
    setConnecting(connectorKey)
    window.location.href = `/api/connectors/${connectorKey}/connect`
  }

  const handleDisconnect = async (connectorKey: string, name: string) => {
    if (!confirm(`Disconnect ${name}?`)) return
    try {
      const res = await fetch(`/api/connectors/${connectorKey}/disconnect`, {
        method: "POST",
      })
      if (res.ok) {
        setStatuses((prev) => ({ ...prev, [connectorKey]: { connected: false } }))
        toast.success(`${name} disconnected`)
      } else {
        toast.error("Failed to disconnect")
      }
    } catch {
      toast.error("Failed to disconnect")
    }
  }

  const categories = [...new Set(connectors.map((c) => c.category))] as Array<keyof typeof categoryLabels>

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-5 w-48 rounded bg-surface-secondary animate-pulse" />
          <div className="h-4 w-72 rounded bg-surface-secondary animate-pulse mt-1" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-4">
              <div className="h-8 w-8 rounded bg-surface-secondary animate-pulse mb-3" />
              <div className="h-4 w-24 rounded bg-surface-secondary animate-pulse mb-1" />
              <div className="h-3 w-40 rounded bg-surface-secondary animate-pulse mb-3" />
              <div className="h-3 w-16 rounded bg-surface-secondary animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-text-primary">Connector Marketplace</h1>
        <p className="text-sm text-text-secondary">
          Connect your favorite apps and services to build powerful automations
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          type="button"
          className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-primary hover:bg-surface-hover transition-colors"
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {connectors.map((connector) => {
          const status = statuses[connector.key]
          const isConnected = status?.connected
          const isConnecting = connecting === connector.key

          return (
            <div
              key={connector.key}
              className={`group relative rounded-xl border p-4 transition-all ${
                isConnected
                  ? "border-success/30 bg-success/[0.02]"
                  : "border-border bg-surface hover:border-primary/30 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <ConnectorIcon connector={connector.key} size={32} />
                <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] text-success">
                  {connector.authType === "oauth2" ? "OAuth 2.0" : "API Key"}
                </span>
              </div>

              <h3 className="text-sm font-medium text-text-primary mb-1">{connector.name}</h3>
              <p className="text-xs text-text-secondary mb-3 line-clamp-2">{connector.description}</p>

              {isConnected && status?.providerAccountEmail && (
                <p className="text-[10px] text-text-tertiary mb-2 truncate">
                  {status.providerAccountEmail}
                </p>
              )}

              <div className="flex items-center gap-2">
                <span className="rounded-md bg-surface-secondary px-2 py-0.5 text-[10px] text-text-tertiary">
                  {categoryLabels[connector.category]}
                </span>

                {isConnected ? (
                  <button
                    type="button"
                    onClick={() => handleDisconnect(connector.key, connector.name)}
                    className="ml-auto text-xs text-destructive hover:text-destructive/80 transition-colors"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleConnect(connector.key)}
                    disabled={isConnecting}
                    className="ml-auto text-xs text-primary hover:text-primary-light disabled:opacity-50 transition-colors"
                  >
                    {isConnecting ? "Connecting..." : "Connect"}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
