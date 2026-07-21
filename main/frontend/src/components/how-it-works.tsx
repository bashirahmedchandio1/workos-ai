"use client";

import { motion } from "motion/react";
import { MessageSquare, Eye, Play, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Describe",
    description:
      'Type what you need in plain English. "When a lead comes in, summarize it, create a Notion page, and notify Slack."',
  },
  {
    number: "02",
    icon: Eye,
    title: "Review",
    description:
      "AI generates a complete workflow plan. See every step, every connection, every condition. Approve or refine.",
  },
  {
    number: "03",
    icon: Play,
    title: "Execute",
    description:
      "WorkOS AI runs the automation. Watch real-time logs, see each step complete, and get notified when it's done.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 relative overflow-hidden">
      <div className="pointer-events-none absolute -left-32 top-1/2 -translate-y-1/2 opacity-[0.03]">
        <svg width="300" height="400" viewBox="0 0 300 400" fill="none">
          <rect x="100" y="20" width="100" height="50" rx="8" stroke="white" strokeWidth="1" />
          <rect x="100" y="120" width="100" height="50" rx="8" stroke="white" strokeWidth="1" />
          <rect x="100" y="220" width="100" height="50" rx="8" stroke="white" strokeWidth="1" />
          <rect x="100" y="320" width="100" height="50" rx="8" stroke="white" strokeWidth="1" />
          <line x1="150" y1="70" x2="150" y2="120" stroke="white" strokeWidth="0.5" />
          <line x1="150" y1="170" x2="150" y2="220" stroke="white" strokeWidth="0.5" />
          <line x1="150" y1="270" x2="150" y2="320" stroke="white" strokeWidth="0.5" />
          <circle cx="150" cy="95" r="3" fill="white" />
          <circle cx="150" cy="195" r="3" fill="white" />
          <circle cx="150" cy="295" r="3" fill="white" />
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
            Three sentences. One automation.
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            WorkOS AI turns your plain English request into a working automation
            in under 60 seconds.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-6 z-10">
                  <ArrowRight
                    size={24}
                    className="text-text-tertiary/40"
                  />
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                <span className="text-5xl font-bold text-primary/20 mb-4">
                  {step.number}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-muted border border-primary/20 mb-4">
                  <step.icon size={22} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href="#demo"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-zinc-100 transition-colors"
          >
            See how it works <ArrowRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
