"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { channelIcons } from "@/lib/inbox/icons"
import type { Conversation, ChannelDef } from "@/lib/inbox/data"

export function ConversationList({
  channel,
  conversations,
}: {
  channel: ChannelDef
  conversations: Conversation[]
}) {
  const params = useParams()
  const activeId = params.conversationId as string | undefined

  return (
    <div className="flex h-full flex-col border-r border-border bg-surface/50">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <div className={`flex items-center justify-center size-8 rounded-lg ${channel.bgColor}`}>
          {(() => { const Icon = channelIcons[channel.key]; return <Icon size={16} style={{ color: channel.color }} /> })()}
        </div>
        <span className="text-sm font-semibold text-text-primary">{channel.label}</span>
        <span className="ml-auto text-[11px] text-text-tertiary">{conversations.length}</span>
      </div>

      <div className="px-3 py-2">
        <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-sm text-text-tertiary border border-border">
          <Search size={14} />
          <input
            placeholder="Search conversations..."
            className="flex-1 bg-transparent outline-none text-text-secondary placeholder:text-text-tertiary"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <Link
            key={conv.id}
            href={`/crm/inbox/${channel.key}/${conv.id}`}
            className={cn(
              "flex items-start gap-3 px-4 py-3 hover:bg-surface-hover transition-colors border-b border-border/50",
              conv.id === activeId && "bg-surface-hover",
              conv.unread && !conv.id.startsWith("slack-") && "bg-primary-muted/5"
            )}
          >
            <div
              className="flex items-center justify-center size-9 rounded-full shrink-0 text-white text-sm font-medium"
              style={{ backgroundColor: channel.color }}
            >
              {conv.avatar.length > 1 && conv.avatar.startsWith("#")
                ? conv.name.replace(/[#@]/g, "").charAt(0).toUpperCase()
                : conv.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className={cn("text-sm truncate", conv.unread ? "font-semibold text-text-primary" : "text-text-secondary")}>
                  {conv.name}
                </span>
                <span className="text-[10px] text-text-tertiary shrink-0 ml-2">{conv.time}</span>
              </div>
              <p className={cn("text-xs truncate", conv.unread ? "text-text-primary" : "text-text-tertiary")}>
                {conv.lastMessage}
              </p>
            </div>
            {conv.unread && (
              <span className="size-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: channel.color }} />
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
