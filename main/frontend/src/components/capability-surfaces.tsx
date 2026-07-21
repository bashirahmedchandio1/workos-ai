"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Puzzle,
  GitBranch,
  Radio,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const planSteps = [
  "When a new lead arrives in HubSpot...",
  "Summarize company information",
  "Create Notion CRM page",
  "Notify #sales channel on Slack",
  "Draft personalized email",
];

const capabilities = [
  {
    icon: Puzzle,
    title: "20+ Integrations",
    body: "Gmail, Slack, Notion, Google Drive, Sheets, and more. All connected in one click.",
  },
  {
    icon: GitBranch,
    title: "Smart Execution",
    body: "Parallel steps. Retry on failure. Conditional branching. WorkOS AI handles the complexity.",
  },
  {
    icon: Radio,
    title: "Continuous Monitoring",
    body: "Set it and forget it. WorkOS AI watches for new triggers and runs your workflow automatically.",
  },
];

export default function CapabilitySurfaces() {
  const [visibleSteps, setVisibleSteps] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (visibleSteps < planSteps.length) {
        const next = setTimeout(
          () => setVisibleSteps((v) => v + 1),
          400
        );
        return () => clearTimeout(next);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [visibleSteps]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleSteps(0);
      setTimeout(() => setVisibleSteps(1), 600);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden">
      <div className="pointer-events-none absolute -right-20 top-20 opacity-[0.03]">
        <svg width="250" height="250" viewBox="0 0 250 250" fill="none">
          <circle cx="125" cy="125" r="2" fill="white" />
          <circle cx="50" cy="60" r="1.5" fill="white" />
          <circle cx="200" cy="50" r="1.5" fill="white" />
          <circle cx="210" cy="190" r="1.5" fill="white" />
          <circle cx="60" cy="200" r="1.5" fill="white" />
          <circle cx="30" cy="130" r="1" fill="white" />
          <circle cx="220" cy="120" r="1" fill="white" />
          <circle cx="130" cy="30" r="1" fill="white" />
          <rect x="100" y="100" width="50" height="50" rx="6" stroke="white" strokeWidth="0.5" />
          <line x1="125" y1="100" x2="125" y2="60" stroke="white" strokeWidth="0.3" />
          <line x1="100" y1="125" x2="50" y2="125" stroke="white" strokeWidth="0.3" />
          <line x1="150" y1="125" x2="200" y2="125" stroke="white" strokeWidth="0.3" />
          <line x1="125" y1="150" x2="125" y2="190" stroke="white" strokeWidth="0.3" />
          <path d="M50 60 Q75 90 125 125" stroke="white" strokeWidth="0.3" strokeDasharray="2 2" />
          <path d="M200 50 Q180 80 125 125" stroke="white" strokeWidth="0.3" strokeDasharray="2 2" />
          <path d="M60 200 Q90 170 125 125" stroke="white" strokeWidth="0.3" strokeDasharray="2 2" />
          <path d="M210 190 Q180 160 125 125" stroke="white" strokeWidth="0.3" strokeDasharray="2 2" />
        </svg>
      </div>
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-zinc-100">
            What WorkOS AI can do for you
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            From understanding your intent to executing across your apps &mdash;
            AI handles the complexity so you don&apos;t have to.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 row-span-2 rounded-xl border border-border bg-surface p-6 md:p-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-primary" />
              <span className="text-sm font-medium text-zinc-100">
                AI Planner
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="rounded-lg border border-border bg-background/50 p-3">
                <p className="text-sm text-text-secondary font-mono">
                  &gt; Save all PDF invoices from Gmail to Google Drive and
                  notify Slack
                </p>
              </div>

              <div className="flex justify-center">
                <ArrowRight size={16} className="text-primary animate-pulse" />
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary-muted/30 p-3">
                <p className="text-xs text-text-tertiary mb-2 font-medium">
                  AI-Generated Plan
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {planSteps.slice(0, visibleSteps).map((step, i) => (
                    <motion.span
                      key={step}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium ${
                        i === 0
                          ? "border-purple-500/30 bg-purple-500/10 text-purple-300"
                          : "border-primary/20 bg-primary-muted text-primary/90"
                      }`}
                    >
                      {i > 0 && (
                        <span className="text-text-tertiary mr-0.5">→</span>
                      )}
                      {step}
                    </motion.span>
                  ))}
                  {visibleSteps < planSteps.length && (
                    <span className="inline-block w-2 h-4 bg-primary/50 animate-cursor rounded-sm" />
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-text-tertiary">
              AI planner handles: intent understanding, connector selection,
              parameter mapping, conditional logic.
            </p>
          </motion.div>

          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className="rounded-xl border border-border bg-surface p-6 hover:border-primary/20 hover:bg-surface-hover transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-muted border border-primary/20 mb-4 group-hover:bg-primary/20 transition-colors">
                <cap.icon size={20} className="text-primary" />
              </div>
              <h3 className="text-base font-semibold text-zinc-100 mb-2">
                {cap.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {cap.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
