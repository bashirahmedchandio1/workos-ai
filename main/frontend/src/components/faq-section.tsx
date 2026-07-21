"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What makes WorkOS AI different from Zapier?",
    a: "Zapier requires you to manually build workflows step by step. WorkOS AI builds the workflow for you from a plain English description. You describe what you want; AI handles the rest.",
  },
  {
    q: "Do I need to know how to code?",
    a: "No. WorkOS AI is designed for anyone who can describe what they need in a sentence. No coding, no API knowledge, no workflow design experience required.",
  },
  {
    q: "Which apps can WorkOS AI connect to?",
    a: "WorkOS AI connects to Gmail, Slack, Notion, Google Drive, Google Sheets, and more. Our library is growing every month.",
  },
  {
    q: "How does WorkOS AI handle my data?",
    a: "WorkOS AI runs on the WorkOS platform with enterprise-grade security. Data is encrypted at rest and in transit. We never use your data to train models. SOC 2 compliant.",
  },
  {
    q: "Can I review workflows before they run?",
    a: "Yes. Every workflow shows you a complete plan before execution. You see every step, every connected app, and every data flow. Approve, edit, or reject — you're always in control.",
  },
  {
    q: "What happens if a step fails?",
    a: "WorkOS AI automatically retries failed steps with exponential backoff. After the maximum retries, the workflow is marked as failed and you're notified. You can inspect the logs and re-run.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
           <h2 className="text-3xl md:text-4xl font-semibold text-zinc-100">
            Questions? We&apos;ve got answers.
          </h2>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-xl border border-border overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-surface-hover"
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-medium text-zinc-100 pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-text-tertiary transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4">
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
