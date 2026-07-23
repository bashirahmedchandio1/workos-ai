import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getChannel, getConversations, getConversation, channels } from "@/lib/inbox/data"
import { ConversationDetailClient } from "./client"

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  const params: { channel: string; conversationId: string }[] = []
  for (const ch of channels) {
    const convs = (await import("@/lib/inbox/data")).channelData[ch.key] || []
    for (const conv of convs) {
      params.push({ channel: ch.key, conversationId: conv.id })
    }
  }
  return params
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ channel: string; conversationId: string }>
}) {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  const { channel: channelKey, conversationId } = await params
  const channel = getChannel(channelKey)
  if (!channel) redirect("/crm/inbox")

  const conversation = getConversation(channelKey, conversationId)
  if (!conversation) redirect(`/crm/inbox/${channelKey}`)

  const conversations = getConversations(channelKey)

  return (
    <ConversationDetailClient
      channel={channel}
      conversation={conversation}
      conversations={conversations}
    />
  )
}
