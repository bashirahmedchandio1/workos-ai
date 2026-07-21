import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ChatContainer } from "@/components/chat/chat-container"

export const dynamic = "force-dynamic"

export default async function NewWorkflowPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) redirect("/sign-in")

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">New Workflow</h1>
          <p className="text-sm text-text-secondary">Describe what you want to automate</p>
        </div>
      </div>
      <div className="flex-1">
        <ChatContainer />
      </div>
    </div>
  )
}
