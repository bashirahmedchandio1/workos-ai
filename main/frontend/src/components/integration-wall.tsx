"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const categories = ["All", "Productivity", "Communication", "CRM & Sales", "Development"] as const;

type Category = (typeof categories)[number];

function GmailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M2 6L12 13L22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M2 6L12 13L22 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SlackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="13" y="2" width="4" height="8" rx="2" />
      <rect x="13" y="14" width="4" height="8" rx="2" />
      <rect x="2" y="13" width="8" height="4" rx="2" />
      <rect x="14" y="13" width="8" height="4" rx="2" />
    </svg>
  );
}

function NotionIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 7h8" />
      <path d="M8 12h6" />
      <path d="M8 17h4" />
    </svg>
  );
}

function DriveIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L22 17H2L12 2z" />
      <path d="M2 17h20" />
      <path d="M12 17l-4 5" />
      <path d="M12 17l4 5" />
    </svg>
  );
}

function SheetsIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h6" />
    </svg>
  );
}

function HubSpotIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l2 2 4-4" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.09.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function JiraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L4 12l8 10" />
      <path d="M12 2l8 10-8 10" />
    </svg>
  );
}

function StripeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M12 9v6" />
      <path d="M9 12h6" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12a1 1 0 100-2 1 1 0 000 2z" />
      <path d="M16 12a1 1 0 100-2 1 1 0 000 2z" />
      <path d="M8.5 7c3.5-1 5.5-1 9 0" />
      <path d="M15.5 7L18 17c-2 1-4 1.5-6 1.5S8 18 6 17l2.5-10" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

function SalesforceIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C7.58 2 4 5.58 4 10c0 2.21.89 4.21 2.34 5.66L12 21l5.66-5.34A8 8 0 0020 10c0-4.42-3.58-8-8-8z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

const connectorIcons: Record<string, () => React.ReactNode> = {
  Gmail: GmailIcon,
  Slack: SlackIcon,
  Notion: NotionIcon,
  "Google Drive": DriveIcon,
  "Google Sheets": SheetsIcon,
  HubSpot: HubSpotIcon,
  GitHub: GitHubIcon,
  Jira: JiraIcon,
  Stripe: StripeIcon,
  Discord: DiscordIcon,
  "Google Calendar": CalendarIcon,
  Salesforce: SalesforceIcon,
};

const connectors = [
  { name: "Gmail", category: "Productivity" },
  { name: "Slack", category: "Communication" },
  { name: "Notion", category: "Productivity" },
  { name: "Google Drive", category: "Productivity" },
  { name: "Google Sheets", category: "Productivity" },
  { name: "HubSpot", category: "CRM & Sales" },
  { name: "GitHub", category: "Development" },
  { name: "Jira", category: "Development" },
  { name: "Stripe", category: "CRM & Sales" },
  { name: "Discord", category: "Communication" },
  { name: "Google Calendar", category: "Productivity" },
  { name: "Salesforce", category: "CRM & Sales" },
];

export default function IntegrationWall() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filtered =
    activeCategory === "All"
      ? connectors
      : connectors.filter((c) => c.category === activeCategory);

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
            Works with the tools you already use
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            WorkOS AI connects to your favorite apps out of the box.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-text-secondary hover:border-border-hover hover:text-zinc-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((connector) => (
              <motion.div
                key={connector.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 hover:border-primary/30 hover:bg-primary-muted/30 transition-all group"
              >
                <span className="text-primary/70 group-hover:text-primary transition-colors shrink-0">
                  {connectorIcons[connector.name]?.()}
                </span>
                <span className="text-sm font-medium text-zinc-100 group-hover:text-primary transition-colors">
                  {connector.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <p className="text-center text-sm text-text-tertiary mt-8">
          + More coming every month
        </p>
      </div>
    </section>
  );
}
