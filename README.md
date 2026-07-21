# WorkOs AI
### The AI Employee That Builds and Runs Automations From Plain English

---

# Overview

WorkOs AI is an **AI-native automation platform** that enables users to automate work across their favorite applications using natural language.

Unlike Zapier, Make, or n8n, users do **not** manually design workflows.

Instead, they simply describe what they want.

Example:

> "Whenever a new lead is added in HubSpot, summarize the company, create a Notion page, notify Slack, and draft a personalized follow-up email."

The AI understands the request, selects the required connectors, builds the workflow, asks for approval, and executes it automatically.

---

# Problem

Modern businesses use dozens of SaaS applications.

Examples:

- Gmail
- Slack
- HubSpot
- Salesforce
- Google Sheets
- Notion
- Airtable
- GitHub
- Discord
- Trello
- ClickUp

Employees waste hours every week:

- Copying data
- Switching between applications
- Updating CRMs
- Creating tasks
- Sending notifications
- Organizing documents

Traditional automation platforms require technical knowledge.

Users must manually:

- Select triggers
- Configure actions
- Understand APIs
- Handle authentication
- Map fields

This creates unnecessary complexity.

---

# Solution

WorkOs AI transforms automation into conversation.

Instead of building workflows manually, users simply explain what they need.

AI handles:

- Intent understanding
- Workflow planning
- Connector selection
- Parameter mapping
- Conditional logic
- Error handling
- Execution

---

# Example Workflows

## Sales

"When a Facebook Lead arrives"

↓

Create HubSpot Contact

↓

Research Company

↓

Generate Lead Score

↓

Create Notion CRM Page

↓

Notify Sales Team

↓

Draft Personalized Email

---

## HR

"When a new employee joins"

↓

Create Google Workspace

↓

Invite Slack

↓

Create GitHub Account

↓

Assign Notion Docs

↓

Schedule Calendar Meeting

↓

Notify Manager

---

## Customer Support

"When a customer sends a complaint"

↓

Analyze Sentiment

↓

Create Jira Ticket

↓

Notify Slack

↓

Draft Response

↓

Schedule Follow-up

---

## Marketing

"When a YouTube video is uploaded"

↓

Generate Blog

↓

Create LinkedIn Post

↓

Generate Twitter Thread

↓

Schedule Social Posts

↓

Save Assets

---

# Core Features

## AI Workflow Builder

Users describe workflows using natural language.

AI generates:

- Trigger
- Actions
- Conditions
- Variables
- Dependencies

---

## AI Planner

OpenAI creates an execution plan.

Example

Input

> Save all PDF invoices from Gmail into Google Drive and notify Slack.

Output

```
Trigger:
New Gmail Email

↓

Filter:
Contains PDF

↓

Action:
Upload Google Drive

↓

Action:
Slack Notification
```

---

## Connector Marketplace

Supported Integrations

### Productivity

- Gmail
- Google Drive
- Google Sheets
- Google Calendar
- Outlook
- Dropbox
- OneDrive

---

### Communication

- Slack
- Discord
- Microsoft Teams

---

### CRM

- HubSpot
- Salesforce

---

### Development

- GitHub
- GitLab

---

### Project Management

- Notion
- Trello
- ClickUp
- Jira
- Asana

---

### Ecommerce

- Shopify
- WooCommerce
- Stripe

---

### AI

- OpenAI
- ElevenLabs

---

# AI Agent

The AI Agent can

- Think
- Plan
- Execute
- Retry
- Ask for clarification
- Monitor progress

instead of executing fixed automation chains.

---

# Watch Mode

Users can enable continuous monitoring.

Example

Watch Gmail

↓

New Invoice

↓

Extract Data

↓

Upload Google Drive

↓

Update Spreadsheet

↓

Notify Finance

No manual execution required.

---

# Human Approval Mode

Before execution

AI displays

✔ Workflow Graph

✔ Connected Apps

✔ Required Permissions

✔ Data Flow

Users approve before execution.

---

# Workflow History

Every execution stores

- Start Time
- End Time
- Duration
- Steps
- Logs
- Errors
- Retry Attempts

