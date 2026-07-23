"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, MoreHorizontal, Phone, Video, Info, Search } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Conversation, ChannelDef } from "@/lib/inbox/data"

export function ChatView({
  channel,
  conversation,
}: {
  channel: ChannelDef
  conversation: Conversation
}) {
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversation.messages])

  const handleSend = () => {
    if (!input.trim()) return
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
        <Link
          href={`/crm/inbox/${channel.key}`}
          className="flex items-center justify-center size-8 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors lg:hidden"
        >
          <ArrowLeft size={16} />
        </Link>
        <div
          className="flex items-center justify-center size-9 rounded-full shrink-0 text-white text-sm font-medium"
          style={{ backgroundColor: channel.color }}
        >
          {conversation.avatar.length > 1 && conversation.avatar.startsWith("#")
            ? conversation.name.replace(/[#@]/g, "").charAt(0).toUpperCase()
            : conversation.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text-primary">{conversation.name}</span>
            {conversation.online && <span className="size-2 rounded-full bg-success" />}
          </div>
          <p className="text-[11px] text-text-tertiary">
            {conversation.messages.length} messages
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="flex items-center justify-center size-8 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors">
            <Search size={15} />
          </button>
          <button className="flex items-center justify-center size-8 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors">
            <Phone size={15} />
          </button>
          <button className="flex items-center justify-center size-8 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors">
            <Video size={15} />
          </button>
          <button className="flex items-center justify-center size-8 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors">
            <Info size={15} />
          </button>
          <button className="flex items-center justify-center size-8 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-colors">
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {conversation.messages.map((msg) => {
          const isMine = msg.isMine
          return (
            <div
              key={msg.id}
              className={cn("flex gap-3", isMine ? "justify-end" : "justify-start")}
            >
              {!isMine && (
                <div
                  className="flex items-center justify-center size-8 rounded-full shrink-0 text-white text-xs font-medium mt-1"
                  style={{ backgroundColor: channel.color }}
                >
                  {msg.senderName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
              )}
              <div className={cn("max-w-[70%]", isMine && "flex flex-col items-end")}>
                {!isMine && (
                  <span className="text-[11px] text-text-tertiary mb-1 block">{msg.senderName}</span>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                    isMine
                      ? "rounded-br-md text-white"
                      : "rounded-bl-md bg-surface text-text-primary border border-border"
                  )}
                  style={isMine ? { backgroundColor: channel.color } : undefined}
                >
                  {msg.content}
                </div>
                <span className="text-[10px] text-text-tertiary mt-1">{msg.time}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="shrink-0 border-t border-border px-4 py-3">
        <div className="flex items-end gap-2 rounded-2xl border border-border bg-surface px-4 py-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${conversation.name}`}
            rows={1}
            className="flex-1 bg-transparent outline-none text-sm text-text-primary placeholder:text-text-tertiary resize-none max-h-32 py-1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex items-center justify-center size-8 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-40 shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
