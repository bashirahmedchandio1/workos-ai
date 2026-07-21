"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useEffect, useRef } from "react"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { StreamingPlan, parseStreamToSteps } from "./streaming-plan"
import { ApprovalBar } from "@/components/approval-bar"
import { Bot, MessageSquare } from "lucide-react"

export function ChatContainer() {
  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => {
      console.error("Chat error:", err)
    },
  })

  const scrollRef = useRef<HTMLDivElement>(null)
  const isLoading = status === "submitted" || status === "streaming"

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const messageText = (m: typeof messages[number]) =>
    m.parts.filter((p) => p.type === "text").map((p) => (p as { text: string }).text).join("")

  const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop()
  const steps = lastAssistantMessage ? parseStreamToSteps(messageText(lastAssistantMessage)) : []

  const handleSend = (message: string) => {
    sendMessage({ text: message })
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md text-center space-y-6 px-4">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-muted text-primary">
              <Bot size={28} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-text-primary">
                What would you like to automate?
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed">
                Describe your workflow in plain English. WorkOS AI will build an executable automation plan using your connected apps.
              </p>
            </div>
            <div className="space-y-2">
              {[
                "When I get an invoice in Gmail, save it to Google Sheets and notify me",
                "Create a HubSpot contact from a new Google Calendar event RSVP",
                "When a task is completed in Linear, create a summary in Notion",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-border/60 bg-surface px-4 py-3 text-left text-sm text-text-secondary hover:border-border hover:bg-surface-hover hover:text-text-primary transition-all disabled:opacity-50"
                >
                  <span className="flex items-center gap-3">
                    <MessageSquare size={14} className="shrink-0 text-primary" />
                    {suggestion}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto pt-4">
        <div className="pb-8">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role as "user" | "assistant"}
              content={messageText(message)}
              isLoading={isLoading && message.role === "assistant" && message === messages[messages.length - 1]}
            />
          ))}

          {lastAssistantMessage && (
            <div className="mx-auto max-w-3xl px-4 pt-2 pb-4">
              <StreamingPlan
                steps={steps}
                isStreaming={isLoading}
              />
              {steps.length > 0 && !isLoading && (
                <div className="mt-6">
                  <ApprovalBar />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  )
}
