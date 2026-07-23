"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useEffect, useRef, useState } from "react"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { AuthPrompt } from "./auth-prompt"
import { QuickReplies } from "./quick-replies"
import { Bot, MessageSquare } from "lucide-react"

const suggestions = [
  "Send an email to john@example.com about the meeting tomorrow",
  "Create a task in Notion for the new feature request",
  "Post a message in Slack #announcements about the release",
  "Save the invoice data to Google Sheets",
]

interface AuthState {
  connectorKey: string
  status: "prompt" | "success" | "failed"
}

export function ChatContainer() {
  const [authState, setAuthState] = useState<AuthState | null>(null)

  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => {
      console.error("Chat error:", err)
    },
  })

  const scrollRef = useRef<HTMLDivElement>(null)
  const isSubmitting = status === "submitted"
  const isStreaming = status === "streaming"
  const isLoading = isSubmitting || isStreaming

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, authState])

  const messageText = (m: typeof messages[number]) =>
    m.parts.filter((p) => p.type === "text").map((p) => (p as { text: string }).text).join("")

  const lastAssistantMessage = messages.filter((m) => m.role === "assistant").pop()
  const lastAssistantText = lastAssistantMessage ? messageText(lastAssistantMessage) : ""

  const handleSend = (message: string) => {
    // Reset auth state on new message
    setAuthState(null)

    // Check if message mentions a tool that needs auth
    const toolMatch = message.match(/(?:create|add|make)\s+(?:a\s+|an\s+)?(?:task|issue|ticket|card)\s+(?:in|on)\s+(\w+)/i)
    if (toolMatch) {
      const tool = toolMatch[1].toLowerCase()
      const knownTools = ["notion", "linear", "jira", "clickup", "asana", "trello", "monday"]
      if (knownTools.includes(tool)) {
        setAuthState({ connectorKey: tool, status: "prompt" })
      }
    }

    sendMessage({ text: message })
  }

  const handleAuthRetry = () => {
    if (authState) {
      setAuthState({ ...authState, status: "prompt" })
    }
  }

  const handleSuggestion = (suggestion: string) => {
    handleSend(suggestion)
  }

  const userMessages = messages.filter((m) => m.role === "user")
  const lastUserText = userMessages.length > 0
    ? messageText(userMessages[userMessages.length - 1])
    : ""

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-lg text-center space-y-8 px-4">
            <div className="space-y-4">
              <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Bot size={32} />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-text-primary">
                  What would you like to automate?
                </h1>
                <p className="text-sm text-text-secondary leading-relaxed max-w-md mx-auto">
                  Describe what you want to do in plain English. I can send emails, create tasks, post messages, and more across your connected apps.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">Try asking</p>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSend(suggestion)}
                  disabled={isLoading}
                  className="w-full rounded-xl border border-border/60 bg-surface px-4 py-3 text-left text-sm text-text-secondary hover:border-border hover:bg-surface-hover hover:text-text-primary transition-all disabled:opacity-50 group"
                >
                  <span className="flex items-center gap-3">
                    <MessageSquare size={14} className="shrink-0 text-primary group-hover:text-primary" />
                    <span>{suggestion}</span>
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
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-1">
        {messages.map((message) => {
          const isLatestAssistant = message.role === "assistant" && message === messages[messages.length - 1]
          const isEmptyAssistant = message.role === "assistant" && messageText(message).length === 0
          return (
            <ChatMessage
              key={message.id}
              role={message.role as "user" | "assistant"}
              content={messageText(message)}
              isLatest={isLatestAssistant}
              isLoading={isStreaming && isLatestAssistant}
              isThinking={isLoading && isLatestAssistant && isEmptyAssistant}
            />
          )
        })}

        {isLoading && !lastAssistantMessage && (
          <div className="mx-auto max-w-3xl px-4 py-4">
            <div className="flex gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-muted text-primary shadow-sm mt-0.5">
                <Bot size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-text-primary">WorkOS AI</span>
                </div>
                <div className="flex items-center gap-2.5 py-2">
                  <div className="flex gap-1">
                    <span className="size-2 rounded-full bg-text-tertiary animate-bounce [animation-delay:0ms]" />
                    <span className="size-2 rounded-full bg-text-tertiary animate-bounce [animation-delay:150ms]" />
                    <span className="size-2 rounded-full bg-text-tertiary animate-bounce [animation-delay:300ms]" />
                  </div>
                  <span className="text-sm text-text-tertiary italic">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {authState && !isLoading && (
          <div className="mx-auto max-w-3xl px-4 pt-2 pb-1">
            <AuthPrompt
              connectorKey={authState.connectorKey}
              status={authState.status}
              onRetry={handleAuthRetry}
            />
          </div>
        )}

        {!isLoading && lastAssistantText && (
          <div className="pt-2">
            <QuickReplies
              suggestions={suggestions}
              onSelect={handleSuggestion}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  )
}
