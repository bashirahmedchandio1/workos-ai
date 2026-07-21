"use client"

import { cn } from "@/lib/utils"
import { Bot } from "lucide-react"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  isLoading?: boolean
}

export function ChatMessage({ role, content, isLoading }: ChatMessageProps) {
  if (role === "user") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-3">
        <div className="flex justify-end">
          <div className="rounded-2xl bg-primary px-4 py-2.5 text-sm text-white max-w-[75%] leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-3">
      <div className="flex gap-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-muted text-primary">
          <Bot size={16} />
        </div>
        <div className="flex-1 min-w-0 pt-1">
          <div className="text-sm font-medium text-text-primary mb-2">
            WorkOS AI
          </div>
          <div className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
            {content}
            {isLoading && (
              <span className="inline-flex ml-0.5">
                <span className="animate-pulse text-text-tertiary">▊</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
