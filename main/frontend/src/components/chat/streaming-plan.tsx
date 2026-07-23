"use client"

import { motion } from "motion/react"
import { ArrowDown, Sparkles, Zap, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlanStep {
  type: "trigger" | "action" | "condition"
  label: string
  connector?: string
  status?: "pending" | "running" | "completed" | "failed"
}

interface StreamingPlanProps {
  steps: PlanStep[]
  isStreaming?: boolean
  error?: string | null
}

function StepIcon({ type, status }: { type: string; status?: string }) {
  if (status === "running") return <Loader2 size={14} className="animate-spin" />
  if (status === "completed") return <CheckCircle size={14} className="text-success" />
  if (status === "failed") return <AlertCircle size={14} className="text-error" />

  switch (type) {
    case "trigger":
      return <Zap size={14} className="text-warning" />
    case "condition":
      return <AlertCircle size={14} className="text-text-tertiary" />
    default:
      return <Sparkles size={14} className="text-primary" />
  }
}

function StepBadge({ label }: { label: string }) {
  const l = label.toLowerCase()
  if (l === "trigger") return <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning uppercase">Trigger</span>
  if (l === "condition") return <span className="rounded-full bg-text-tertiary/10 px-2 py-0.5 text-[10px] font-medium text-text-tertiary uppercase">Condition</span>
  return <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary uppercase">Action</span>
}

export function StreamingPlan({ steps, isStreaming, error }: StreamingPlanProps) {
  if (steps.length === 0 && !isStreaming) return null

  return (
    <div className="mt-4 rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} className="text-primary" />
        <span className="text-sm font-semibold text-text-primary">Workflow Plan</span>
        {isStreaming && (
          <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
            <span className="flex gap-0.5">
              <span className="size-1 rounded-full bg-text-tertiary animate-bounce [animation-delay:0ms]" />
              <span className="size-1 rounded-full bg-text-tertiary animate-bounce [animation-delay:150ms]" />
              <span className="size-1 rounded-full bg-text-tertiary animate-bounce [animation-delay:300ms]" />
            </span>
            Thinking...
          </span>
        )}
      </div>

      {error && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-error/10 px-3 py-2 text-xs text-error">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <div className="space-y-2">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                step.status === "running"
                  ? "border-primary/30 bg-primary/5"
                  : step.status === "completed"
                  ? "border-success/20 bg-success/5"
                  : step.status === "failed"
                  ? "border-error/20 bg-error/5"
                  : "border-border bg-surface"
              )}
            >
              <StepIcon type={step.type} status={step.status} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary truncate">
                    {step.label}
                  </span>
                  <StepBadge label={step.type} />
                </div>
                {step.connector && (
                  <span className="text-xs text-text-tertiary">{step.connector}</span>
                )}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowDown size={14} className="text-text-tertiary" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function parseStreamToSteps(content: string): PlanStep[] {
  const lines = content.split("\n")
  const steps: PlanStep[] = []
  let currentStep: PlanStep | null = null

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.toLowerCase().startsWith("trigger:")) {
      if (currentStep) steps.push(currentStep)
      currentStep = { type: "trigger", label: trimmed.replace(/^Trigger:\s*/i, "") }
      continue
    }

    if (trimmed.toLowerCase().startsWith("action:")) {
      if (currentStep) steps.push(currentStep)
      currentStep = { type: "action", label: trimmed.replace(/^Action:\s*/i, "") }
      continue
    }

    if (trimmed.toLowerCase().startsWith("filter:") || trimmed.toLowerCase().startsWith("condition:")) {
      if (currentStep) steps.push(currentStep)
      currentStep = { type: "condition", label: trimmed.replace(/^(Filter|Condition):\s*/i, "") }
      continue
    }

    if (currentStep && trimmed) {
      currentStep.label += ` ${trimmed}`
    }
  }

  if (currentStep) steps.push(currentStep)
  return steps
}
