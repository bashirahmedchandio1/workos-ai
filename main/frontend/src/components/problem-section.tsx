"use client";

import { motion } from "motion/react";
import { Copy, SwitchCamera, Database, Bell, PenLine, FolderTree, Settings, ChevronRight } from "lucide-react";

const pains = [
  { icon: Copy, text: "Copying data between apps" },
  { icon: SwitchCamera, text: "Switching between applications" },
  { icon: Database, text: "Updating CRMs" },
  { icon: PenLine, text: "Creating tasks" },
  { icon: Bell, text: "Sending notifications" },
  { icon: FolderTree, text: "Organizing documents" },
];

const manualSteps = [
  "Select triggers",
  "Configure actions",
  "Understand APIs",
  "Handle authentication",
  "Map fields",
];

export default function ProblemSection() {
  return (
    <section className="py-24 md:py-32 border-t border-border relative overflow-hidden">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-error/20 bg-error/10 px-3 py-1 text-xs font-medium text-error mb-4">
                The Problem
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-zinc-100 mb-4">
                Modern teams use dozens of apps.
                <br />
                <span className="text-text-secondary">Hours disappear.</span>
              </h2>
              <p className="text-text-secondary mb-8 leading-relaxed">
                Employees waste hours every week on repetitive tasks that shouldn&apos;t
                require manual effort. Traditional automation platforms like Zapier
                and Make force you to build workflows by hand, which means you still
                need to understand APIs, map fields, and debug failed runs.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {pains.map((pain) => (
                  <div
                    key={pain.text}
                    className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3"
                  >
                    <pain.icon size={14} className="text-error shrink-0" />
                    <span className="text-sm text-text-secondary">{pain.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                <Settings size={14} className="text-text-tertiary" />
                Traditional platforms make you do this manually:
              </h3>
              <div className="space-y-0">
                {manualSteps.map((step, i) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 py-3 border-b border-border last:border-0"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-hover text-xs font-medium text-text-tertiary">
                      {i + 1}
                    </span>
                    <span className="text-sm text-text-secondary">{step}</span>
                    <ChevronRight size={14} className="ml-auto text-text-tertiary" />
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg bg-primary-muted/30 border border-primary/20 p-3">
                <p className="text-xs text-primary font-medium">
                  WorkOS AI replaces all 5 steps with one sentence.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
