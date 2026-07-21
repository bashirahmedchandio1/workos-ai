"use client"

import { useState, useEffect } from "react"
import { Inbox, Star, Paperclip, ArrowLeft, Plug } from "lucide-react"
import { FaFacebookMessenger, FaWhatsapp, FaInstagram, FaSlack } from "react-icons/fa6"

const emails = [
  { from: "Sarah Chen", subject: "Q3 Partnership Proposal", preview: "I've attached the updated partnership proposal with the revised terms...", time: "2m ago", starred: true, unread: true, hasAttachment: true },
  { from: "Michael Torres", subject: "Follow-up: Enterprise Demo", preview: "Thanks for the demo yesterday. Our team was impressed and we'd like to...", time: "1h ago", starred: false, unread: true, hasAttachment: false },
  { from: "Acme Corp Billing", subject: "Invoice #INV-2024-0891", preview: "Your invoice for August 2024 is now available. Total amount: $4,200...", time: "3h ago", starred: false, unread: false, hasAttachment: true },
  { from: "Alex Nakamura", subject: "Meeting Notes - Sprint Planning", preview: "Here are the notes from today's sprint planning session. Key decisions...", time: "5h ago", starred: true, unread: false, hasAttachment: false },
  { from: "Priya Patel", subject: "Contract Renewal Discussion", preview: "Our current agreement expires in 45 days. I'd like to schedule a call to...", time: "1d ago", starred: false, unread: true, hasAttachment: false },
  { from: "James Wilson", subject: "Support Ticket #28472", preview: "We're experiencing an issue with the dashboard load times when...", time: "1d ago", starred: false, unread: false, hasAttachment: false },
  { from: "Newsletter", subject: "Weekly Industry Roundup", preview: "Top stories this week: AI in CRM, new automation trends, and more...", time: "2d ago", starred: false, unread: false, hasAttachment: false },
]

const messengerConversations = [
  { from: "Alice Johnson", message: "Hey, are you free for a quick call this afternoon?", time: "2m ago", unread: true },
  { from: "Bob Smith", message: "The design mockups are ready for review on Figma", time: "1h ago", unread: true },
  { from: "Carol Davis", message: "Thanks for the update! Let me check and get back to you", time: "3h ago", unread: false },
  { from: "Diana Ross", message: "Can you send me the link to the presentation?", time: "5h ago", unread: false },
  { from: "Eve Martinez", message: "Great meeting today! Here are my notes...", time: "1d ago", unread: false },
]

const whatsappConversations = [
  { from: "David Wilson", message: "Can you send me the contract draft?", time: "30m ago", unread: true },
  { from: "Emma Brown", message: "Meeting confirmed for tomorrow at 2pm. See you there!", time: "2h ago", unread: false },
  { from: "Frank Ocean", message: "The files have been uploaded to the shared drive", time: "4h ago", unread: true },
  { from: "Grace Lee", message: "Happy Birthday! 🎉 Hope you have a great day!", time: "1d ago", unread: false },
]

const slackConversations = [
  { from: "#general", message: "Mike Torres: Reminder: All-hands meeting at 3pm today 📢", time: "15m ago", unread: true },
  { from: "#engineering", message: "Alex K.: PR #284 is ready for review — adds Slack integration support", time: "1h ago", unread: true },
  { from: "#design", message: "Sarah Chen: New mockups for the CRM dashboard are in the shared drive", time: "2h ago", unread: false },
  { from: "#sales", message: "Priya Patel: Q3 pipeline review tomorrow at 10am. Bring your forecasts!", time: "3h ago", unread: true },
  { from: "#random", message: "James Wilson: Anyone up for lunch at The Italian Place? 🍝", time: "5h ago", unread: false },
  { from: "@david.k", message: "David Kim: Can you share the latest analytics report?", time: "1d ago", unread: false },
]

const instagramConversations = [
  { from: "Hannah Kim", message: "Love your latest post! Where was that taken? 🌟", time: "1h ago", unread: true },
  { from: "Ian Chen", message: "DM me the details when you get a chance", time: "4h ago", unread: false },
  { from: "Julia Roberts", message: "Thanks for the follow! Your content is amazing", time: "6h ago", unread: true },
  { from: "Kevin Hart", message: "Can you tag me in that photo from yesterday?", time: "1d ago", unread: false },
]

