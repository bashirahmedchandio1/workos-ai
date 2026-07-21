"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";

const demoPrompt = "Save all PDF invoices from Gmail to Google Drive and notify Slack";
const fullPlanItems = [
  { type: "trigger", label: "New Gmail Email", detail: "Has PDF attachment" },
  { type: "action", label: "Download Attachment", detail: "Extract PDF from email" },
  { type: "action", label: "Upload to Google Drive", detail: "Invoices folder" },
  { type: "action", label: "Send Slack Notification", detail: "#finance channel" },
];

export default function AIPlannerDemo() {
  const [typedChars, setTypedChars] = useState(0);
  const [showArrow, setShowArrow] = useState(false);
  const [visiblePlanItems, setVisiblePlanItems] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const reset = useCallback(() => {
    setIsComplete(false);
    setTypedChars(0);
    setShowArrow(false);
    setVisiblePlanItems(0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typedChars < demoPrompt.length) {
        setTypedChars((c) => c + 1);
      } else {
        setShowArrow(true);
      }
    }, 30);
    return () => clearTimeout(timer);
  }, [typedChars]);

  useEffect(() => {
    if (!showArrow) return;
    const timer = setTimeout(() => {
      if (visiblePlanItems < fullPlanItems.length) {
        setVisiblePlanItems((v) => v + 1);
      } else {
        setIsComplete(true);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [showArrow, visiblePlanItems]);

  useEffect(() => {
    const interval = setInterval(() => {
      reset();
    }, 8000);
    return () => clearInterval(interval);
  }, [reset]);

  return (
    <section id="demo" className="py-24 md:py-32 border-t border-border">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
           <h2 className="text-3xl md:text-4xl font-semibold text-zinc-100">
            Describe. Refine. Done.
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Watch the AI planner transform a simple sentence into a complete
            automation workflow.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border border-border bg-surface p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Your Request
              </span>
            </div>
            <div className="rounded-lg bg-background/50 border border-border p-4 min-h-[80px]">
              <p className="text-sm text-zinc-100 font-mono leading-relaxed">
                &gt; {demoPrompt.slice(0, typedChars)}
                {typedChars < demoPrompt.length && (
                  <span className="inline-block w-1.5 h-4 bg-primary/70 animate-cursor rounded-sm ml-0.5 align-middle" />
                )}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl border border-border bg-surface p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
                AI Plan
              </span>
            </div>
            <div className="space-y-2 min-h-[80px]">
              {showArrow && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center mb-2"
                >
                  <ArrowRight size={16} className="text-primary" />
                </motion.div>
              )}
              {fullPlanItems.slice(0, visiblePlanItems).map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`rounded-lg border p-3 ${
                    item.type === "trigger"
                      ? "border-purple-500/30 bg-purple-500/10"
                      : "border-primary/20 bg-primary-muted/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-medium ${
                          item.type === "trigger"
                            ? "text-purple-300"
                            : "text-primary"
                        }`}
                      >
                        {item.type === "trigger" ? "TRIGGER" : `ACTION ${i}`}
                      </span>
                      <span className="text-sm text-zinc-100 font-medium">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-xs text-text-tertiary">
                      {item.detail}
                    </span>
                  </div>
                </motion.div>
              ))}
              {visiblePlanItems < fullPlanItems.length && showArrow && (
                <div className="flex items-center gap-1.5 text-xs text-text-tertiary animate-pulse">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary/50" />
                  Generating...
                </div>
              )}
              {isComplete && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-success mt-2"
                >
                  ✓ Plan ready &mdash; 4 steps, 2 connectors
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-text-tertiary">
            AI planner handles: intent understanding &bull; connector selection
            &bull; parameter mapping &bull; conditional logic
          </p>
        </motion.div>
      </div>
    </section>
  );
}
