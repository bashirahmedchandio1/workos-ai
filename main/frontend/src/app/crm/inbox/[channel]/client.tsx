"use client"

import { ConversationList } from "@/components/inbox/conversation-list"
import type { Conversation, ChannelDef } from "@/lib/inbox/data"

export function ChannelInboxClient({
  channel,
  conversations,
}: {
  channel: ChannelDef
  conversations: Conversation[]
}) {
  return (
    <ConversationList channel={channel} conversations={conversations} />
  )
}
