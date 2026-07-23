"use client"

import { cn } from "@/lib/utils"
import * as SelectPrimitive from "@radix-ui/react-select"

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary shadow-sm outline-none placeholder:text-text-tertiary focus:border-primary/50 focus:ring-1 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4 text-text-tertiary">
        <path d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89247 4.93179 6.06821C5.10753 6.24396 5.39247 6.24396 5.56821 6.06821L7.5 4.13642L9.43179 6.06821C9.60753 6.24396 9.89247 6.24396 10.0682 6.06821C10.2439 5.89247 10.2439 5.60753 10.0682 5.43179L7.8182 3.18179C7.73383 3.09742 7.61933 3.05 7.5 3.05C7.38067 3.05 7.26617 3.09742 7.1818 3.18179L4.93179 5.43179Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
        <path d="M10.0682 9.56821C10.2439 9.39247 10.2439 9.10753 10.0682 8.93179C9.89247 8.75605 9.60753 8.75605 9.43179 8.93179L7.5 10.8636L5.56821 8.93179C5.39247 8.75605 5.10753 8.75605 4.93179 8.93179C4.75605 9.10753 4.75605 9.39247 4.93179 9.56821L7.1818 11.8182C7.26617 11.9026 7.38067 11.95 7.5 11.95C7.61933 11.95 7.73383 11.9026 7.8182 11.8182L10.0682 9.56821Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
      </svg>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({ className, children, position = "popper", ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-surface text-text-primary shadow-lg animate-in fade-in-80",
          position === "popper" && "translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-lg px-3 py-1.5 text-sm outline-none focus:bg-surface-hover focus:text-text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
}
