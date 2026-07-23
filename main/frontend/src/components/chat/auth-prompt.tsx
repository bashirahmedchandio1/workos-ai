"use client"

import { useState } from "react"
import { Shield, ExternalLink, CheckCircle, XCircle } from "lucide-react"
import { getConnector } from "@/lib/connectors"
import { getProviderForConnector, oauthProviders, getRedirectUri } from "@/lib/oauth-config"

const toolBranding: Record<string, { color: string; bg: string; hover: string }> = {
  notion: { color: "text-white", bg: "bg-black", hover: "hover:bg-gray-800" },
  slack: { color: "text-white", bg: "bg-[#4A154B]", hover: "hover:bg-[#611f63]" },
  gmail: { color: "text-white", bg: "bg-[#EA4335]", hover: "hover:bg-[#d33426]" },
  "google-sheets": { color: "text-white", bg: "bg-[#0F9D58]", hover: "hover:bg-[#0b8043]" },
  "google-calendar": { color: "text-white", bg: "bg-[#4285F4]", hover: "hover:bg-[#2b6cde]" },
  messenger: { color: "text-white", bg: "bg-[#006AFF]", hover: "hover:bg-[#0055cc]" },
  instagram: { color: "text-white", bg: "bg-gradient-to-r from-[#833AB4] to-[#F77737]", hover: "opacity-90" },
  whatsapp: { color: "text-white", bg: "bg-[#25D366]", hover: "hover:bg-[#1da851]" },
}

interface AuthPromptProps {
  connectorKey: string
  status: "prompt" | "success" | "failed"
  onRetry?: () => void
}

export function AuthPrompt({ connectorKey, status, onRetry }: AuthPromptProps) {
  const connector = getConnector(connectorKey)
  if (!connector) return null

  const providerKey = getProviderForConnector(connectorKey)
  const provider = providerKey ? oauthProviders[providerKey] : null
  if (!provider) return null

  const branding = toolBranding[connectorKey]

  const getAuthUrl = () => {
    const state = Buffer.from(
      JSON.stringify({ csrf: crypto.randomUUID(), connectorKey })
    ).toString("base64url")

    const params = new URLSearchParams({
      client_id: provider.clientId() || "",
      redirect_uri: getRedirectUri(),
      response_type: "code",
      state,
      scope: provider.scopes.join(" "),
      ...provider.additionalParams,
    })

    return `${provider.authorizationUrl}?${params}`
  }

  if (status === "success") {
    return (
      <div className="my-3 flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 px-4 py-3">
        <CheckCircle size={18} className="text-success shrink-0" />
        <span className="text-sm text-text-primary">
          Authentication successful! Now proceeding with your request.
        </span>
      </div>
    )
  }

  if (status === "failed") {
    return (
      <div className="my-3 space-y-2">
        <div className="flex items-center gap-2 rounded-lg border border-error/20 bg-error/5 px-4 py-3">
          <XCircle size={18} className="text-error shrink-0" />
          <span className="text-sm text-text-primary">
            Authentication was not completed. I cannot proceed with the {connector.name} task at this time.
          </span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-primary hover:text-primary-hover underline underline-offset-2"
          >
            Try again
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="my-4 rounded-xl border border-border bg-background p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-warning/10 text-warning">
          <Shield size={20} />
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <p className="text-sm font-medium text-text-primary">
              Authentication Required
            </p>
            <p className="text-sm text-text-secondary mt-1">
              To create/manage tasks in <strong>{connector.name}</strong>, I need you to authenticate first.
            </p>
          </div>
          <a
            href={getAuthUrl()}
            className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium shadow-sm transition-all ${branding?.color || "text-white"} ${branding?.bg || "bg-primary"} ${branding?.hover || "hover:bg-primary-hover"}`}
          >
            <ExternalLink size={16} />
            Authenticate with {connector.name}
          </a>
        </div>
      </div>
    </div>
  )
}
