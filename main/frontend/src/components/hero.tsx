"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const examplePrompts = [
  "When a new lead arrives in HubSpot, summarize the company, create a Notion page, and notify Slack",
  "Save all PDF invoices from Gmail to Google Drive and notify me on Slack",
  "When a YouTube video is uploaded, create a blog post, generate a Twitter thread, and schedule social posts",
];

const placeholderText = "Describe your workflow...";

export default function HeroSection() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
    }, 1500);
  };

  const handleChipClick = (text: string) => {
    setPrompt(text);
    setShowResult(false);
    inputRef.current?.focus();
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      <div className="hero-glow pointer-events-none absolute inset-0" />
      <div className="grid-pattern pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.04]">
        <svg className="absolute -right-20 -top-20 w-[600px] h-[600px]" viewBox="0 0 600 600" fill="none">
          <circle cx="300" cy="300" r="2" fill="white" />
          <circle cx="100" cy="150" r="2" fill="white" />
          <circle cx="500" cy="100" r="2" fill="white" />
          <circle cx="450" cy="450" r="2" fill="white" />
          <circle cx="150" cy="480" r="2" fill="white" />
          <circle cx="50" cy="350" r="1.5" fill="white" />
          <circle cx="550" cy="250" r="1.5" fill="white" />
          <circle cx="350" cy="520" r="1.5" fill="white" />
          <path d="M100 150 L300 300 L500 100" stroke="white" strokeWidth="0.5" />
          <path d="M300 300 L450 450" stroke="white" strokeWidth="0.5" />
          <path d="M300 300 L150 480" stroke="white" strokeWidth="0.5" />
          <path d="M300 300 L550 250" stroke="white" strokeWidth="0.5" />
          <path d="M300 300 L350 520" stroke="white" strokeWidth="0.5" />
          <path d="M100 150 L50 350" stroke="white" strokeWidth="0.5" />
          <path d="M500 100 L550 250" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-4"
        >
          <Badge variant="default" className="gap-1.5 px-4 py-1.5 text-xs">
            <Sparkles size={14} />
            AI-Powered Automation
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-100 leading-[1.1] tracking-tight max-w-3xl"
        >
          Automate your work in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
            plain English
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="mt-5 text-lg md:text-xl text-text-secondary max-w-2xl"
        >
          Describe what you need. WorkOS AI builds the workflow, connects your
          apps, and executes it &mdash; no manual setup required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3"
        >
          <Button size="lg" asChild>
            <Link href="/register">
              Get Started Free
              <ArrowRight size={18} />
            </Link>
          </Button>
          <Button variant="secondary" size="lg" asChild>
            <a href="#demo">
              <Play size={16} />
              Watch Demo
            </a>
          </Button>
          <span className="text-xs text-text-tertiary sm:ml-1">
            No credit card required
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          className="mt-10 w-full max-w-2xl"
        >
          <div className="relative">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface p-1.5 transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
              <input
                ref={inputRef}
                type="text"
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  setShowResult(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder={placeholderText}
                className="flex-1 bg-transparent px-3 py-2.5 text-zinc-100 placeholder-text-tertiary outline-none text-sm"
                aria-label="Describe your workflow"
              />
              <button
                onClick={handleSubmit}
                disabled={!prompt.trim() || isGenerating}
                className="flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 text-sm font-medium transition-all whitespace-nowrap"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    Generate <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 rounded-xl border border-primary/20 bg-primary-muted/50 p-4"
              >
                <div className="flex items-center gap-2 text-sm text-zinc-100 font-medium mb-2">
                  <Sparkles size={14} className="text-primary" />
                  AI-Generated Plan
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-surface border border-border px-2.5 py-1.5 text-zinc-100 font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                    New Gmail Email
                  </span>
                  <span className="text-text-tertiary">→</span>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-surface border border-border px-2.5 py-1.5 text-zinc-100 font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    Has PDF Attachment
                  </span>
                  <span className="text-text-tertiary">→</span>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-surface border border-border px-2.5 py-1.5 text-zinc-100 font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L22 17H2L12 2z"/><path d="M2 17h20"/><path d="M12 17l-4 5"/><path d="M12 17l4 5"/></svg>
                    Upload to Google Drive
                  </span>
                  <span className="text-text-tertiary">→</span>
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-surface border border-border px-2.5 py-1.5 text-zinc-100 font-medium">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="13" y="2" width="4" height="8" rx="2"/><rect x="13" y="14" width="4" height="8" rx="2"/><rect x="2" y="13" width="8" height="4" rx="2"/><rect x="14" y="13" width="8" height="4" rx="2"/></svg>
                    Notify Slack
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-text-tertiary">
              Try an example:
            </span>
            {examplePrompts.map((text, i) => (
              <button
                key={i}
                onClick={() => handleChipClick(text)}
                className={`rounded-full border px-3 py-1 text-xs transition-all ${
                  prompt === text
                    ? "border-primary/40 bg-primary-muted text-primary"
                    : "border-border text-text-tertiary hover:border-border-hover hover:text-text-secondary"
                }`}
              >
                {text.length > 40 ? text.slice(0, 40) + "..." : text}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 w-full"
        >
          <p className="text-xs text-text-tertiary mb-4">
            Trusted by ops teams at fast-growing companies
          </p>
          <div className="flex items-center justify-center gap-8 opacity-40">
            {["Vercel", "Linear", "Notion", "Raycast", "WorkOS"].map(
              (name) => (
                <span
                  key={name}
                  className="text-sm font-medium text-text-secondary tracking-wider uppercase"
                >
                  {name}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
