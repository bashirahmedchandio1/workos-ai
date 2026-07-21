import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ChatContainer } from "@/components/chat/chat-container"

export const dynamic = "force-dynamic"

export default async function ChatPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  return (
    <div className="flex h-[calc(100vh-0px)] flex-col">
      <ChatContainer />
    </div>
  )
}
