"use client"

import { useState, useRef, useCallback, type KeyboardEvent } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { ConnectorMention } from "./connector-mention"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("")
  const [mentionOpen, setMentionOpen] = useState(false)
  const [mentionSearch, setMentionSearch] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lastAtPos = useRef(-1)

  const handleInput = useCallback((value: string) => {
    setInput(value)
    const cursorPos = textareaRef.current?.selectionStart ?? value.length
    const textBefore = value.slice(0, cursorPos)
    const lastAtIndex = textBefore.lastIndexOf("@")

    if (lastAtIndex !== -1) {
      const afterAt = textBefore.slice(lastAtIndex + 1)
      if (!afterAt.includes(" ") && !afterAt.includes("\n")) {
        lastAtPos.current = lastAtIndex
        setMentionSearch(afterAt)
        setMentionOpen(true)
      } else {
        setMentionOpen(false)
      }
    } else {
      setMentionOpen(false)
    }
  }, [])

  const handleMentionSelect = useCallback(
    (name: string) => {
      const cursorPos = textareaRef.current?.selectionStart ?? input.length
      const before = input.slice(0, lastAtPos.current)
      const after = input.slice(cursorPos)
      const newValue = `${before}@${name} ${after}`
      setInput(newValue)
      setMentionOpen(false)
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursor = before.length + name.length + 2
          textareaRef.current.focus()
          textareaRef.current.setSelectionRange(newCursor, newCursor)
        }
      }, 0)
    },
    [input]
  )

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setInput("")
    setMentionOpen(false)
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }, [input, isLoading, onSend])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-border bg-background">
      <div className="mx-auto max-w-3xl px-4 py-3">
        <div
          className={cn(
            "relative flex items-end gap-2 rounded-2xl border px-4 py-3 transition-all",
            "border-border/60 bg-surface focus-within:border-border",
            "shadow-sm"
          )}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message WorkOS AI..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary resize-none outline-none min-h-[24px] max-h-[200px] leading-relaxed"
            onInput={(e) => {
              const ta = e.currentTarget
              ta.style.height = "auto"
              ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-xl transition-all",
              input.trim() && !isLoading
                ? "bg-primary text-white hover:bg-primary-hover"
                : "bg-transparent text-text-tertiary"
            )}
          >
            <ArrowUp size={16} />
          </button>
        </div>

        <ConnectorMention
          onSelect={handleMentionSelect}
          triggerChar="@"
          search={mentionSearch}
          onSearchChange={setMentionSearch}
          isOpen={mentionOpen}
          onOpenChange={setMentionOpen}
        />
      </div>
    </div>
  )
}