interface ChannelStatus {
  connected: boolean
}

const channels = [
  { key: "messenger", label: "Messenger", icon: FaFacebookMessenger, color: "#0084FF", bgColor: "bg-[#0084FF]/10", conversations: messengerConversations, unread: messengerConversations.filter((c) => c.unread).length },
  { key: "whatsapp", label: "WhatsApp", icon: FaWhatsapp, color: "#25D366", bgColor: "bg-[#25D366]/10", conversations: whatsappConversations, unread: whatsappConversations.filter((c) => c.unread).length },
  { key: "instagram", label: "Instagram", icon: FaInstagram, color: "#E4405F", bgColor: "bg-[#E4405F]/10", conversations: instagramConversations, unread: instagramConversations.filter((c) => c.unread).length },
  { key: "slack", label: "Slack", icon: FaSlack, color: "#4A154B", bgColor: "bg-[#4A154B]/10", conversations: slackConversations, unread: slackConversations.filter((c) => c.unread).length },
]

type ChannelKey = "messenger" | "whatsapp" | "instagram" | "slack" | null

export default function CRMInboxPage() {
  const [selectedChannel, setSelectedChannel] = useState<ChannelKey>(null)
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
    channels.reduce((sum, ch) => sum + ch.unread, 0)

  const activeChannel = channels.find((ch) => ch.key === selectedChannel)
  const activeConversations = activeChannel?.conversations || []

  const handleCardClick = (channelKey: ChannelKey) => {
    if (!channelKey) return
    const connected = statuses[channelKey]?.connected
    if (connected) {
      setSelectedChannel(channelKey)
    } else {
      setConnecting(channelKey)
      window.location.href = `/api/connectors/${channelKey}/connect`
    }
  }

  if (activeChannel) {
    return (
      <div className="p-6">
        <button
          onClick={() => setSelectedChannel(null)}
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Inbox
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className={`flex items-center justify-center size-10 rounded-xl ${activeChannel.bgColor}`}>
              <activeChannel.icon size={22} style={{ color: activeChannel.color }} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-text-primary">{activeChannel.label}</h1>
              <p className="text-sm text-text-secondary">{activeConversations.length} conversations</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-background/50">
            <activeChannel.icon size={16} style={{ color: activeChannel.color }} />
            <span className="text-xs font-medium text-text-secondary">{activeChannel.label} Conversations</span>
          </div>

          <div className="divide-y divide-border">
            {activeConversations.map((conv, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 px-4 py-3 hover:bg-surface-hover transition-colors cursor-pointer ${conv.unread ? `${activeChannel.bgColor}` : ""}`}
              >
                <div
                  className="flex items-center justify-center size-9 rounded-full shrink-0 text-white text-sm font-medium"
                  style={{ backgroundColor: activeChannel.color }}
                >
                  {conv.from.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-sm ${conv.unread ? "font-semibold text-text-primary" : "text-text-secondary"}`}>
                      {conv.from}
                    </span>
                    <span className="text-[11px] text-text-tertiary shrink-0">{conv.time}</span>
                  </div>
                  <p className={`text-sm truncate ${conv.unread ? "text-text-primary" : "text-text-secondary"}`}>
                    {conv.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-text-primary">Inbox</h1>
        <p className="text-sm text-text-secondary">{totalUnread} unread across all channels</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {channels.map((channel) => {
          const Icon = channel.icon
          const connected = statuses[channel.key]?.connected
          const isConnecting = connecting === channel.key

          return (
            <button
              key={channel.key}
              onClick={() => handleCardClick(channel.key as ChannelKey)}
              disabled={isConnecting}
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
                        ? `${channel.unread} unread`
                        : "Not connected"}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-tertiary">
                  {connected ? `${channel.conversations.length} conversations` : "Connect to get started"}
                </span>
                <span
                  className={`text-xs font-medium text-white px-4 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 ${
                    isConnecting ? "opacity-70" : ""
                  }`}
                  style={{ backgroundColor: channel.color }}
                >
                  {isConnecting ? (
                    <>Connecting...</>
                  ) : connected ? (
                    <>Open</>
                  ) : (
                    <><Plug size={12} /> Connect</>
                  )}
                </span>
              </div>
            </button>
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
