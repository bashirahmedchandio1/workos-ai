"use client"

import { Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { AuthPrompt } from "./auth-prompt"
import { TaskCard } from "./task-card"
import type { Components } from "react-markdown"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  isLatest?: boolean
  isLoading?: boolean
  isThinking?: boolean
}

const markdownComponents: Components = {
  code: ({ className, children, ...props }) => {
    const isInline = !className
    if (isInline) {
      return (
        <code className="rounded bg-surface-hover px-1.5 py-0.5 text-sm font-mono text-primary" {...props}>
          {children}
        </code>
      )
    }
    return (
      <div className="my-2 overflow-x-auto rounded-lg bg-surface-hover p-4">
        <code className="text-sm font-mono leading-relaxed" {...props}>
          {children}
        </code>
      </div>
    )
  },
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary-hover transition-colors">
      {children}
    </a>
  ),
  ul: ({ children }) => <ul className="my-1.5 list-disc pl-5 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="my-1.5 list-decimal pl-5 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
  h1: ({ children }) => <h1 className="text-lg font-semibold mt-4 mb-2 text-text-primary">{children}</h1>,
  h2: ({ children }) => <h2 className="text-base font-semibold mt-3 mb-1.5 text-text-primary">{children}</h2>,
  h3: ({ children }) => <h3 className="text-sm font-semibold mt-2 mb-1 text-text-primary">{children}</h3>,
  p: ({ children }) => <p className="text-sm leading-relaxed mb-2 last:mb-0">{children}</p>,
  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border-b border-border bg-surface px-4 py-2 text-left font-medium text-text-primary">{children}</th>,
  td: ({ children }) => <td className="px-4 py-2 text-text-secondary border-b border-border/50">{children}</td>,
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-primary pl-4 italic text-text-secondary">{children}</blockquote>
  ),
  strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
}

export function ChatMessage({ role, content, isLatest, isLoading, isThinking }: ChatMessageProps) {
  const now = new Date()
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  if (role === "user") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-2">
        <div className="flex items-end gap-3 justify-end">
          <div className="flex flex-col items-end gap-0.5 max-w-[75%]">
            <div className="rounded-2xl rounded-br-md bg-primary px-4 py-2.5 shadow-sm">
              <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{content}</p>
            </div>
            <span className="text-[10px] text-text-tertiary px-1">{time}</span>
          </div>
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <User size={14} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-2">
      <div className="flex gap-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-muted text-primary shadow-sm mt-0.5">
          <Bot size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-text-primary">WorkOS AI</span>
            {!isLoading && !isThinking && <span className="text-[10px] text-text-tertiary">{time}</span>}
          </div>
          <div className="text-sm text-text-primary leading-relaxed">
            {isThinking ? (
              <div className="flex items-center gap-2.5 py-2">
                <div className="flex gap-1">
                  <span className="size-2 rounded-full bg-text-tertiary animate-bounce [animation-delay:0ms]" />
                  <span className="size-2 rounded-full bg-text-tertiary animate-bounce [animation-delay:150ms]" />
                  <span className="size-2 rounded-full bg-text-tertiary animate-bounce [animation-delay:300ms]" />
                </div>
                <span className="text-sm text-text-tertiary italic">Thinking...</span>
              </div>
            ) : (
              <div className="prose-custom">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {content}
                </ReactMarkdown>
                {isLoading && (
                  <span className="inline-flex ml-0.5">
                    <span className="animate-pulse text-text-tertiary text-lg">▊</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
