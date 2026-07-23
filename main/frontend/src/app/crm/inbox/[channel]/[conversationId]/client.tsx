"use client"

import { useState } from "react"
import { ConversationList } from "@/components/inbox/conversation-list"
import { ChatView } from "@/components/inbox/chat-view"
import { ContactSidebar } from "@/components/inbox/contact-sidebar"
import type { Conversation, ChannelDef } from "@/lib/inbox/data"

export function ConversationDetailClient({
  channel,
  conversation,
  conversations,
}: {
  channel: ChannelDef
  conversation: Conversation
  conversations: Conversation[]
}) {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <div className="h-full flex">
      <div className="w-72 shrink-0 border-r border-border hidden lg:block">
        <ConversationList channel={channel} conversations={conversations} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <ChatView channel={channel} conversation={conversation} />
      </div>

      {contactOpen && (
        <div className="w-72 shrink-0 hidden xl:block">
          <ContactSidebar
            conversation={conversation}
            channel={channel}
            onClose={() => setContactOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
