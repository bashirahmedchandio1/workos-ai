"use client";

import { motion } from "motion/react";
import { Star } from "lucide-react";

const logos = [
  "Vercel", "Linear", "Notion", "Raycast", "WorkOS",
  "Vercel", "Linear", "Notion", "Raycast", "WorkOS",
];

export default function SocialProofBar() {
  return (
    <section className="border-y border-border py-10">
      <div className="container">
        <p className="text-center text-sm text-text-tertiary mb-6">
          Used by ops teams at fast-growing companies
        </p>

        <div className="overflow-hidden">
          <div className="flex animate-scroll-logos gap-12">
            {logos.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="text-sm font-semibold text-text-secondary/40 uppercase tracking-wider whitespace-nowrap hover:text-text-secondary/60 transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-6"
        >
          {[
            { label: "G2 Rating", value: "4.8/5", stars: 5 },
            { label: "Capterra", value: "4.9/5", stars: 5 },
            { label: "Workflows Run", value: "10,000+", stars: null },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2"
            >
              {stat.stars && (
                <div className="flex gap-0.5">
                  {Array.from({ length: stat.stars }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className="fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
              )}
              <span className="text-sm font-medium text-zinc-100">{stat.value}</span>
              <span className="text-xs text-text-tertiary">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