---

# AI Memory

The AI remembers

- Connected Apps
- User Preferences
- Previous Workflows
- Frequently Used Actions

Future workflows become smarter.

---

# Tech Stack

---

# Frontend

## Framework

- Next.js 16
- React 19
- TypeScript
- App Router

---

## Styling

- TailwindCSS v4

---

## UI Components

- shadcn/ui
- Radix UI

---

## Icons

- Lucide React

---

## Animations

- Motion (formerly Framer Motion)

---

## State Management

- TanStack Query
- Zustand

---

## Forms

- React Hook Form
- Zod

---

## Tables

- TanStack Table

---

## Flow Builder

- React Flow

---

## Charts

- Recharts

---

## Code Editor

- Monaco Editor

---

## Authentication

- Clerk

---

## Theme

- next-themes

---

## Notifications

- Sonner

---

## Drag & Drop

- dnd-kit

---

## Command Palette

- cmdk

---

## Data Visualization

- React Flow
- Mermaid Rendering (optional)

---

## File Upload

- UploadThing

---

# Backend

## Framework

- Python 3.13
- FastAPI

---

## Validation

- Pydantic v2

---

## ORM

- SQLModel

---

## Database

- PostgreSQL (Neon)

---

## Migrations

- Alembic

---

## Authentication

- Clerk (Frontend)
- Clerk JWT Validation (Backend — python-jose)

---

## Background Tasks

- Celery
- Redis

---

## Queue

- Redis

---

## AI

- OpenAI Responses API
- OpenAI Tools
- Structured Outputs
- Function Calling
- Embeddings

---

## Workflow Engine

Custom DAG Execution Engine

Responsible for

- Planning
- Dependencies
- Retries
- Scheduling
- Conditions

---

## Scheduler

APScheduler

---

## Logging

Loguru

---

## HTTP Client

HTTPX

---

## Async

asyncio

---

## Storage

Cloudflare R2

---

## Secrets

Vault / Environment Variables

---

# Database

PostgreSQL

Tables

- users
- organizations
- connectors
- oauth_tokens
- workflows
- workflow_steps
- workflow_runs
- execution_logs
- triggers
- actions
- approvals
- ai_memory

---

# Architecture

```
                    ┌───────────────────────┐
                    │      Next.js App      │
                    └──────────┬────────────┘
                               │
                     REST / WebSockets
                               │
                    ┌──────────▼──────────┐
                    │    FastAPI Server   │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼─────────────────────┐
        │                      │                     │
        ▼                      ▼                     ▼
 OpenAI Responses      Workflow Engine        Auth Service
        │                      │
        ▼                      ▼
 Planner Agent          DAG Executor
        │                      │
        └──────────────┬───────┘
                       ▼
               Connector Manager
                       │
 ┌───────────────────────────────────────────────────────┐
 │ Gmail │ Slack │ GitHub │ Notion │ Sheets │ HubSpot │  │
 │ Jira │ Stripe │ Discord │ Calendar │ Drive │ etc.   │
 └───────────────────────────────────────────────────────┘
                       │
                       ▼
                PostgreSQL + Redis
```

---

# Folder Structure

```
WorkOs-ai/

apps/
    web/
    api/

packages/
    ui/
    types/
    sdk/
    connectors/

services/
    planner/
    executor/
    workers/

docs/

docker/

.github/
```

---

# Future Roadmap

## Phase 1

- Authentication
- Connectors
- AI Planner
- Workflow Execution
- Approval Mode

---

## Phase 2

- Visual Workflow Builder
- Workflow Templates
- Team Workspaces
- AI Memory

---

## Phase 3

- Marketplace
- Community Templates
- Agent Teams
- Self-healing Workflows
- Autonomous Scheduling
- Enterprise RBAC

---

# Why WorkOs AI?

WorkOs AI removes the complexity of automation by combining natural language, intelligent planning, and application connectors into a single AI-native platform.

Instead of learning how to build workflows, users simply describe their business process, and an autonomous AI agent transforms that intent into a secure, executable automation—saving time, reducing repetitive work, and enabling anyone to automate like an expert.