"use client";

import { motion } from "motion/react";
import { Shield, CheckCircle, Eye, GitBranch } from "lucide-react";

const features = [
  { icon: Eye, text: "See the full workflow graph before execution" },
  { icon: Shield, text: "Connected apps + required permissions displayed" },
  { icon: GitBranch, text: "Data flow visualization for every step" },
  { icon: CheckCircle, text: "Approve, edit, or reject with one click" },
];

export default function ApprovalSection() {
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
            Review before you run. Always.
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Every workflow shows you a complete plan before execution. No black
            boxes. No surprises.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-border bg-surface p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-zinc-100">
                Approval Required
              </span>
              <span className="inline-flex items-center rounded-full bg-warning/10 border border-warning/20 px-2 py-0.5 text-xs font-medium text-warning">
                Pending
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/10 p-3">
                <span className="text-xs font-medium text-purple-300 w-16">
                  TRIGGER
                </span>
                <span className="text-sm text-zinc-100">
                  New HubSpot Lead
                </span>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-4 bg-border" />
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary-muted/30 p-3">
                <span className="text-xs font-medium text-primary w-16">
                  STEP 1
                </span>
                <span className="text-sm text-zinc-100">
                  Summarize company (AI)
                </span>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-4 bg-border" />
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary-muted/30 p-3">
                <span className="text-xs font-medium text-primary w-16">
                  STEP 2
                </span>
                <span className="text-sm text-zinc-100">
                  Create Notion page
                </span>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-4 bg-border" />
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary-muted/30 p-3">
                <span className="text-xs font-medium text-primary w-16">
                  STEP 3
                </span>
                <span className="text-sm text-zinc-100">Notify Slack</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 rounded-lg bg-primary hover:bg-primary-hover text-white py-2 text-sm font-medium transition-all">
                ✓ Approve
              </button>
              <button className="flex-1 rounded-lg border border-border hover:border-border-hover text-text-secondary hover:text-zinc-100 py-2 text-sm font-medium transition-all">
                ✕ Reject
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-muted border border-primary/20">
                  <f.icon size={16} className="text-primary" />
                </div>
                <p className="text-sm text-text-secondary pt-1">{f.text}</p>
              </motion.div>
            ))}

            <p className="text-xs text-text-tertiary mt-4 pt-4 border-t border-border">
              Enterprise-grade controls. No black boxes.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
