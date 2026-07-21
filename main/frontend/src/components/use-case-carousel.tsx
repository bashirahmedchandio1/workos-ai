"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const useCases = [
  {
    tab: "Sales",
    tagline: "From lead to follow-up in 30 seconds",
    trigger: "New HubSpot Lead",
    actions: [
      "Summarize company with AI",
      "Create Notion CRM page",
      "Notify Slack channel",
      "Draft personalized email",
    ],
    timeSaved: "30 min/lead",
  },
  {
    tab: "HR",
    tagline: "From hire to ready in 5 minutes",
    trigger: "New Employee Onboarded",
    actions: [
      "Create Google Workspace account",
      "Invite to Slack",
      "Create GitHub account",
      "Assign Notion docs + notify manager",
    ],
    timeSaved: "45 min/hire",
  },
  {
    tab: "Support",
    tagline: "From complaint to resolution in seconds",
    trigger: "Customer Complaint Received",
    actions: [
      "Analyze sentiment with AI",
      "Create Jira ticket",
      "Notify Slack support channel",
      "Draft response",
    ],
    timeSaved: "15 min/ticket",
  },
  {
    tab: "Marketing",
    tagline: "From video to campaign in 2 clicks",
    trigger: "YouTube Video Uploaded",
    actions: [
      "Generate blog post with AI",
      "Create LinkedIn post",
      "Generate Twitter thread",
      "Schedule social posts",
    ],
    timeSaved: "2 hrs/video",
  },
];

export default function UseCaseCarousel() {
  const [active, setActive] = useState(0);
  const current = useCases[active];

  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
           <h2 className="text-3xl md:text-4xl font-semibold text-zinc-100">
            Real workflows. Real results.
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            See how teams across your organization can save hours every week.
          </p>
        </motion.div>

        <div className="flex justify-center gap-1 mb-10">
          {useCases.map((uc, i) => (
            <button
              key={uc.tab}
              onClick={() => setActive(i)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                active === i
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:text-zinc-100"
              }`}
            >
              {uc.tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div className="rounded-xl border border-border bg-surface p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center rounded-full bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 text-xs font-medium text-purple-300">
                  TRIGGER
                </span>
                <span className="text-sm text-zinc-100 font-medium">
                  {current.trigger}
                </span>
              </div>
              <div className="space-y-2">
                {current.actions.map((action, i) => (
                  <div key={action} className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-muted border border-primary/20">
                      <span className="text-xs text-primary font-medium">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-sm text-text-secondary">
                      {action}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xl md:text-2xl font-semibold text-zinc-100 mb-4">
                {current.tagline}
              </p>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-sm text-text-tertiary">Time saved:</span>
                <span className="inline-flex items-center rounded-full bg-success/10 border border-success/20 px-3 py-1 text-sm font-medium text-success">
                  {current.timeSaved}
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-primary text-sm mt-0.5">✓</span>
                  <p className="text-sm text-text-secondary">
                    No manual workflow design. AI plans every step.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary text-sm mt-0.5">✓</span>
                  <p className="text-sm text-text-secondary">
                    Connects to your existing tools automatically.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary text-sm mt-0.5">✓</span>
                  <p className="text-sm text-text-secondary">
                    Review, approve, and execute with one click.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
