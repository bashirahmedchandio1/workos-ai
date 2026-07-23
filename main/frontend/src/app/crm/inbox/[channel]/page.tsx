import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getChannel, getConversations, channels } from "@/lib/inbox/data"
import { ChannelInboxClient } from "./client"

export const dynamic = "force-dynamic"

export async function generateStaticParams() {
  return channels.map((ch) => ({ channel: ch.key }))
}

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ channel: string }>
}) {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  const { channel: channelKey } = await params
  const channel = getChannel(channelKey)
  if (!channel) redirect("/crm/inbox")

  const conversations = getConversations(channelKey)

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-6 py-3 border-b border-border shrink-0 lg:hidden">
        <Link
          href="/crm/inbox"
          className="flex items-center justify-center size-8 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <span className="text-sm font-semibold text-text-primary">{channel.label}</span>
      </div>
      <div className="flex-1">
        <ChannelInboxClient channel={channel} conversations={conversations} />
      </div>
    </div>
  )
}
