"use client"

import { Sparkles } from "lucide-react"

interface QuickReplyProps {
  suggestions: string[]
  onSelect: (text: string) => void
  isLoading?: boolean
}

const suggestionIcons = [
  "Send an email to the team about the project update",
  "Create a Notion page for sprint planning",
  "Post a message in Slack #general about the new feature",
  "Save this data to Google Sheets",
  "Send a DM on Instagram to the client",
  "Upload the quarterly report to Drive",
]

export function QuickReplies({ suggestions, onSelect, isLoading }: QuickReplyProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="mx-auto max-w-3xl px-4 pb-2">
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles size={12} className="text-primary" />
        <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider">Suggestions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSelect(suggestion)}
            disabled={isLoading}
            className="rounded-full border border-border/60 bg-surface px-3.5 py-1.5 text-xs text-text-secondary hover:border-border hover:bg-surface-hover hover:text-text-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
