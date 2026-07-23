"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Inbox, Star, Paperclip, Plug } from "lucide-react"
import { channels, channelData } from "@/lib/inbox/data"
import { channelIcons } from "@/lib/inbox/icons"

const emails = [
  { from: "Sarah Chen", subject: "Q3 Partnership Proposal", preview: "I've attached the updated partnership proposal with the revised terms...", time: "2m ago", starred: true, unread: true, hasAttachment: true },
  { from: "Michael Torres", subject: "Follow-up: Enterprise Demo", preview: "Thanks for the demo yesterday. Our team was impressed and we'd like to...", time: "1h ago", starred: false, unread: true, hasAttachment: false },
  { from: "Acme Corp Billing", subject: "Invoice #INV-2024-0891", preview: "Your invoice for August 2024 is now available. Total amount: $4,200...", time: "3h ago", starred: false, unread: false, hasAttachment: true },
  { from: "Alex Nakamura", subject: "Meeting Notes - Sprint Planning", preview: "Here are the notes from today's sprint planning session. Key decisions...", time: "5h ago", starred: true, unread: false, hasAttachment: false },
  { from: "Priya Patel", subject: "Contract Renewal Discussion", preview: "Our current agreement expires in 45 days. I'd like to schedule a call to...", time: "1d ago", starred: false, unread: true, hasAttachment: false },
  { from: "James Wilson", subject: "Support Ticket #28472", preview: "We're experiencing an issue with the dashboard load times when...", time: "1d ago", starred: false, unread: false, hasAttachment: false },
  { from: "Newsletter", subject: "Weekly Industry Roundup", preview: "Top stories this week: AI in CRM, new automation trends, and more...", time: "2d ago", starred: false, unread: false, hasAttachment: false },
]

interface ChannelStatus {
  connected: boolean
}

type ChannelKey = "messenger" | "whatsapp" | "instagram" | "slack"

export default function CRMInboxPage() {
  const [statuses, setStatuses] = useState<Record<string, ChannelStatus>>({})
  const [statusLoading, setStatusLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStatuses() {
      try {
        const res = await fetch("/api/connectors/status")
        if (res.ok) {
          const data = await res.json()
          setStatuses(data.statuses || {})
        }
      } catch {
        console.error("Failed to fetch connector statuses")
      } finally {
        setStatusLoading(false)
      }
    }
    fetchStatuses()
  }, [])

  const totalUnread = emails.filter((e) => e.unread).length +
    channels.reduce((sum, ch) => {
      const convs = channelData[ch.key] || []
      return sum + convs.filter((c) => c.unread).length
    }, 0)

  const handleConnect = (channelKey: string) => {
    setConnecting(channelKey)
    window.location.href = `/api/connectors/${channelKey}/connect`
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-text-primary">Inbox</h1>
        <p className="text-sm text-text-secondary">{totalUnread} unread across all channels</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {channels.map((channel) => {
          const Icon = channelIcons[channel.key]
          const connected = statuses[channel.key]?.connected
          const isConnecting = connecting === channel.key

          return (
            <div
              key={channel.key}
              className="group text-left rounded-xl border-2 bg-surface p-5 hover:shadow-md transition-all disabled:opacity-60"
              style={{ borderColor: channel.color, borderWidth: 2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex items-center justify-center size-12 rounded-xl ${channel.bgColor}`}>
                  <Icon size={28} style={{ color: channel.color }} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-text-primary">{channel.label}</h3>
                  <p className="text-xs text-text-secondary">
                    {statusLoading
                      ? "Checking..."
                      : connected
                        ? "Connected"
                        : "Not connected"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-tertiary">
                  {connected ? "Open conversations" : "Connect to get started"}
                </span>
                {connected ? (
                  <Link
                    href={`/crm/inbox/${channel.key}`}
                    className="text-xs font-medium text-white px-4 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 hover:opacity-90"
                    style={{ backgroundColor: channel.color }}
                  >
                    Open
                  </Link>
                ) : (
                  <button
                    onClick={() => handleConnect(channel.key)}
                    disabled={isConnecting}
                    className="text-xs font-medium text-white px-4 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 disabled:opacity-70"
                    style={{ backgroundColor: channel.color }}
                  >
                    {isConnecting ? "Connecting..." : <><Plug size={12} /> Connect</>}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background/50">
          <Inbox size={16} className="text-text-tertiary" />
          <span className="text-xs font-medium text-text-secondary">Email Conversations</span>
          <span className="ml-auto text-[10px] text-text-tertiary">{emails.length} conversations</span>
        </div>

        {emails.map((email, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-surface-hover transition-colors cursor-pointer ${email.unread ? "bg-primary-muted/5" : ""}`}
          >
            <div className="flex flex-col items-center gap-1 pt-0.5">
              <button className="text-text-tertiary hover:text-amber-400 transition-colors">
                <Star size={14} className={email.starred ? "fill-amber-400 text-amber-400" : ""} />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-sm ${email.unread ? "font-semibold text-text-primary" : "text-text-secondary"}`}>
                  {email.from}
                </span>
                <span className="text-[11px] text-text-tertiary shrink-0">{email.time}</span>
              </div>
              <p className={`text-sm truncate ${email.unread ? "text-text-primary" : "text-text-secondary"}`}>
                {email.subject}
              </p>
              <p className="text-xs text-text-tertiary truncate mt-0.5">{email.preview}</p>
            </div>
            {email.hasAttachment && (
              <Paperclip size={14} className="text-text-tertiary shrink-0 mt-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
