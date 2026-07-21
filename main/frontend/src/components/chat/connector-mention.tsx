"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import * as Popover from "@radix-ui/react-popover"
import { connectors } from "@/lib/connectors"
import { ConnectorIcon } from "@/components/connector-icons"

interface ConnectorMentionProps {
  onSelect: (name: string) => void
  triggerChar: string
  search: string
  onSearchChange: (search: string) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ConnectorMention({
  onSelect,
  search,
  isOpen,
  onOpenChange,
}: ConnectorMentionProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filtered = connectors.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.key.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isOpen) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault()
      onSelect(filtered[selectedIndex].name)
    }
  }

  return (
    <Popover.Root open={isOpen && filtered.length > 0} onOpenChange={onOpenChange}>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="start"
          sideOffset={4}
          className="z-50 w-72 rounded-xl border border-border bg-background shadow-xl"
          onKeyDown={handleKeyDown}
        >
          <div className="p-1">
            <div className="px-2 py-1.5 text-xs font-medium text-text-tertiary uppercase tracking-wide">
              Connectors
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filtered.map((connector, i) => (
                <button
                  key={connector.key}
                  className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition-colors ${
                    i === selectedIndex
                      ? "bg-primary-muted text-primary"
                      : "text-text-primary hover:bg-surface-hover"
                  }`}
                  onClick={() => onSelect(connector.name)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <ConnectorIcon connector={connector.key} size={18} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{connector.name}</div>
                    <div className="text-xs text-text-tertiary truncate">
                      {connector.description}
                    </div>
                  </div>
                  <span className="text-[10px] text-text-tertiary uppercase">
                    {connector.authType}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
