# WorkOS AI — Landing Page Design Spec

> **Status:** Draft v1
>
> **Target Conversion Rate:** >10% (vs. 3.8% SaaS median)
>
> **Core Metric:** Free trial sign-up completion
>
> **Primary Traffic:** Cold (organic / paid / social) + Warm (referral / retargeting)
>
> **Framework:** Next.js 16 + TailwindCSS v4 + Motion

---

## Table of Contents

1. [Brand & Positioning](#1-brand--positioning)
2. [Design Principles](#2-design-principles)
3. [Page Architecture & Section Map](#3-page-architecture--section-map)
4. [Section-by-Section Spec](#4-section-by-section-spec)
   - [4.1 Navigation](#41-navigation)
   - [4.2 Hero](#42-hero)
   - [4.3 Social Proof Bar](#43-social-proof-bar)
   - [4.4 How It Works](#44-how-it-works)
   - [4.5 Capability Surfaces](#45-capability-surfaces)
   - [4.6 Integration Wall](#46-integration-wall)
   - [4.7 Use Case Carousel](#47-use-case-carousel)
   - [4.8 AI Planner Demo](#48-ai-planner-demo)
   - [4.9 Approval Mode](#49-approval-mode)
   - [4.10 Pricing](#410-pricing)
   - [4.11 FAQ](#411-faq)
   - [4.12 Closing CTA](#412-closing-cta)
   - [4.13 Footer](#413-footer)
5. [Visual Design System](#5-visual-design-system)
6. [Copy Guidelines & Tone](#6-copy-guidelines--tone)
7. [Performance Budget](#7-performance-budget)
8. [Mobile Strategy](#8-mobile-strategy)
9. [Micro-Interactions & Animation](#9-micro-interactions--animation)
10. [Analytics & Measurement](#10-analytics--measurement)
11. [Implementation Notes for Engineering](#11-implementation-notes-for-engineering)
12. [Success Criteria](#12-success-criteria)

---

## 1. Brand & Positioning

### 1.1 Product Identity

| Attribute | Definition |
|---|---|
| **Product** | WorkOS AI — an AI employee that builds and runs automations from plain English |
| **Category** | AI-native automation platform |
| **One-liner** | "Describe your workflow. Let AI do the rest." |
| **Tagline variants** | "The AI employee that connects your apps", "Automation without the manual work" |
| **Competitive set** | Zapier, Make, n8n, Relay.app, Gumloop |
| **Key differentiator** | No manual workflow design. Users describe what they want in natural language. AI plans, builds, and executes. |
| **Target ICP** | Knowledge workers, operations managers, small business owners, sales/marketing ops — anyone who wastes 5+ hours/week on copy-paste between apps |
| **Tone** | Confident, capable, warm. Not hypey, not robotic. "Your smartest team member." |
| **Color personality** | Dark-first with vibrant electric violet accent. Technical but approachable. |

### 1.2 Messaging Hierarchy

```
Core Promise:
  "Automate your work in plain English — no workflows to design."

Primary Messages:
  • Describe what you want. AI builds the workflow.
  • Connects your apps: Gmail, Slack, Notion, Sheets, Drive, and more.
  • Review before execution. Approve with one click.
  • Real-time logs. Full transparency.

Secondary Messages:
  • Save 10+ hours/week on repetitive tasks.
  • Built on WorkOS — enterprise-grade security.
  • No coding. No manual triggers. No Zapier-style complexity.
```

### 1.3 Voice & Tone Guidelines

- **Do write** like a capable teammate explaining something simply: "Tell it what you need. It figures out the rest."
- **Don't write** like enterprise marketing: "Leverage our AI-powered synergistic automation ecosystem."
- **Numbers over adjectives**: "Save 12 hours a week" beats "Save massive time"
- **Specific over generic**: "When a new lead comes into HubSpot, summarize the company, create a Notion page, and notify Slack" beats "Automate your sales workflow"
- **Show, not tell**: Every capability claim should be demonstrable in the hero or the next section

---

## 2. Design Principles

### 2.1 Seven Design Principles

1. **Show the product working, not marketing abstraction.**
   - The hero contains a live/interactive prompt input. Static screenshots only appear as supporting elements.
   - Every visual is either real product UI or a believable representation of what the output looks like.

2. **One job per section.**
   - Hero → earn the scroll. Social proof → build trust. Features → build desire. Pricing → close.
   - No section tries to do two jobs. No CTA competes with another on the same screen.

3. **Dark-first, but not dark-only.**
   - Default theme: deep navy background (`oklch(0.07 0.02 280)`) with violet accent.
   - Light theme: clean off-white with the same violet accent (maintained via `next-themes`).
   - Dark mode is the default experience (matches AI-native brand expectations).

4. **Progressive disclosure.**
   - Cold visitors see the simplest version of the story. Scrolling reveals more depth.
   - Each 600px scroll-depth band has one new piece of information + one reason to continue.

5. **Social proof proximal to every decision point.**
   - Testimonials appear adjacent to pricing, feature sections, and the closing CTA.
   - Trust signals (SOC 2, G2, user count) appear above the fold and next to the primary CTA.

6. **Speed is a feature.**
   - Sub-2-second LCP. No render-blocking JavaScript. All animations are CSS/GPU-accelerated.
   - Every image is next/image with WebP/AVIF, lazy-loaded below the fold.

7. **Mobile as primary, desktop as canvas.**
   - Layout designed mobile-first. Desktop gets the full bento-grid treatment.
   - CTA is always above the fold on every device.

### 2.2 Hero Pattern Selection

**Pattern chosen: Interactive Demo (Pattern 3 from Brainy framework) + "Ask Anything" (Pattern from Ecrin Digital).**

- **Traffic context:** Majority cold. Cold visitors need to see the product working, not read claims about it.
- **Product complexity:** Medium-high (AI automation is a new category for most). An interactive prompt input reduces cognitive load.
- **Differentiator visibility:** The core differentiator (natural language → automation) is inherently interactive. A live demo communicates it in 2 seconds that paragraphs of copy cannot.

Secondary fallback pattern for repeat/hot traffic: **Split-screen** (product UI + headline) used on inner pages like `/pricing` and `/docs`.

---

## 3. Page Architecture & Section Map

### 3.1 Section Sequence (Desktop)

```
┌─────────────────────────────────────────────────────┐
│  [0] Navigation (sticky, transparent → solid)       │
│      Logo | Product | Pricing | Docs | [Sign In]    │
│                                         [Get Started]│
├─────────────────────────────────────────────────────┤
│  [1] Hero Section                                    │
│      Headline + Sub-headline + CTA + Prompt Demo    │
│      Trust bar: "Trusted by 100+ teams" + logos     │
├─────────────────────────────────────────────────────┤
│  [2] Social Proof Bar                                │
│      "Used by ops teams at..." + scrolling logos    │
├─────────────────────────────────────────────────────┤
│  [3] How It Works (3-step explainer)                │
│      Describe → Review → Execute                    │
├─────────────────────────────────────────────────────┤
│  [4] Capability Surfaces (Bento Grid)               │
│      Hero card: AI Planner                          │
│      3 smaller cards: Connectors, Execution, Watch  │
├─────────────────────────────────────────────────────┤
│  [5] Integration Wall                                │
│      Grid of connector logos by category            │
├─────────────────────────────────────────────────────┤
│  [6] Use Case Carousel                               │
│      Sales | HR | Support | Marketing                │
│      Each with a real workflow example              │
├─────────────────────────────────────────────────────┤
│  [7] AI Planner Demo (expanded)                     │
│      Animated plan generation walkthrough           │
├─────────────────────────────────────────────────────┤
│  [8] Approval Mode Section                           │
│      Screenshot of approval graph + benefits        │
├─────────────────────────────────────────────────────┤
│  [9] Pricing Section                                 │
│      Free | Pro | Enterprise                        │
│      Feature comparison table                       │
├─────────────────────────────────────────────────────┤
│ [10] FAQ                                             │
│      "What makes this different from Zapier?" etc   │
├─────────────────────────────────────────────────────┤
│ [11] Closing CTA                                     │
│      "Start building in 30 seconds"                 │
│      Large sign-up form (email only)                │
├─────────────────────────────────────────────────────┤
│ [12] Footer                                          │
│      Product | Resources | Company | Legal          │
└─────────────────────────────────────────────────────┘
```

### 3.2 Scroll Depth Distribution

| Section | Approx. height | Cum. scroll | Job |
|---|---|---|---|
| Nav | 64px | 0 | Wayfinding |
| Hero | 100vh | 0–100vh | Earn scroll, capture email |
| Social Proof | 120px | 100vh | Build trust |
| How It Works | 500px | +600px | Explain model |
| Capabilities | 700px | +1300px | Build desire |
| Integration Wall | 600px | +1900px | Prove compatibility |
| Use Cases | 600px | +2500px | Trigger recognition |
| AI Demo | 500px | +3000px | Demonstrate depth |
| Approval | 400px | +3400px | Address safety concern |
| Pricing | 800px | +4200px | Close |
| FAQ | 500px | +4700px | Remove objections |
| Closing CTA | 400px | +5100px | Final conversion |
| Footer | 300px | +5400px | Info |

---

## 4. Section-by-Section Spec

### 4.1 Navigation

```
Layout:
  ┌──────────────────────────────────────────────┐
  │  [⟐ WorkOS AI]  Product  Pricing  Docs  ...  │
  │                                    [Sign In] │
  │                                    [Get →]   │
  └──────────────────────────────────────────────┘
```

| Element | Detail |
|---|---|
| **Logo** | Left-aligned. "WorkOS AI" in Inter Semi-Bold, with a small "⟐" icon. Links to `/`. |
| **Nav links** | `Product` (dropdown: connectors, how it works, use cases), `Pricing`, `Docs` (links to docs subdomain) |
| **Sign In** | Right-aligned. Text link, `text-neutral-400 hover:text-white`. |
| **Get Started** | Primary CTA button. `bg-violet-600 hover:bg-violet-500 text-white`. Rounded-lg. "Get Started Free" |
| **Background** | `transparent` at top of page; transitions to `bg-neutral-950/80 backdrop-blur-xl` on scroll past hero. Use Motion's `useScroll` + `useTransform`. |
| **Mobile** | Hamburger menu (right side). Full-screen overlay with same links. "Get Started" prominent at bottom. |

**States:**
- Default: transparent, logo + nav links visible
- Scrolled >100px: glass-morphism background, thin bottom border (`border-b border-white/5`)
- Active link: underline or dot indicator below text

---

### 4.2 Hero

```
Layout (desktop):
  ┌────────────────────────────────────────────────────────────┐
  │                                                            │
  │  [glow effect - radial gradient behind headline]           │
  │                                                            │
  │  Headline (48px, bold, centered or left-aligned)           │
  │  Sub-headline (18px, neutral-300)                          │
  │                                                            │
  │  ┌─────────────────────────┐  ┌────────────────────────┐   │
  │  │ [Get Started Free →]    │  │ [Watch Demo ▸]         │   │
  │  │ "No credit card needed" │  │ (secondary/ghost)      │   │
  │  └─────────────────────────┘  └────────────────────────┘   │
  │                                                            │
  │  ┌──────────────────────────────────────────────────────┐  │
  │  │  "Describe your workflow..."                      ⏎  │  │
  │  │  [A cursor blinks. Below: example chips appear]      │  │
  │  │  "When a new lead..."  "Save invoice PDFs..."        │  │
  │  └──────────────────────────────────────────────────────┘  │
  │                                                            │
  │  Trust bar: "Trusted by 100+ teams" + 5 logo placeholders  │
  │                                                            │
  └────────────────────────────────────────────────────────────┘
```

#### 4.2.1 Headline

**Primary option (outcome-first):**
> "Automate your work in plain English."

**Sub-headline:**
> "Describe what you need. WorkOS AI builds the workflow, connects your apps, and executes it — no manual setup required."

**Rationale:**
- The headline names the outcome (automation) and the mechanism (plain English) in 6 words.
- The sub-headline handles the immediate objection ("how does that actually work?") by listing the three steps: builds, connects, executes.
- The "no manual setup required" tag at the end is the risk reducer.

**Secondary option (pain-point-first) — A/B test candidate:**
> "Stop building workflows. Start describing them."

**Sub-headline:**
> "Zapier and Make made you build everything by hand. WorkOS AI builds the automation for you — just tell it what you need."

#### 4.2.2 CTA Hierarchy

| CTA | Type | Copy | Behavior |
|---|---|---|---|
| Primary | Button (solid violet) | "Get Started Free" | Scrolls to sign-up form or opens sign-up modal |
| Secondary | Button (ghost/outline) | "Watch Demo ▸" | Opens lightbox video (90s product demo) |

**CTA micro-copy:** "No credit card required" appears below the primary CTA in `text-sm text-neutral-500`.

#### 4.2.3 Interactive Prompt Input

This is the **hero visual** — the most important element.

```
Behavior:
  1. Page loads → centered text input with cursor blinking
  2. Placeholder text: "Describe your workflow..." (animated typing effect, loops)
  3. Below the input, 3 example chips that scroll/cycle:
     "When a new lead arrives in HubSpot..."
     "Save all PDF invoices from Gmail to Google Drive..."
     "When a YouTube video is uploaded, create a blog post..."
  4. Clicking a chip populates the input with that example
  5. User can edit the text or type their own
  6. Hitting ⏎ or clicking "Generate" → calls POST /api/planner/generate
  7. Response streams into a plan preview below the input (inline, no page navigation)
  8. The plan preview shows a mini React Flow DAG with trigger → action → action
  9. After plan is generated: "See it in action" or "Sign up to save" CTA appears

States:
  - Idle: Input empty, cursor blinking, chips cycling
  - Typing: User types, suggestions fade
  - Generating: Button shows spinner, input disabled, skeleton state for plan
  - Result: Mini DAG visualization appears
  - Error: Inline error message + "Try again" button
```

**Technical note:** This interactive demo is the hero "image." There is no separate screenshot or illustration. The product IS the visual. This follows the Lovable and Linear pattern — the hero is the product itself, not a picture of the product.

#### 4.2.4 Trust Signals (Above Fold)

| Element | Placement |
|---|---|
| "Trusted by 100+ teams" (or actual user count if available) | Below CTA row |
| 5 grayscale logo placeholders (well-known tech/startup brands) | In a horizontal row |
| SOC 2 + GDPR badge (small, text) | Far right of trust bar |

If actual user count is not yet available, use a credibility stat instead: "Automated 10,000+ workflows" or similar.

#### 4.2.5 Background & Atmospheric Effects

- **Radial gradient glow** behind the headline: `radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.68 0.18 290 / 0.12), transparent)`
- **Subtle animated grid or dot pattern** in the background (opacity <5%, very faint)
- **No particle effects** — too distracting for B2B. Keep it clean.

#### 4.2.6 Mobile Hero

- Single column. Headline 32px. Sub-headline 16px.
- Interactive prompt input below headline (full width).
- CTA stack: primary first, secondary below.
- Trust bar as horizontal scroll of logos.
- Total hero height: ~90vh (input needs to be visible without scroll).

---

### 4.3 Social Proof Bar

```
Layout:
  ┌─────────────────────────────────────────────────────────────┐
  │  "Used by ops teams at fast-growing companies"              │
  │  [logo] [logo] [logo] [logo] [logo] [logo]                 │
  │                                                             │
  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
  │  │ ★★★★☆       │ │ ★★★★★       │ │ ★★★★★       │        │
  │  │ G2: 4.8/5    │ │ Capterra:    │ │ 10K+         │        │
  │  │              │ │ 4.9/5        │ │ workflows run│        │
  │  └──────────────┘ └──────────────┘ └──────────────┘        │
  └─────────────────────────────────────────────────────────────┘
```

| Element | Detail |
|---|---|
| Heading | "Used by ops teams at fast-growing companies" — sentence case, `text-sm text-neutral-400` |
| Logo row | Infinite horizontal scroll (CSS animation). Logos in grayscale (`filter: grayscale(100%) opacity(60%)`). Hover: remove grayscale. |
| Stat cards | 3 small cards below logos: G2 rating, Capterra rating, workflows run. Use only real data. If unavailable, skip. |

**Mobile:** Stat cards stack 1 per row. Logo scrolls horizontally.

---

### 4.4 How It Works

```
Layout:
  ┌─────────────────────────────────────────────────────────────┐
  │  "Three sentences. One automation."         ← headline     │
  │  "WorkOS AI turns your plain English request into a         │
  │   working automation in under 60 seconds."   ← sub-headline │
  │                                                             │
  │  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
  │  │ ① Describe │  │ ② Review   │  │ ③ Execute  │            │
  │  │            │  │            │  │            │            │
  │  │ [icon]     │  │ [icon]     │  │ [icon]     │            │
  │  │ Tell AI    │  │ See the    │  │ AI runs    │            │
  │  │ what you   │  │ plan.      │  │ it. Watch  │            │
  │  │ need in    │  │ Approve or │  │ logs in    │            │
  │  │ plain lang │  │ edit.      │  │ real-time. │            │
  │  └────────────┘  └────────────┘  └────────────┘            │
  │                                                             │
  │  [arrow connectors between cards]                           │
  │                                                             │
  │  [ "See how it works →" ]         ← ghost CTA              │
  └─────────────────────────────────────────────────────────────┘
```

| Element | Detail |
|---|---|
| Headline | "Three sentences. One automation." — bold, 36px |
| Sub-headline | "WorkOS AI turns your plain English request into a working automation in under 60 seconds." — 18px, `text-neutral-300` |
| Step cards | 3 cards in a horizontal row. Each has: step number, icon (Lucide), title, description. |
| Arrows | Animated arrow between cards (desktop only). Use SVG arrow with `stroke-dasharray` animation on scroll. |
| Bottom CTA | "See how it works →" — ghost button linking to demo page or scrolling to demo section |

**Card content:**

| Step | Icon | Title | Description |
|---|---|---|---|
| 1 | `MessageSquare` | Describe | "Type what you need in plain English. 'When a lead comes in, summarize it, create a Notion page, and notify Slack.'" |
| 2 | `Eye` | Review | "AI generates a complete workflow plan. See every step, every connection, every condition. Approve or refine." |
| 3 | `Play` | Execute | "WorkOS AI runs the automation. Watch real-time logs, see each step complete, and get notified when it's done." |

**Mobile:** Cards stack vertically. Arrows hidden.

---

### 4.5 Capability Surfaces (Bento Grid)

This section replaces the traditional feature grid. Based on the AI-native design pattern: each card shows the AI **doing** something, not a feature list.

```
Layout (bento grid):
  ┌─────────────────────────────────────────────────────────────┐
  │  "What WorkOS AI can do for you"          ← headline       │
  │                                                             │
  │  ┌──────────────────────────────────┐ ┌──────────────┐     │
  │  │ ★ AI PLANNER (large card)       │ │ Execution     │     │
  │  │                                  │ │ Engine        │     │
  │  │ Animated demo of prompt→plan     │ │              │     │
  │  │ transformation                   │ │ [icon + text] │     │
  │  └──────────────────────────────────┘ └──────────────┘     │
  │  ┌──────────────┐ ┌──────────────────────────────────┐     │
  │  │ Connectors    │ │ Watch Mode                      │     │
  │  │              │ │                                  │     │
  │  │ [icon+text]  │ │ Animated "watching" state demo   │     │
  │  └──────────────┘ └──────────────────────────────────┘     │
  └─────────────────────────────────────────────────────────────┘
```

**Large card — AI Planner:**
- Shows a prompt being typed character by character (on scroll reveal or on loop)
- Below it, a DAG plan renders node by node (trigger node → action node → action node)
- This is a mini React Flow component embedded in the section
- Labels: "Your request" → "AI Plan" with an animated transition

**Capability cards (3 smaller):**

| Card | Icon | Title | Body |
|---|---|---|---|
| Connectors | `Puzzle` | 20+ Integrations | "Gmail, Slack, Notion, Google Drive, Sheets, and more. All connected in one click." |
| Execution Engine | `GitBranch` | Smart Execution | "Parallel steps. Retry on failure. Conditional branching. WorkOS AI handles the complexity." |
| Watch Mode | `Radio` | Continuous Monitoring | "Set it and forget it. WorkOS AI watches for new triggers and runs your workflow automatically." |

**Mobile:** Bento grid collapses: large card is full-width, smaller cards stack 2 per row on tablet, 1 per row on phone.

---

### 4.6 Integration Wall

This section proves the product fits into the user's existing stack.

```
Layout:
  ┌─────────────────────────────────────────────────────────────┐
  │  "Works with the tools you already use"                    │
  │                                                             │
  │  Tab bar: [All] [Productivity] [Communication] [CRM] [Dev] │
  │                                                             │
  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
  │  │Gmail │ │Slack │ │Notion│ │Drive │ │Sheets│ │HubSpt│   │
  │  │ [icn]│ │ [icn]│ │ [icn]│ │ [icn]│ │ [icn]│ │ [icn]│   │
  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │
  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
  │  │GitHub│ │Jira  │ │Stripe│ │Zendk │ │......│ │......│   │
  │  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘   │
  │                                                             │
  │  "+ More coming every month"                                │
  └─────────────────────────────────────────────────────────────┘
```

| Element | Detail |
|---|---|
| Headline | "Works with the tools you already use" |
| Tab bar | Filter by category: All, Productivity, Communication, CRM & Sales, Development. Active tab has an underline. Clicking filters the grid with a stagger animation. |
| Connector cards | Icon + name. `bg-neutral-900/50 border border-neutral-800 rounded-xl p-4`. Hover: `border-violet-500/30 bg-violet-500/5`. |
| Connector count | Show actual connected connectors. If Phase 1 has 5, show those 5 plus "10+ more" greyed out. Do not show connectors that don't exist yet. |
| Bottom text | "+ More coming every month" — subtle, `text-sm text-neutral-500` |

**Data source:** This section renders from `GET /api/connectors` response. If the endpoint returns 5 connectors, show 5. Never fabricate connectors.

---

### 4.7 Use Case Carousel

Shows specific, relatable workflows. Each slide is a full vertical section visible on scroll.

```
Layout:
  ┌─────────────────────────────────────────────────────────────┐
  │  "Real workflows. Real results."                           │
  │                                                             │
  │  Tab row: [Sales] [HR] [Support] [Marketing]               │
  │           ◄                          ►                      │
  │                                                             │
  │  Active tab content:                                        │
  │  ┌──────────────┐  ┌──────────────────────────────────┐   │
  │  │ Workflow DAG  │  │ Copy block:                      │   │
  │  │ visualization │  │ "From lead to follow-up          │   │
  │  │               │  │  in 30 seconds"                  │   │
  │  │ Trigger  →    │  │                                  │   │
  │  │ Action 1 →    │  │ Trigger: New HubSpot lead         │   │
  │  │ Action 2 →    │  │ Action: Summarize company (AI)    │   │
  │  │ Action 3      │  │ Action: Create Notion page        │   │
  │  │               │  │ Action: Notify Slack              │   │
  │  └──────────────┘  │ Action: Draft email                │   │
  │                     └──────────────────────────────────┘   │
  └─────────────────────────────────────────────────────────────┘
```

**Slides content:**

| Tab | Trigger | Actions | Time saved |
|---|---|---|---|
| Sales | New HubSpot lead | Summarize company + Create Notion + Notify Slack + Draft email | 30 min/lead |
| HR | New employee joined | Create Google Workspace + Invite Slack + Create GitHub + Assign docs + Notify manager | 45 min/hire |
| Support | Customer complaint | Analyze sentiment + Create Jira + Notify Slack + Draft response | 15 min/ticket |
| Marketing | YouTube video uploaded | Generate blog post + Create LinkedIn post + Generate Twitter thread + Schedule social | 2 hrs/video |

**Mobile:** Tab bar becomes a horizontal scroll of pill-shaped tabs. DAG visualization is simplified.

---

### 4.8 AI Planner Demo (Expanded)

A deeper showcase of the planner in action. This is the "capability surface" for the AI Planner card in §4.5, expanded.

```
Layout:
  ┌─────────────────────────────────────────────────────────────┐
  │  "Describe. Refine. Done."                                 │
  │                                                             │
  │  Step through the planner:                                  │
  │                                                             │
  │  [1] Raw prompt → [animated arrow] → [2] AI Plan           │
  │                                                             │
  │  [Prompt panel]      [Plan panel]                           │
  │  ┌─────────────────┐ ┌──────────────────────────────────┐  │
  │  │ "Save all PDF   │ │ TRIGGER                          │  │
  │  │  invoices from  │ │ New Gmail Email                  │  │
  │  │  Gmail to Google│ │ └─ Has PDF attachment            │  │
  │  │  Drive and      │ │                                  │  │
  │  │  notify Slack"  │ │ ACTIONS                          │  │
  │  │                 │ │ 1. Download attachment            │  │
  │  │                 │ │ 2. Upload to Google Drive         │  │
  │  │                 │ │ 3. Send Slack notification        │  │
  │  └─────────────────┘ └──────────────────────────────────┘  │
  │                                                             │
  │  "AI planner handles: intent understanding, connector       │
  │   selection, parameter mapping, conditional logic."         │
  └─────────────────────────────────────────────────────────────┘
```

**Interaction design:**
- On scroll into view, the prompt types itself character by character
- Then the arrow animates (stroke-dashoffset transition)
- Then the plan panel populates node by node (staggered, ~300ms apart)
- This loop plays once, then stays static

**Mobile:** Prompt and plan panels stack vertically.

---

### 4.9 Approval Mode Section

Addresses the safety/control objection head-on.

```
Layout:
  ┌─────────────────────────────────────────────────────────────┐
  │  "Review before you run. Always."                          │
  │                                                             │
  │  Left:                                                      │
  │  ┌──────────────────────────────────────────────────┐      │
  │  │ [Screenshot of approval screen]                   │      │
  │  │ React Flow DAG with "Approve" / "Reject" buttons │      │
  │  └──────────────────────────────────────────────────┘      │
  │                                                             │
  │  Right:                                                     │
  │  ✓ See the full workflow graph                              │
  │  ✓ Connected apps + required permissions                    │
  │  ✓ Data flow visualization                                  │
  │  ✓ Approve or edit with one click                           │
  │                                                             │
  │  "Enterprise-grade controls. No black boxes."               │
  └─────────────────────────────────────────────────────────────┘
```

| Element | Detail |
|---|---|
| Headline | "Review before you run. Always." |
| Image | Real screenshot of the approval screen (from the actual app, not a mockup). Shows a DAG with approve/reject buttons. |
| Feature list | Bullet points with check icons. Each addresses a specific fear: "black box AI", "unexpected API calls", "wrong data being sent" |
| Closing line | "Enterprise-grade controls. No black boxes." |

---

### 4.10 Pricing Section

```
Layout:
  ┌─────────────────────────────────────────────────────────────┐
  │  "Simple pricing. No surprises."                           │
  │                                                             │
  │  [Monthly / Annual] toggle          "Save 20% with annual" │
  │                                                             │
  │  ┌─────────────┐ ┌─────────────┐ ┌──────────────────────┐  │
  │  │ Free         │ │ Pro         │ │ Enterprise           │  │
  │  │ $0           │ │ $XX/mo      │ │ Custom               │  │
  │  │              │ │             │ │                      │  │
  │  │ • 5 workflows│ │Everything   │ │Everything in Pro    │  │
  │  │ • 3 connectors│ │Free plus:  │ │  +                   │  │
  │  │ • Basic      │ │• Unlimited  │ │• SSO/SAML            │  │
  │  │   execution  │ │  workflows  │ │• Audit logs          │  │
  │  │ • Community  │ │• All        │ │• Dedicated support   │  │
  │  │   support    │ │  connectors │ │• Custom rate limits  │  │
  │  │              │ │• Watch mode │ │• SLA                 │  │
  │  │              │ │• Priority   │ │                      │  │
  │  │              │ │  support    │ │                      │  │
  │  │              │ │             │ │                      │  │
  │  │ [Get Started]│ │[Get Started]│ │[Contact Sales]       │  │
  │  └─────────────┘ └─────────────┘ └──────────────────────┘  │
  │                                                             │
  │  "No credit card required. Cancel anytime."                 │
  └─────────────────────────────────────────────────────────────┘
```

| Element | Detail |
|---|---|
| Headline | "Simple pricing. No surprises." |
| Toggle | Monthly / Annual. Annual shows "Save 20%" badge. |
| Free plan | $0. 5 workflows, 3 connectors, basic execution. "Get Started" CTA. |
| Pro plan | Highlighted (`border-violet-500 ring-1 ring-violet-500`). "Most popular" badge. Includes everything that matters. |
| Enterprise | Custom pricing. "Contact Sales" CTA. |
| Bottom assurance | "No credit card required. Cancel anytime." |

**Pricing content:** Must match actual implementation. If pricing is TBD, leave sections as `$XX` with a note.

---

### 4.11 FAQ

Removes remaining objections before the closing CTA.

| Question | Answer |
|---|---|
| "What makes WorkOS AI different from Zapier?" | Zapier requires you to manually build workflows step by step. WorkOS AI builds the workflow for you from a plain English description. You describe what you want; AI handles the rest. |
| "Do I need to know how to code?" | No. WorkOS AI is designed for anyone who can describe what they need in a sentence. No coding, no API knowledge, no workflow design experience required. |
| "Which apps can WorkOS AI connect to?" | WorkOS AI connects to Gmail, Slack, Notion, Google Drive, Google Sheets, and more. Our library is growing every month. [See all connectors →] |
| "How does WorkOS AI handle my data?" | WorkOS AI runs on the WorkOS platform with enterprise-grade security. Data is encrypted at rest and in transit. We never use your data to train models. SOC 2 compliant. |
| "Can I review workflows before they run?" | Yes. Every workflow shows you a complete plan before execution. You see every step, every connected app, and every data flow. Approve, edit, or reject — you're always in control. |
| "What happens if a step fails?" | WorkOS AI automatically retries failed steps with exponential backoff. After the maximum retries, the workflow is marked as failed and you're notified. You can inspect the logs and re-run. |

---

### 4.12 Closing CTA

The final conversion point. Minimal friction.

```
Layout:
  ┌─────────────────────────────────────────────────────────────┐
  │                                                             │
  │  "Start building in 30 seconds."         ← headline        │
  │                                                             │
  │  ┌──────────────────────────────────────┐                  │
  │  │ [email@example.com]            [→]   │  ← single field  │
  │  └──────────────────────────────────────┘                  │
  │                                                             │
  │  "No credit card required. Free forever plan available."    │
  │                                                             │
  │  [G2: 4.8/5 ★★★★☆]  [SOC 2]  [GDPR]                      │
  │                                                             │
  └─────────────────────────────────────────────────────────────┘
```

| Element | Detail |
|---|---|
| Headline | "Start building in 30 seconds." — 36px, bold. Time-based CTA ("30 seconds") outperforms generic alternatives. |
| Form | Single email field + submit button. Validation: valid email format. On submit: create account or send magic link. |
| Risk reducer | "No credit card required. Free forever plan available." |
| Trust badges | G2 rating, SOC 2, GDPR badges in a row |

---

### 4.13 Footer

```
Layout:
  ┌─────────────────────────────────────────────────────────────┐
  │  [⟐ WorkOS AI]                                              │
  │  "Automate your work in plain English."                     │
  │                                                             │
  │  Product  │  Resources  │  Company  │  Legal               │
  │  ───────  │  ─────────  │  ───────  │  ─────               │
  │  Pricing  │  Docs       │  About    │  Privacy             │
  │  Connectors│ API Ref    │  Blog     │  Terms               │
  │  Use Cases│  Changelog  │  Contact  │  Security            │
  │           │  Status     │  Careers  │                      │
  │                                                             │
  │  © 2026 WorkOS AI. All rights reserved.                     │
  └─────────────────────────────────────────────────────────────┘
```

- Logo + tagline on the left
- 4-column link grid
- Social links (GitHub, Twitter/X, LinkedIn) as icons
- Copyright at bottom

---

## 5. Visual Design System

### 5.1 Color System

```css
/* TailwindCSS v4 theme extension */
@theme {
  /* Dark theme (default) */
  --color-background:   oklch(0.07 0.02 280);   /* deep navy */
  --color-surface:      oklch(0.10 0.02 280);   /* card backgrounds */
  --color-surface-hover: oklch(0.14 0.02 280);  /* card hover */
  --color-border:       oklch(0.18 0.02 280);   /* borders */
  --color-border-hover: oklch(0.25 0.02 280);   /* border hover */

  /* Text */
  --color-text-primary:    oklch(0.95 0.01 280);  /* headings */
  --color-text-secondary:  oklch(0.65 0.02 280);  /* body */
  --color-text-tertiary:   oklch(0.45 0.02 280);  /* captions */

  /* Accent */
  --color-primary:       oklch(0.68 0.18 290);   /* violet */
  --color-primary-hover: oklch(0.62 0.20 290);
  --color-primary-muted: oklch(0.68 0.18 290 / 0.10);
  --color-primary-glow:  oklch(0.68 0.18 290 / 0.12);

  /* Success / Error / Warning */
  --color-success: oklch(0.62 0.15 150);
  --color-error:   oklch(0.55 0.20 30);
  --color-warning: oklch(0.70 0.18 85);
}
```

**Light theme overrides** (via `next-themes` class):

```css
.light {
  --color-background:   oklch(0.98 0.01 280);  /* off-white */
  --color-surface:      oklch(0.95 0.01 280);
  --color-surface-hover: oklch(0.92 0.01 280);
  --color-border:       oklch(0.85 0.02 280);
  --color-border-hover: oklch(0.75 0.02 280);
  --color-text-primary:    oklch(0.10 0.02 280);
  --color-text-secondary:  oklch(0.35 0.02 280);
  --color-text-tertiary:   oklch(0.55 0.02 280);
}
```

### 5.2 Typography

| Role | Font | Weight | Size (desktop) | Size (mobile) | Line height |
|---|---|---|---|---|---|
| Hero headline | `Geist Sans` | 700 | 48–56px | 32–36px | 1.1 |
| Section headline | `Geist Sans` | 600 | 36px | 28px | 1.15 |
| Sub-headline | `Geist Sans` | 400 | 18px | 16px | 1.5 |
| Card title | `Geist Sans` | 500 | 16px | 16px | 1.3 |
| Card body | `Geist Sans` | 400 | 14px | 14px | 1.5 |
| Body text | `Geist Sans` | 400 | 16px | 15px | 1.6 |
| Small/caption | `Geist Sans` | 400 | 13px | 12px | 1.4 |
| Code/technical | `Geist Mono` | 400 | 13px | 12px | 1.5 |

### 5.3 Spacing & Grid

- **Page max-width:** 1280px, centered with `mx-auto`
- **Section padding:** `py-24 md:py-32`
- **Card gap:** `gap-6` (desktop), `gap-4` (mobile)
- **Bento grid columns:** 2 on desktop (large card spans 2 cols), 1 on mobile
- **Content width:** `max-w-7xl` (1280px) for page, `max-w-3xl` (768px) for text blocks

### 5.4 Border Radius

| Element | Radius |
|---|---|
| Buttons | `rounded-lg` (8px) |
| Cards | `rounded-xl` (12px) |
| Input fields | `rounded-lg` (8px) |
| Modals | `rounded-2xl` (16px) |
| Badges | `rounded-full` |

### 5.5 Shadows & Glows

```css
/* Card shadow (dark mode) */
box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05),
            0 4px 6px -1px rgba(0, 0, 0, 0.3);

/* Card hover shadow */
box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08),
            0 8px 24px -4px rgba(0, 0, 0, 0.4);

/* Primary glow (buttons) */
box-shadow: 0 0 20px -4px oklch(0.68 0.18 290 / 0.3);
```

---

## 6. Copy Guidelines & Tone

### 6.1 Readability Rules

- All copy must pass the **5th–7th grade reading level** test (Flesch-Kincaid). SaaS landing pages at this level convert at 12.9% vs. 2.1% for complex copy.
- No word longer than 3 syllables unless it's a brand name or unavoidable technical term.
- One sentence = one idea. No compound sentences with "and."
- Paragraphs max 2 sentences. Bullet lists preferred.

### 6.2 Headline Formula

```
[Specific outcome] + [for whom] + [timeframe or qualifier]

Examples:
  "Automate your work in plain English"
  "Stop building workflows. Start describing them."
  "Your automation, built by AI in 60 seconds"
```

### 6.3 CTA Copy Rules

- Start with an action verb: "Start", "Get", "See", "Try", "Book"
- Include the outcome: "Get Started Free" (not just "Get Started")
- Add a risk reducer nearby: "No credit card required"
- Never use: "Submit", "Learn More", "Click Here"

| Context | CTA |
|---|---|
| Hero (primary) | "Get Started Free" |
| Hero (secondary) | "Watch Demo ▸" |
| Pricing | "Start Free Trial" |
| Pricing (enterprise) | "Contact Sales" |
| Closing section | "Start Building" |
| Blog/post CTA | "Try WorkOS AI Free" |

### 6.4 Social Proof Copy

- Use specific numbers: "10,000+ workflows automated" not "thousands"
- Name-drop when possible: "Trusted by ops teams at fast-growing companies"
- Third-party badges: G2, Capterra, SOC 2, GDPR

---

## 7. Performance Budget

| Metric | Target | Measurement |
|---|---|---|
| LCP (Largest Contentful Paint) | <2.0s | Lighthouse |
| TBT (Total Blocking Time) | <100ms | Lighthouse |
| CLS (Cumulative Layout Shift) | <0.05 | Lighthouse |
| SI (Speed Index) | <2.5s | Lighthouse |
| First load JS bundle | <150KB | `next/bundle-analyzer` |
| Total page weight | <500KB (images included) | DevTools |

**Performance rules:**
- All images use `next/image` with WebP format, AVIF where supported
- Hero interactive demo is code-rendered, not an iframe or heavy library
- React Flow components are lazy-loaded (`next/dynamic` with `ssr: false`)
- No third-party script that blocks rendering
- Font subsetting for Geist (only Latin characters, no unnecessary weights)

---

## 8. Mobile Strategy

### 8.1 Mobile Layout Rules

| Section | Desktop | Mobile (<768px) |
|---|---|---|
| Hero | Split or centered layout | Single column, stacked |
| How It Works | 3 columns horizontal | 1 column vertical |
| Capabilities | 2-column bento grid | 1 column |
| Integration Wall | 6×2 grid of logos | 3×4 scrollable |
| Use Cases | Side-by-side DAG + copy | Stacked: DAG on top, copy below |
| Pricing | 3 columns | 1 column, cards stacked |
| FAQ | 2-column accordion | 1-column accordion |
| Footer | 4-column grid | 2-column stack |

### 8.2 Mobile-Specific Interactions

- **Sticky CTA bar** at bottom after hero scroll (mobile only). Shows email input + "Get Started" button.
- **Hamburger menu** instead of visible navigation links.
- **Touch targets** minimum 44×44px (Apple HIG guideline).
- **Horizontal scroll** for integration logos (with CSS scroll-snap).
- **Swipe** for use case carousel (in addition to tab clicks).

### 8.3 Mobile Performance

- All animations disabled on `prefers-reduced-motion`
- Lazy-load all sections below the fold
- `will-change: transform` on scroll-triggered animations only

---

## 9. Micro-Interactions & Animation

### 9.1 Scroll-Triggered Animations

Use `framer-motion` (Motion) `useInView` + `motion.div`:

```tsx
// Standard reveal pattern
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-80px" }}
  transition={{ duration: 0.5, ease: "easeOut" }}
>
```

| Element | Animation | Delay | Duration | Easing |
|---|---|---|---|---|
| Hero headline | fade + slide up | 0ms | 500ms | easeOut |
| Hero sub-headline | fade + slide up | 100ms | 500ms | easeOut |
| Hero CTA | fade + slide up | 200ms | 400ms | easeOut |
| Section headlines | fade + slide up | 0ms | 500ms | easeOut |
| Card grid items | fade + slide up | stagger 80ms | 400ms | easeOut |
| Stat counters | count-up animation | 0ms | 2000ms | easeOut |
| Number badges | scale in | 0ms | 300ms | spring |

### 9.2 Hover States

| Element | Effect |
|---|---|
| Buttons (primary) | `scale(1.02)` + brighter glow |
| Buttons (ghost) | Background fill `bg-white/5` |
| Cards | Border `border-violet-500/30`, slight lift `translateY(-2px)` |
| Integration logos | Remove grayscale filter, `scale(1.05)` |
| Nav links | Underline slide-in (left to right) |

### 9.3 Interactive Demo Animations

- **Typing effect:** Characters appear one at a time at 50ms intervals. Loop on idle for 10 seconds.
- **Plan generation:** Nodes appear in DAG order (trigger first, then actions left to right) with 300ms stagger.
- **Arrow between steps in How It Works:** `stroke-dashoffset` animation on scroll reveal.
- **Use case carousel:** Tab content cross-fades with `opacity` transition (300ms).

### 9.4 Page Load Sequence

1. (0ms) Background loads, page visible
2. (100ms) Nav fades in
3. (200ms) Hero headline + sub-headline animate in
4. (400ms) CTA buttons animate in
5. (600ms) Interactive prompt input appears (cursor starts blinking)
6. (1000ms) Trust bar fades in below hero
7. (subsequent) Sections animate on scroll

---

## 10. Analytics & Measurement

### 10.1 Events to Track

| Event | Trigger | Data |
|---|---|---|
| `page_view` | Page load | URL, referrer, UTM params |
| `hero_prompt_typed` | User types in hero input | Character count, time to first keystroke |
| `hero_prompt_submitted` | User hits ⏎ in hero prompt | Prompt text (truncated) |
| `hero_plan_generated` | Plan returns | Success/error, prompt length, plan step count |
| `cta_click_primary` | Click "Get Started Free" | Section (hero, pricing, closing), scroll depth |
| `cta_click_secondary` | Click "Watch Demo" | — |
| `signup_started` | Email form interaction | Section |
| `signup_completed` | Successful sign-up | Plan tier, source |
| `pricing_toggle` | Monthly/Annual toggle | Selected |
| `faq_expand` | FAQ accordion opened | Question index |
| `scroll_depth` | Scroll milestones | 25%, 50%, 75%, 100% |

### 10.2 Conversion Funnel

```
Page Load (100%)
  └─ Hero prompt typed (target: >30%)
      └─ Plan generated (target: >90% of typed)
          └─ CTA clicked (target: >15% of page views)
              └─ Sign-up form started (target: >60% of clicks)
                  └─ Sign-up completed (target: >80% of started)
```

### 10.3 A/B Test Candidates

| Test | Variant A | Variant B | Metric |
|---|---|---|---|
| Hero headline | Outcome-first ("Automate your work...") | Pain-point-first ("Stop building workflows...") | CTA click rate |
| CTA copy | "Get Started Free" | "Try It Free →" | Sign-up completion |
| Social proof | "Trusted by 100+ teams" | "10,000+ workflows automated" | Scroll depth |
| Pricing layout | 3-column cards | Single-column list | Pricing section engagement |

---

## 11. Implementation Notes for Engineering

### 11.1 Component Tree

```
PageLayout
├── Navigation (client component)
│   ├── Logo
│   ├── NavLinks (dropdown on Product)
│   ├── SignInButton
│   └── GetStartedButton
├── HeroSection (client component)
│   ├── Headline
│   ├── SubHeadline
│   ├── CTAStack
│   │   ├── PrimaryButton
│   │   └── SecondaryButton
│   ├── InteractivePrompt (client component, heavy)
│   │   ├── TypewriterInput
│   │   ├── ExampleChips
│   │   ├── LoadingState (skeleton DAG)
│   │   └── PlanPreview (React Flow, lazy)
│   └── TrustBar
├── SocialProofBar (client component, minimal)
│   ├── Logos (infinite scroll)
│   └── StatCards
├── HowItWorks (client component)
│   └── StepCards (×3)
├── CapabilitySurfaces (client component)
│   ├── LargeCard (AI Planner demo, lazy)
│   └── SmallCards (×3)
├── IntegrationWall (client component)
│   ├── CategoryTabs
│   └── ConnectorGrid (fetches from /api/connectors)
├── UseCaseCarousel (client component)
│   ├── TabBar
│   └── SlideContent (×4)
├── AIPlannerDemo (client component, lazy)
├── ApprovalSection (client component)
├── PricingSection (client component)
│   ├── Toggle (Monthly/Annual)
│   └── PricingCards (×3)
├── FAQSection (client component)
│   └── AccordionItems (×6)
├── ClosingCTA (client component)
│   ├── Headline
│   ├── EmailForm
│   └── TrustBadges
└── Footer
```

### 11.2 Hydration Strategy

| Component | Hydration | Rationale |
|---|---|---|
| Navigation | `use client` (slight) | Sticky scroll effect needs client |
| Hero | `use client` | Interactive prompt, animations |
| SocialProofBar | `use client` (slight) | Infinite scroll animation |
| HowItWorks | `use client` (slight) | Scroll-triggered reveal |
| CapabilitySurfaces | `use client` (slight) | Scroll-triggered reveal |
| IntegrationWall | `use client` | Dynamic data from API, tab filtering |
| UseCaseCarousel | `use client` | Tab switching, swipe |
| AIPlannerDemo | `dynamic(() => ..., { ssr: false })` | Heavy animation, React Flow |
| ApprovalSection | Static | Static screenshot, no interaction |
| PricingSection | `use client` (slight) | Toggle state |
| FAQSection | `use client` (slight) | Accordion open/close |
| ClosingCTA | `use client` | Form validation |

### 11.3 Data Fetching

```typescript
// Integration wall — fetch available connectors
const { data: connectors } = useQuery({
  queryKey: ['connectors'],
  queryFn: () => fetch('/api/connectors').then(r => r.json()),
  staleTime: 60 * 60 * 1000, // 1 hour — rarely changes
});

// Hero prompt → generate plan
const generatePlan = useMutation({
  mutationFn: (prompt: string) =>
    fetch('/api/planner/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    }).then(r => r.json()),
});
```

### 11.4 Accessibility

- All interactive elements reachable and operable via keyboard
- `aria-label` on icon-only buttons (nav hamburger, carousel arrows)
- `aria-current="page"` on active nav link
- Skip-to-content link (visually hidden, focused on first Tab)
- `prefers-reduced-motion` disables all animations
- Color contrast ratios meet WCAG 2.1 AA (minimum 4.5:1 for text)
- Form inputs have associated `<label>` elements (not placeholders only)

---

## 12. Success Criteria

### 12.1 Launch Criteria (Must-Have)

- [ ] Lighthouse score ≥90 on all four metrics (Performance, Accessibility, Best Practices, SEO)
- [ ] LCP <2.0s on desktop and mobile (4G throttled)
- [ ] No layout shift (CLS <0.05)
- [ ] All interactive elements work on Safari, Chrome, Firefox, Edge (latest 2 versions)
- [ ] Full responsive fidelity on iPhone 14/15/16, Samsung S24, iPad, desktop 1920×1080
- [ ] Hero interactive prompt generates real plans via `/api/planner/generate`
- [ ] Sign-up form completes end-to-end (email → create account → dashboard redirect)
- [ ] All copy approved and at 5th–7th grade reading level
- [ ] Analytics events fire correctly (verify in dev tools)
- [ ] Dark mode and light mode both render correctly with no missing contrast

### 12.2 Post-Launch Targets

| Metric | 30-day target | 90-day target |
|---|---|---|
| Conversion rate (page view → sign-up) | >5% | >10% |
| Hero prompt interaction rate | >20% of visitors | >30% |
| Scroll depth to pricing | >15% | >25% |
| Sign-up completion rate | >70% | >80% |
| Mobile conversion rate | >3% | >7% |
| Bounce rate | <65% | <50% |
| Average session duration | >2 min | >3 min |

### 12.3 Quality Checklist

- [ ] No console errors in production
- [ ] No broken images or missing icons
- [ ] All links resolve to correct pages
- [ ] Loading states shown during data fetches
- [ ] Error states handled gracefully (toast or inline message)
- [ ] Empty states meaningful (e.g., "No connectors yet — they're coming!")
- [ ] 100% of sections render without JavaScript (noscript fallback)
- [ ] SEO meta tags (title, description, og:image, twitter:card) on every page
- [ ] sitemap.xml and robots.txt in place

---

## Appendix A: Copy Cheat Sheet

| Element | Copy (final) |
|---|---|
| Page title | WorkOS AI — Automate Your Work in Plain English |
| Meta description | Describe your workflow. AI builds it. Connects your apps. Runs it. No coding or manual setup required. |
| H1 | Automate your work in plain English. |
| H2 (How It Works) | Three sentences. One automation. |
| H2 (Capabilities) | What WorkOS AI can do for you |
| H2 (Integrations) | Works with the tools you already use |
| H2 (Use Cases) | Real workflows. Real results. |
| H2 (Approval) | Review before you run. Always. |
| H2 (Pricing) | Simple pricing. No surprises. |
| H2 (FAQ) | Questions? We've got answers. |
| H2 (Closing) | Start building in 30 seconds. |
| Primary CTA | Get Started Free |
| Secondary CTA | Watch Demo ▸ |
| Pricing CTA (Free) | Get Started |
| Pricing CTA (Pro) | Start Free Trial |
| Pricing CTA (Enterprise) | Contact Sales |
| Footer tagline | Automate your work in plain English. |

---

## Appendix B: Inspiration & References

| Site | Pattern to Learn From |
|---|---|
| **Lovable** | Hero IS the product (interactive prompt) |
| **Linear** | Clean dark-first B2B positioning |
| **Notion** | Clarity of value prop, social proof placement |
| **Webflow** | Interactive demo in hero |
| **ActiveCampaign** | Split hero (text + product demo), benefit-led headlines |
| **Ecrin Digital (Hear/Viewz)** | "Ask anything" hero, capability surfaces |
| **TheKitBase** | Dark-first with violet accent, animated API log |
| **Better Stack** | Pricing comparison, time-based CTA |
| **Aragon AI** | Social proof quantity, pricing anchoring |
| **Figma** | Enterprise credibility, case study integration |
