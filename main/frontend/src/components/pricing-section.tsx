"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: { monthly: "$0", annual: "$0" },
    description: "Perfect for trying out WorkOS AI.",
    features: [
      "5 workflows",
      "3 connectors",
      "Basic execution",
      "Community support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: { monthly: "$29", annual: "$23" },
    description: "For professionals and small teams.",
    features: [
      "Unlimited workflows",
      "All connectors",
      "Watch mode",
      "Priority support",
      "AI memory",
      "Approval mode",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: { monthly: "Custom", annual: "Custom" },
    description: "For organizations with advanced needs.",
    features: [
      "Everything in Pro",
      "SSO / SAML",
      "Audit logs",
      "Dedicated support",
      "Custom rate limits",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 md:py-32 border-t border-border">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
           <h2 className="text-3xl md:text-4xl font-semibold text-zinc-100">
            Simple pricing. No surprises.
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto">
            Start free. Upgrade when you need more.
          </p>
        </motion.div>

        <div className="flex items-center justify-center gap-3 mb-12">
          <span
            className={`text-sm ${
              !annual ? "text-zinc-100" : "text-text-tertiary"
            }`}
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              annual ? "bg-primary" : "bg-border"
            }`}
            aria-label="Toggle annual pricing"
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                annual ? "translate-x-5" : ""
              }`}
            />
          </button>
          <span
            className={`text-sm ${
              annual ? "text-zinc-100" : "text-text-tertiary"
            }`}
          >
            Annual
          </span>
          {annual && (
            <span className="inline-flex items-center rounded-full bg-success/10 border border-success/20 px-2.5 py-0.5 text-xs font-medium text-success">
              Save 20%
            </span>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-xl border p-6 flex flex-col ${
                plan.highlighted
                  ? "border-primary ring-1 ring-primary bg-surface"
                  : "border-border bg-surface"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-primary text-white px-3 py-0.5 text-xs font-medium">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-zinc-100">
                    {annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.name !== "Enterprise" && (
                    <span className="text-sm text-text-tertiary">/mo</span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check
                      size={16}
                      className="text-primary shrink-0 mt-0.5"
                    />
                    <span className="text-sm text-text-secondary">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`block text-center rounded-lg py-2.5 text-sm font-medium transition-all ${
                  plan.highlighted
                    ? "bg-primary hover:bg-primary-hover text-white"
                    : "border border-border hover:border-border-hover text-text-secondary hover:text-zinc-100"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs text-text-tertiary mt-8">
          No credit card required. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
