# Phase 2 — Visual Builder, Templates, Teams & AI Memory

> **Goal:** Transform WorkOS AI from a prompt-and-execute tool into a collaborative automation platform where users can visually build workflows, share templates, work in teams, and benefit from AI that learns their preferences.
>
> **Duration Target:** 8–10 weeks
>
> **Definition of Done:** A user can drag-and-drop steps into a visual canvas, save a workflow as a template for the team, share workspaces with role-based permissions, and the AI planner's output improves measurably from learned user patterns.

---

## 1. Strategic Decisions

### 1.1 Library & Tool Decisions

| Concern | Choice | Rationale |
|---|---|---|
| Flow builder (frontend) | React Flow v12 + custom node/edge types | Already in Phase 1; the approval graph is a read-only preview — Phase 2 makes it fully editable |
| Flow state | Zustand (client-side) + TanStack Query (persistence) | Real-time drag operations are client state; save/load are server queries |
| Template storage | DB table `workflow_templates` + JSON plan cache | Templates are plans with metadata; no need for separate file storage |
| Team invites | Clerk organizations | Already using Clerk — native orgs, roles, invites |
| Activity feed | Denormalized `activity_events` table + WebSocket push | Avoids expensive joins for the feed view |
| AI Memory store | `ai_memory` table (PostgreSQL) + in-memory LRU cache | User-specific JSON blobs; cache hot patterns |
| Embeddings (memory) | OpenAI `text-embedding-3-small` | Semantic similarity for "remember similar workflows" |
| Search (templates) | PostgreSQL full-text search | Good enough for Phase 2 scale; no need for Meilisearch yet |

### 1.2 Key Architectural Principles

- **Canvas state is client-owned** — React Flow state lives in Zustand; only saved on explicit "Save" or auto-save debounced at 30s. No server-side DAG editing.
- **Templates are versioned** — when a user instantiates a template, it copies the plan snapshot. Template updates do not retroactively modify existing workflows.
- **Workspace isolation** — every query filters by `org_id`. Cross-org access is a hard error at the database layer (row-level security where possible).
- **AI Memory is append-only** — every interaction creates a record; the planner reads recent N entries. No mutation of history.
- **Offline-tolerant builder** — canvas state survives page refresh via `sessionStorage`; explicit save before navigation is not required but warned against data loss.

### 1.3 Phase 2 Connector Additions

Phase 1 ships 5 connectors. Phase 2 adds 5 more to demonstrate the template ecosystem:

| Connector | Category | Rationale |
|---|---|---|
| GitHub | Development | Most requested dev automation pattern |
| Discord | Communication | Social/community notifications |
| Jira | Project Management | Enterprise ticketing workflow |
| Stripe | Ecommerce | Payment event triggers |
| Google Calendar | Productivity | Scheduling / meeting workflows |

Existing Phase 1 connectors continue to work unchanged.

---

## 2. Visual Workflow Builder

### 2.1 Overview

The approval screen from Phase 1 (read-only React Flow graph) becomes a **full drag-and-drop editor**. Users can:

- Click "+" to add a trigger, action, or condition step
- Drag steps to reorder them
- Connect step outputs to step inputs by drawing edges
- Edit step configuration inline via a side panel
- Add conditional branches (if/then/else)
- Delete steps or edges
- Undo/redo changes
- See real-time validation (missing required fields, circular dependencies)

### 2.2 Canvas Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Toolbar: [Add Step ▼] [Undo] [Redo] [Zoom: 100% ▼] [Save] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────┐                                              │
│   │ Trigger  │  ← Draggable node, green border              │
│   │ New Email│                                              │
│   └────┬─────┘                                              │
│        │ (edge drawn by user or auto-wired)                 │
│   ┌────▼─────┐                                              │
│   │ Action   │  ← Rounded rect, blue border                 │
│   │ Send     │                                              │
│   │ Slack    │                                              │
│   └────┬─────┘                                              │
│        │                                                     │
│   ┌────▼─────┐     ┌──────────┐                             │
│   │ Condition│────►│ Action   │  ← Branching                │
│   │ Has PDF? │     │ Save to  │                             │
│   │ Yes ─────┘     │ Drive    │                             │
│   │ No ───────────►│ Action   │                             │
│   │               │ Reply    │                             │
│   └───────────────┘──────────┘                             │
│                                                             │
│  Bottom bar: [Validate] [Auto-Layout] [Fit View]            │
└─────────────────────────────────────────────────────────────┘
│  Side Panel (right):                                        │
│  ┌─────────────────┐                                        │
│  │ Step Config      │                                        │
│  │ ──────────────── │                                        │
│  │ Connector: Gmail │                                        │
│  │ Operation:       │                                        │
│  │   send_email   ▼ │                                        │
│  │ To: {{step_1...}}│                                        │
│  │ Subject: ...     │                                        │
│  │ [Test Step]      │                                        │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Node Types

| Node Type | Visual Style | Behavior |
|---|---|---|
| **Trigger** | Green border, pill shape, lightning icon | Exactly one per workflow; always at the top; no incoming edges |
| **Action** | Blue border, rounded rectangle | Has one output handle; connects to next step or condition |
| **Condition** | Yellow/diamond shape | Two output handles: "true" (green) and "false" (red); evaluates an expression |
| **Delay / Wait** | Gray, clock icon | Pauses execution for N minutes/hours; configurable duration |
| **Webhook** | Purple, web icon | Calls an external URL and uses the response as input |

### 2.4 Interaction Model

#### 2.4.1 Adding Steps

1. User clicks **"Add Step"** button in toolbar or the **"+"** handle on an existing edge
2. A popover shows categorized list: Triggers, Actions, Conditions, Other
3. Each item shows connector icon + operation name + short description
4. User selects → new node appears at cursor position or at the dropped edge midpoint
5. Node is auto-wired into the DAG at the insertion point
6. Side panel opens to the right showing step configuration

#### 2.4.2 Editing Steps

1. User clicks a node → side panel shows configuration
2. Configuration fields are rendered dynamically based on the operation's `input_schema` (JSON Schema → auto-generated form inputs)
3. Fields can reference previous step outputs via a template picker (`{{step_X.output.field}}`)
4. Changes are reflected immediately on the canvas (node label updates, edge validation)

#### 2.4.3 Connecting Steps

1. User drags from a node's output handle (bottom dot) to another node's input handle (top dot)
2. New edge appears; if it would create a circular dependency, the edge is rejected with a tooltip
3. User can delete an edge by clicking it (selects it) then pressing Delete or clicking the edge's "×" button

#### 2.4.4 Conditional Branching

1. User adds a **Condition** node
2. Configures the condition expression: `{{step_1.output.field}}` `contains` `"invoice"`
3. True branch automatically connects to one node; user can add nodes to the true path
4. False branch is created by clicking the false handle and connecting to another node
5. Both branches can be multi-step chains
6. Branches can rejoin (merge) by connecting their final node to a common downstream node

### 2.5 Validation

| Check | When | Error Indicator |
|---|---|---|
| Missing required config fields | On save or validate click | Red badge on node + side panel highlights empty fields |
| Circular dependency | On edge draw | Edge draw is rejected; toast message |
| Unconnected trigger output | On validate | Warning badge on trigger |
| Orphan nodes (no path from trigger) | On validate | Red outline on orphaned node |
| Missing connector auth | On save | Warning badge on connector config; user must connect in Settings |
| Step output type mismatch | On edge draw | Edge is dashed red; tooltip says type mismatch |

### 2.6 Undo / Redo

- Implemented via an action history stack in Zustand (max 50 entries)
- Each mutation (add/delete/move/connect/disconnect/edit config) pushes the previous state
- Keyboard shortcuts: `Ctrl+Z` (undo), `Ctrl+Shift+Z` (redo)

### 2.7 Auto-Layout

- Button in bottom bar runs `dagre` (already a React Flow dependency) to compute a topologically-sorted automatic layout
- Preserves existing node positions for unconnected nodes
- Useful when the canvas gets messy after many drag operations

### 2.8 Side Panel Detail

The right side panel has two modes:

**Node Config** (when a node is selected):
- Connector + operation picker (if editable)
- Dynamic form fields from `input_schema`
- Template variable picker (list of previous step outputs that can be inserted)
- "Test Step" button (runs the step once with current config and shows result)

**Workflow Settings** (when no node is selected):
- Workflow name
- Description
- Approval required toggle
- Error notification channel (Slack / Email / None)

### 2.9 API Endpoints

```http
POST   /api/workflows/{id}/validate     # Validate the current plan (server-side)
       Body: { plan: WorkflowPlan }
       200: { valid: bool, errors: [...] }

POST   /api/workflows/{id}/test-step    # Test a single step
       Body: { step_id: str, config: dict }
       200: { success: bool, output: dict, error: str | null }
```

### 2.10 Frontend Components

| Component | Description |
|---|---|
| `<WorkflowCanvas>` | Main canvas wrapper; manages React Flow instance + Zustand store |
| `<StepNode>` | Custom React Flow node; renders connector icon + label + status badge |
| `<ConditionNode>` | Diamond-shaped conditional node with true/false handles |
| `<StepConfigPanel>` | Right side panel; dynamic form generated from JSON Schema |
| `<VariablePicker>` | Dropdown list of previous step outputs; inserts `{{step_X.Y}}` |
| `<Toolbar>` | Add step, undo/redo, zoom controls, save button |
| `<ValidationBadge>` | Overlay on nodes indicating validation status |
| `<ConnectorPicker>` | Searchable dropdown of available operations grouped by connector |

### 2.11 Zustand Store Shape

```typescript
interface CanvasStore {
  // React Flow state
  nodes: Node[]
  edges: Edge[]
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect

  // Editor state
  selectedNodeId: string | null
  isDirty: boolean
  undoStack: CanvasSnapshot[]
  redoStack: CanvasSnapshot[]

  // Actions
  addStep: (type: StepType, connectorKey: string, operation: string) => void
  removeStep: (nodeId: string) => void
  updateStepConfig: (nodeId: string, config: Partial<StepConfig>) => void
  undo: () => void
  redo: () => void
  validate: () => ValidationResult
  autoLayout: () => void
  save: () => Promise<void>
}
```

---

## 3. Workflow Templates

### 3.1 Concept

Templates are pre-built workflow plans that users can browse, preview, and instantiate with one click. They accelerate the "blank page" problem and showcase platform capabilities.

### 3.2 Data Model

```sql
workflow_templates:
  id              UUID PRIMARY KEY
  org_id          UUID REFERENCES organizations(id)   -- NULL = global templates
  author_id       UUID REFERENCES users(id)
  name            TEXT NOT NULL
  description     TEXT
  category        TEXT        -- "sales" | "hr" | "marketing" | "support" | "engineering" | "finance"
  connector_keys  TEXT[]      -- ["gmail", "slack", "drive"] — for filtering
  plan            JSONB NOT NULL  -- full WorkflowPlan snapshot
  step_count      INTEGER
  usage_count     INTEGER DEFAULT 0
  is_featured     BOOLEAN DEFAULT FALSE
  is_public       BOOLEAN DEFAULT TRUE
  tags            TEXT[]
  created_at      TIMESTAMPTZ
  updated_at      TIMESTAMPTZ
```

### 3.3 Template Categories

| Category | Example Templates |
|---|---|
| **Sales** | Lead → CRM → Notify Slack; Invoice → Drive → Email |
| **HR** | New Hire → Create Accounts → Welcome Email; Timesheet → Approve → Payroll |
| **Marketing** | YouTube → Blog → Social Posts; Webinar Signup → CRM → Email Sequence |
| **Support** | Support Ticket → Slack → Jira; Refund Request → Approve → Process |
| **Engineering** | PR Merged → Deploy → Notify; Bug Report → Jira → Slack |
| **Finance** | Invoice Received → Approve → Pay; Expense Report → Approve → Reimburse |
| **Productivity** | Email Attachment → Drive → Notify; Daily Standup → Slack → Calendar |

### 3.4 Template Flow

```
Dashboard
  │
  ├── "Browse Templates" button
  │
  ▼
Template Gallery
  ├── Featured (carousel)
  ├── Categories (filterable grid)
  ├── Search (full-text on name + description + tags)
  └── Each card: icon set, name, description, step count, popularity
       │
       ▼
Template Preview
  ├── Read-only WorkflowGraph
  ├── Step list with connector labels
  ├── Required connectors (must be connected before use)
  └── [Use Template] button
       │
       ▼
Instantiate → Pre-fills PromptInput / Visual Builder
  ├── User can edit before saving
  └── On save, becomes a regular workflow (no link to template)
```

### 3.5 Creating Templates

Users with `admin` role can save any workflow as a template:

```http
POST   /api/workflows/{id}/publish-as-template
       Body: { name, description, category, tags, is_public }
       201: { template_id }
```

Admins can also create templates from scratch via the visual builder (no prompt required).

### 3.6 API Endpoints

```http
GET    /api/templates                  # List templates (paginated, filterable)
       ?category=sales
       &search=invoice
       &connectors=gmail,slack
       &page=1
       &sort=popularity|newest

GET    /api/templates/{id}             # Template detail + full plan

POST   /api/templates/{id}/use         # Instantiate template → new workflow
       Body: { workflow_name?: string }
       201: { workflow_id, plan }

POST   /api/workflows/{id}/publish-as-template
       Body: { name, description, category, tags, is_public? }
       201: { template_id }

PUT    /api/templates/{id}             # Update template metadata
DELETE /api/templates/{id}             # Soft-delete

GET    /api/templates/featured         # Featured templates (homepage)
```

### 3.7 Seed Templates (Phase 2)

| Name | Category | Connectors | Steps |
|---|---|---|---|
| "Invoice to Drive" | Productivity | Gmail, Drive, Slack | 3 |
| "Lead Capture" | Sales | Gmail, Slack, Sheets | 4 |
| "New Hire Onboarding" | HR | Slack, Calendar, Drive | 5 |
| "Bug Report Triage" | Engineering | GitHub, Slack, Jira | 3 |
| "Social Media Repost" | Marketing | YouTube, Twitter(API), LinkedIn | 3 |
| "Support Ticket Alert" | Support | Gmail, Slack, Jira | 3 |
| "Daily Standup Reminder" | Productivity | Slack, Calendar | 2 |
| "Invoice Approval" | Finance | Gmail, Slack, Drive | 4 |
| "PR Deployment" | Engineering | GitHub, Slack | 3 |
| "Event Follow-up" | Sales | Calendar, Gmail, Slack | 4 |

---

## 4. Team Workspaces

### 4.1 Concept

Organizations (workspaces) allow teams to share workflows, connectors, and templates. Each org has its own members, roles, and activity feed.

### 4.2 Data Model (Additions)

```sql
-- Organizations (extends Phase 1 model)
organizations: id, name, slug, logo_url, created_at, updated_at

-- Organization members
organization_members: id, org_id, user_id, role (admin/member/viewer), joined_at

-- Invitations
org_invitations: id, org_id, inviter_id, email, role, token, status (pending/accepted/expired), created_at, expires_at

-- Activity feed
activity_events: id, org_id, user_id, type (workflow_created/workflow_run/connector_connected/
                 template_published/member_joined), metadata (JSON), created_at
                 -- indexed by (org_id, created_at DESC)

-- Workflow ownership (Phase 1 assumed single-user; add org_id)
-- Add org_id column to workflows table
workflows: ... org_id UUID REFERENCES organizations(id) ...

-- Connector sharing
-- Add org_id column to oauth_tokens (optional: share tokens within org)
```

### 4.3 Roles & Permissions

| Permission | Admin | Member | Viewer |
|---|---|---|---|
| Create workflows | ✓ | ✓ | ✓ |
| Edit own workflows | ✓ | ✓ | Read-only |
| Edit any workflow | ✓ | — | — |
| Delete workflows | ✓ | Own only | — |
| Execute workflows | ✓ | ✓ | — |
| Connect connectors | ✓ | ✓ | — |
| View connector tokens | ✓ | — | — |
| Manage members (invite/remove) | ✓ | — | — |
| Change roles | ✓ | — | — |
| Delete workspace | ✓ | — | — |
| Publish templates | ✓ | ✓ | — |
| View activity feed | ✓ | ✓ | ✓ |
| Access settings | ✓ | ✓ | Read-only |

### 4.4 Workspace Flow

#### 4.4.1 Creating a Workspace

1. After sign-up, user has a personal workspace (auto-created)
2. User can create additional workspaces from settings
3. Each workspace has a unique slug for URL: `/workspace/{slug}`

#### 4.4.2 Inviting Members

1. Admin clicks "Invite Members" in workspace settings
2. Enters email addresses (comma-separated or bulk CSV)
3. Selects role for each invitee
4. System sends invitation email with accept link
5. Link contains a signed token; accepting creates `organization_members` row
6. Invitation expires after 7 days

```http
POST   /api/orgs/{id}/invite
       Body: { invites: [{ email, role }], message?: string }
       201: { created: [...], already_member: [...] }

POST   /api/orgs/invitations/{token}/accept
       200: { org_id, org_name, role }

GET    /api/orgs/{id}/invitations     # List pending invitations (admin only)
DELETE /api/orgs/{id}/invitations/{invitation_id}  # Cancel invitation
```

#### 4.4.3 Switching Workspaces

1. Top-left dropdown in sidebar shows user's workspaces with member count
2. Selecting switches context: workflows, connectors, and templates filter by the active workspace
3. Workspace slug is part of URL: `/workspace/{slug}/workflows`
4. State is persisted in Zustand (`activeOrgId`) and localStorage

#### 4.4.4 Activity Feed

The activity feed shows a chronological list of events within a workspace:

```
[2 min ago]  Alice  executed "Invoice Processing"  →  Completed (3 steps)
[10 min ago] Bob    connected Slack                 ✅
[1 hr ago]   Alice  created "Lead Capture" workflow  📝
[2 hr ago]   Bob    invited Charlie                  🎉
[3 hr ago]   Charlie joined the workspace             👋
```

### 4.5 API Endpoints

```http
# Organizations
POST   /api/orgs                        # Create workspace
GET    /api/orgs                        # List user's workspaces
GET    /api/orgs/{id}                   # Workspace details
PUT    /api/orgs/{id}                   # Update name, slug, logo
DELETE /api/orgs/{id}                   # Delete workspace (admin only)

# Members
GET    /api/orgs/{id}/members           # List members
PUT    /api/orgs/{id}/members/{user_id} # Change role
DELETE /api/orgs/{id}/members/{user_id} # Remove member

# Invitations
POST   /api/orgs/{id}/invite           # Invite members
GET    /api/orgs/{id}/invitations      # List pending invitations
POST   /api/orgs/invitations/{token}/accept  # Accept invitation
DELETE /api/orgs/{id}/invitations/{invitation_id}

# Activity
GET    /api/orgs/{id}/activity          # Activity feed (paginated)
       ?since=timestamp                 # For incremental loading

# Workflows (scoped)
GET    /api/workflows?org_id={id}       # List workflows in workspace
POST   /api/workflows?org_id={id}       # Create workflow in workspace
```

### 4.6 Frontend Pages

| Path | Page | Description |
|---|---|---|
| `/workspace/[slug]` | Workspace Home | Workflow list scoped to workspace + activity feed sidebar |
| `/workspace/[slug]/workflows` | All Workflows | Filterable grid of workflows in workspace |
| `/workspace/[slug]/workflows/new` | New Workflow | Prompt → plan → builder, scoped to workspace |
| `/workspace/[slug]/settings` | Workspace Settings | Name, logo, members, invitations, danger zone |
| `/workspace/[slug]/templates` | Templates | Template gallery scoped to workspace (org templates + global) |
| `/workspace/[slug]/activity` | Activity Feed | Full activity history |
| `/settings/workspaces` | Workspace List | Create/switch/leave workspaces |

### 4.7 Frontend Components

| Component | Description |
|---|---|
| `<WorkspaceSwitcher>` | Dropdown in sidebar showing user's workspaces with active indicator |
| `<MemberList>` | Table of members with role badges + actions (admin) |
| `<InviteDialog>` | Modal with email input + role selector + bulk paste |
| `<ActivityFeed>` | Scrollable list of activity events with icons and timestamps |
| `<WorkspaceSettings>` | General settings + member management + danger zone |

---

## 5. AI Memory

### 5.1 Concept

AI Memory gives the planner contextual awareness of the user's patterns, preferences, and history. Instead of treating every prompt as a blank slate, the planner enriches its system prompt with learned information.

### 5.2 What Memory Stores

| Category | Data | Source |
|---|---|---|
| **Connector affinity** | Which connectors the user connects most frequently | OAuth token creation timestamps |
| **Operation affinity** | Which operations the user uses most (e.g., "send_slack_message" is used in 80% of workflows) | Workflow step analysis |
| **Preferred notification channel** | Slack channel or email address for notifications | User settings (explicit) + workflow patterns (implicit) |
| **Frequent trigger patterns** | "new_gmail_email" is the trigger in 60% of workflows | Workflow trigger analysis |
| **Common parameter values** | Commonly used email templates, Slack channel names, Drive folder IDs | Step config analysis (anonymized — stores pattern not exact values) |
| **Recently approved plans** | Last 5 completed workflow plans (for few-shot prompting) | Workflow run history |
| **User corrections** | When a user edits a generated plan, the original vs. edited diff | Plan edit history |
| **Connector auth status** | Which connectors are currently authenticated | OAuth token table |

### 5.3 Data Model

```sql
-- Extends Phase 1 ai_memory table
ai_memory:
  id              UUID PRIMARY KEY
  user_id         UUID REFERENCES users(id)
  org_id          UUID REFERENCES organizations(id)

  -- Key-value store within user+org scope
  key             TEXT           -- e.g., "connector_affinity", "operation_frequency", "preferred_slack_channel"
  value           JSONB          -- Structured data

  -- Embedding for semantic search
  embedding       vector(1536)   -- OpenAI text-embedding-3-small

  -- Metadata
  weight          FLOAT DEFAULT 1.0   -- How reliable this memory is (higher = more recent/frequent)
  category        TEXT           -- "preference" | "pattern" | "correction" | "context"
  created_at      TIMESTAMPTZ
  updated_at      TIMESTAMPTZ

  -- Indexes
  UNIQUE (user_id, org_id, key)
  INDEX (user_id, org_id, category)
```

### 5.4 Memory Collection (Background Job)

A daily Celery task analyzes each user's workflow history:

```python
async def refresh_user_memory(user_id: UUID, org_id: UUID):
    # 1. Connector affinity
    workflows = await get_workflows(user_id, org_id, last_30_days=True)
    connector_counts = Counter(step.connector_key for w in workflows for step in w.steps)
    await upsert_memory(user_id, org_id, "connector_affinity", connector_counts.most_common(10))

    # 2. Operation frequency
    operation_counts = Counter((step.connector_key, step.operation) for w in workflows for step in w.steps)
    await upsert_memory(user_id, org_id, "operation_frequency", operation_counts.most_common(20))

    # 3. Trigger patterns
    trigger_counts = Counter(w.plan.trigger.connector_key + "." + w.plan.trigger.operation for w in workflows)
    await upsert_memory(user_id, org_id, "trigger_patterns", trigger_counts.most_common(5))

    # 4. Recent plans (for few-shot)
    recent_plans = [w.plan for w in workflows if w.status == "completed"][:5]
    await upsert_memory(user_id, org_id, "recent_plans", recent_plans)
```

### 5.5 Memory Retrieval (Planner Integration)

When the planner receives a prompt, it:

1. Loads memory entries for the user+org (categories: "preference", "pattern", "correction", "context")
2. Constructs a **context block** appended to the system prompt:

```
--- User Context ---
Preferred notification channel: Slack (#alerts)
Frequently used connectors: Gmail (80%), Slack (65%), Google Drive (40%)
Recently used operations: Gmail.new_email, Slack.send_message, Drive.upload_file
Connected connectors: Gmail, Slack, Google Drive, Notion

--- Similar Past Workflows ---
1. "Save invoice attachments from Gmail to Drive and notify Slack"
   → new_email → has_attachment → download → upload → send_message
   (executed 12 times, 100% success)

2. "When a lead email arrives, create Notion page and Slack the team"
   → new_email → create_page → send_message
   (executed 8 times, 87% success)
```

### 5.6 Memory from User Corrections

When a user edits a generated plan in the visual builder and saves:

1. Compute the diff between the original AI plan and the user's edited plan
2. If the diff is significant (structural change, not just label tweaks), store a "correction" memory:
   - Key: `correction_{date}`
   - Value: `{ original_plan, edited_plan, prompt }`
3. Next time a similar prompt is received, the planner sees the correction as a negative example

This enables the planner to learn from user edits without retraining.

### 5.7 Privacy & Controls

- Users can view their memory summary in Settings
- Users can delete individual memory entries or wipe all memory
- Users can opt out of AI Memory collection entirely (disables the background job)
- Memory is scoped to user+org; not shared across orgs
- No raw step config values are stored (only patterns: field names, not values)

### 5.8 API Endpoints

```http
GET    /api/memory                      # List memory summary for current user
GET    /api/memory/{key}                # Get specific memory entry
DELETE /api/memory/{key}                # Delete a memory entry
DELETE /api/memory                      # Wipe all memory for current user
PUT    /api/memory/settings             # { memory_enabled: bool }
```

---

## 6. Data Model Changes (Phase 2)

### 6.1 New Tables

```sql
-- Templates
workflow_templates: id, org_id, author_id, name, description, category,
    connector_keys(TEXT[]), plan(JSONB), step_count, usage_count,
    is_featured, is_public, tags(TEXT[]), created_at, updated_at

-- Organizations (extended)
organizations: id, name, slug(UNIQUE), logo_url, created_at, updated_at
organization_members: id, org_id, user_id, role(ENUM), joined_at
org_invitations: id, org_id, inviter_id, email, role, token(UNIQUE),
    status(ENUM), created_at, expires_at

-- Activity
activity_events: id, org_id, user_id, type(ENUM), metadata(JSONB), created_at

-- Memory (extended)
ai_memory: id, user_id, org_id, key, value(JSONB), embedding(vector(1536)?),
    weight, category, created_at, updated_at
```

### 6.2 Modified Tables

```sql
-- Add org_id + editing to workflows
workflows: ... + org_id(UUID FK), canvas_state(JSONB — React Flow snapshot),
    source_template_id(UUID FK NULL)

-- Add org_id scoping to oauth_tokens (optional sharing)
oauth_tokens: ... + org_id(UUID FK)
```

---

## 7. API Design (Phase 2)

### 7.1 New Endpoint Groups

```http
# Visual Builder
POST   /api/workflows/{id}/validate             # Validate plan
POST   /api/workflows/{id}/test-step            # Test single step execution
PUT    /api/workflows/{id}/canvas               # Save canvas state

# Templates
GET    /api/templates                           # List (paginated, filtered)
GET    /api/templates/featured                  # Featured templates
GET    /api/templates/{id}                      # Detail
POST   /api/templates/{id}/use                  # Instantiate
POST   /api/workflows/{id}/publish-as-template  # Publish
PUT    /api/templates/{id}                      # Update metadata
DELETE /api/templates/{id}                      # Delete

# Organizations
POST   /api/orgs                                # Create
GET    /api/orgs                                # List my orgs
GET    /api/orgs/{id}                           # Detail
PUT    /api/orgs/{id}                           # Update
DELETE /api/orgs/{id}                           # Delete
GET    /api/orgs/{id}/members                   # List members
PUT    /api/orgs/{id}/members/{user_id}         # Change role
DELETE /api/orgs/{id}/members/{user_id}         # Remove member
POST   /api/orgs/{id}/invite                    # Invite members
GET    /api/orgs/{id}/invitations               # List pending
POST   /api/orgs/invitations/{token}/accept     # Accept invite
DELETE /api/orgs/{id}/invitations/{invite_id}   # Cancel invite
GET    /api/orgs/{id}/activity                  # Activity feed

# AI Memory
GET    /api/memory                              # List memory
GET    /api/memory/{key}                        # Get entry
DELETE /api/memory/{key}                        # Delete entry
DELETE /api/memory                              # Wipe all
PUT    /api/memory/settings                     # Update preferences

# Phase 2 Connectors
GET    /api/connectors/github                   # GitHub connector
GET    /api/connectors/discord                  # Discord connector
GET    /api/connectors/jira                     # Jira connector
GET    /api/connectors/stripe                   # Stripe connector
GET    /api/connectors/calendar                 # Google Calendar connector
```

### 7.2 Modified Endpoints

```http
# Workflows — add org_id param
GET    /api/workflows?org_id={id}
POST   /api/workflows  Body: { ..., org_id }

# Connectors — add org_id for shared tokens
GET    /api/connectors/connected?org_id={id}
DELETE /api/connectors/{key}/auth?org_id={id}
```

---

## 8. Frontend Pages & Components (Phase 2)

### 8.1 New Pages

| Path | Page | Description |
|---|---|---|
| `/workspace/[slug]` | Workspace Home | Dashboard for workspace |
| `/workspace/[slug]/workflows` | Workflows (scoped) | Workflow list filtered to workspace |
| `/workspace/[slug]/workflows/new` | New Workflow (scoped) | Prompt → plan → builder in workspace context |
| `/workspace/[slug]/workflows/[id]/edit` | Visual Builder | Full drag-and-drop canvas |
| `/workspace/[slug]/templates` | Template Gallery | Browse, search, instantiate templates |
| `/workspace/[slug]/templates/[id]` | Template Preview | Read-only plan + "Use Template" button |
| `/workspace/[slug]/settings` | Workspace Settings | General, members, invitations, danger zone |
| `/workspace/[slug]/activity` | Activity Feed | Full workspace activity history |
| `/settings/workspaces` | Workspace Manager | Create, switch, leave workspaces |
| `/settings/memory` | AI Memory Settings | View/delete memory, opt-out toggle |

### 8.2 New & Updated Components

| Component | Description |
|---|---|
| `<WorkflowCanvas>` | React Flow editor with drag-drop, undo/redo, validation |
| `<StepConfigPanel>` | Right panel with dynamic form from JSON Schema |
| `<VariablePicker>` | Template variable `{{step_X.field}}` selector |
| `<ConnectorPicker>` | Searchable connector + operation selector |
| `<TemplateCard>` | Template preview card with icon row + step count |
| `<TemplateGallery>` | Filterable, searchable grid of templates |
| `<WorkspaceSwitcher>` | Sidebar dropdown for workspace selection |
| `<MemberList>` | Member table with role badges + actions |
| `<InviteDialog>` | Invite form with email input + role selector |
| `<ActivityFeed>` | Scrollable chronological activity list |
| `<MemorySummary>` | Read-only display of user's AI memory |
| `<UndoRedoToolbar>` | Undo/redo buttons with keyboard shortcut hints |
| `<ValidationPanel>` | Error/warning list with node navigation |

### 8.3 Layout Changes

The Phase 1 single-user layout adds a **sidebar** for workspace context:

```
┌──────┬──────────────────────────────────────────┐
│ Side │  Main Content                            │
│ bar  │                                          │
│      │  [Workspace Switcher]                    │
│ ─── │                                          │
│ 🏠   │  Home                                    │
│ 📋   │  Workflows                               │
│ 📦   │  Templates                               │
│ 🔌   │  Connectors                              │
│ 📊   │  Activity                                │
│ ⚙️   │  Settings                                │
└──────┴──────────────────────────────────────────┘
```

The sidebar is collapsible. On mobile, it becomes a hamburger menu.

---

## 9. Implementation Order & Milestones

### Milestone M6: Visual Builder (Week 1–3)

```
Backend:
  [ ] Extend workflow model: canvas_state (JSONB), org_id
  [ ] POST /api/workflows/{id}/validate (plan validation)
  [ ] POST /api/workflows/{id}/test-step (single step execution)
  [ ] PUT /api/workflows/{id}/canvas (save canvas state)
  [ ] Add 5 new connectors: GitHub, Discord, Jira, Stripe, Calendar
  [ ] Connector test endpoint (for "Test Step" button)

Frontend:
  [ ] Scaffold /workspace layout with sidebar
  [ ] WorkflowCanvas component (React Flow, editable)
  [ ] StepNode + ConditionNode custom node types
  [ ] StepConfigPanel with dynamic JSON Schema forms
  [ ] VariablePicker (template interpolation)
  [ ] Undo/redo Zustand store
  [ ] Auto-layout via dagre
  [ ] Validation overlay (badges on nodes, error panel)
  [ ] /workflows/[id]/edit page

Deliverable: User can open a workflow, drag steps, edit config, see validation.
```

### Milestone M7: Templates (Week 4–5)

```
Backend:
  [ ] workflow_templates table + SQLModel model
  [ ] CRUD endpoints for templates
  [ ] Template instantiation (copy plan → new workflow)
  [ ] Publish-as-template endpoint
  [ ] Featured templates endpoint
  [ ] Search + filtering
  [ ] Seed 10 templates

Frontend:
  [ ] TemplateGallery page (grid, search, filter)
  [ ] TemplateCard component
  [ ] TemplatePreview page (read-only graph + step list)
  [ ] "Use Template" flow (instantiate → open in builder)
  [ ] "Publish as Template" button in workflow settings

Deliverable: User can browse templates, preview, and instantiate with one click.
```

### Milestone M8: Team Workspaces (Week 5–7)

```
Backend:
  [ ] Organizations table + CRUD endpoints
  [ ] Organization members + roles
  [ ] Invitation system (tokens, email, expiry)
  [ ] Activity feed (events + endpoint)
  [ ] Row-level filtering by org_id on all workflow/connector queries
  [ ] Permission middleware (admin/member/viewer checks)

Frontend:
  [ ] WorkspaceSwitcher component
  [ ] Workspace home page (dashboard)
  [ ] Member management (list, invite, change role, remove)
  [ ] InviteDialog with bulk email input
  [ ] ActivityFeed component
  [ ] Workspace settings page (general + danger zone)
  [ ] Workspace switcher in sidebar
  [ ] URL routing with workspace slug
  [ ] Empty workspace onboarding (invite members, create first workflow)

Deliverable: Team can create a workspace, invite members, share workflows.
```

### Milestone M9: AI Memory (Week 7–8)

```
Backend:
  [ ] ai_memory table + CRUD endpoints
  [ ] Memory collection background job (Celery, daily)
  [ ] Memory retrieval → planner system prompt enrichment
  [ ] User correction tracking (plan diff → memory)
  [ ] Memory opt-out flag
  [ ] Embedding storage + similarity search

Frontend:
  [ ] Memory settings page (view, delete entries, opt-out)
  [ ] Memory effect visible in planner output (show "based on your history" badges)

Deliverable: Planner output improves from user history; user can see and control their memory.
```

### Milestone M10: Polish + E2E (Week 8–10)

```
Backend:
  [ ] Rate limiting on template usage
  [ ] Pagination + cursor-based for activity feed
  [ ] WebSocket push for activity events (real-time feed updates)
  [ ] Audit logging for workspace mutations

Frontend:
  [ ] Responsive canvas (mobile-friendly zoom/pan)
  [ ] Canvas keyboard shortcuts (Delete, Ctrl+Z, Ctrl+Shift+Z, Ctrl+S)
  [ ] Offline canvas recovery (sessionStorage)
  [ ] Loading skeletons (template gallery, activity feed, member list)
  [ ] Empty states (no workflows yet, no templates yet, no members yet)
  [ ] Error boundaries for canvas crashes
  [ ] Onboarding tour for new workspace members

Platform:
  [ ] End-to-end tests:
      1. Create workspace → invite member → accept → see shared workflows
      2. Open visual builder → add steps → connect → save → validate
      3. Browse templates → instantiate → customize → save
      4. Execute workflow → verify AI memory updated
  [ ] Performance: canvas render optimization (virtualization for 50+ nodes)

Deliverable: Complete Phase 2 — collaborative automation platform.
```

---

## 10. Risk Register

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| React Flow performance degrades with 50+ nodes | High | Medium | Virtualized nodes; limit max steps per workflow (soft cap at 30) |
| Template gallery becomes slow with 1000+ templates | Medium | Medium | Server-side pagination + search; cover page + prefetch next page |
| Workspace invite emails land in spam | Medium | High | Custom domain email; SPF/DKIM; "resend invite" button |
| Users create many workspaces → data fragmentation | Low | Medium | Soft cap at 10 workspaces per user; workspace merge (future) |
| AI Memory stores sensitive data from step configs | High | Medium | Explicitly strip values; only store field names + patterns; audit log |
| Circular DAG detection fails for complex graphs | Medium | Low | Topological sort at validate + save; reject on cycle detection |
| Org slug collisions | Low | Low | Slug uniqueness constraint; suggest alternatives on conflict |
| Canvas state conflicts (two users editing same workflow) | Medium | Low | No real-time collaboration in Phase 2; save warns if stale (etag-based) |

---

## 11. Testing Strategy

### 11.1 Backend

| Layer | Tool | Focus |
|---|---|---|
| Unit (builder validation) | pytest | Circular dependency detection, missing fields, type mismatches |
| Unit (templates) | pytest | Template instantiation copies plan correctly, does not mutate original |
| Unit (org permissions) | pytest | Each role correctly blocked/allowed for each endpoint |
| Unit (memory) | pytest | Memory collection aggregation, retrieval formatting |
| Integration (workspace flow) | pytest + TestClient | Full invite → accept → share workflow flow |
| Integration (canvas) | pytest + TestClient | Save and validate canvas state |
| E2E | pytest + Playwright | Full Phase 2 flows |

### 11.2 Frontend

| Layer | Tool | Focus |
|---|---|---|
| Unit (canvas store) | Vitest | Undo/redo stack, validation state, node mutations |
| Unit (components) | Vitest + RTL | StepConfigPanel renders correct fields for each connector, VariablePicker filters correctly |
| Integration (builder page) | Vitest + MSW | Add step → edit config → connect → validate → save |
| Integration (template flow) | Vitest + MSW | Browse → preview → instantiate → see in builder |
| Integration (workspace) | Vitest + MSW | Create workspace → invite → switch → see filtered workflows |
| Visual regression | Storybook + Chromatic | Canvas states (empty, with steps, with validation errors) |

### 11.3 Critical Path Test Scenarios

1. **Visual builder:** Create workflow → Visual Editor → Add trigger → Add action → Connect → Configure → Validate → Save → Execute
2. **Template flow:** Browse templates → Search by category → Preview → Instantiate → Customize in builder → Save → Execute
3. **Workspace invite:** Create workspace → Invite member by email → Logout → Login as invitee → Accept → See workspace → See shared workflow
4. **Role enforcement:** Viewer tries to edit workflow → 403 → See read-only canvas
5. **Activity feed:** Create workflow → Execute → Delete → Activity feed shows all three events
6. **AI Memory:** Create same-pattern workflow 3 times with edits → Fourth attempt shows planner referencing history
7. **Memory opt-out:** Disable memory → Daily job skips user → Memory page shows empty
8. **Canvas undo:** Add 3 steps → Undo twice → Steps correctly removed → Redo → Steps restored

---

## 12. Non-Goals (Phase 2)

- Real-time collaborative editing (Google Docs-style) → Phase 3
- Marketplace for community templates → Phase 3
- Self-healing workflows (auto-retry with different approach) → Phase 3
- Scheduled/cron triggers → Phase 3
- Enterprise SSO (SAML/OIDC) → Phase 3
- Audit logging for compliance (SOC2) → Phase 3
- Workflow versioning (rollback to previous version) → Phase 3
- Drag-and-drop from connector palette (adding steps via drag) → Phase 3 polish
- Template categories with subcategories → Phase 3
- Multi-region deployment → Phase 3
- Performance optimization for 500+ node workflows → Future

---

## 13. Success Metrics

| Metric | Target (Phase 2) | Measurement |
|---|---|---|
| Visual builder adoption | >60% of workflows edited in canvas | Workflows with canvas edits / total workflows |
| Template instantiation rate | >30% of new workflows from templates | workflows_from_template / total_new_workflows |
| Template satisfaction | >4/5 rating on seeded templates | User rating (future) or repeat usage rate |
| Workspace creation rate | >40% of users belong to 2+ workspaces | Active members in 2+ orgs / total users |
| Workspace collaboration | >50% of workspaces have 2+ active members | Workspaces with 2+ active editors / total workspaces |
| AI Memory planner improvement | >15% reduction in user edits post-memory | Edits per plan pre-memory vs. post-memory for same user |
| Memory opt-out rate | <10% | Users with memory disabled / total users |
| Canvas load time (50 nodes) | <3 seconds | Lighthouse / custom perf trace |
| Template search result accuracy | >80% top-5 relevance | User clicks on result / total searches |

---

## 14. Database Migrations

### 14.1 Phase 1 → Phase 2 Migration

```sql
-- Add org_id to existing workflows (requires backfill)
ALTER TABLE workflows ADD COLUMN org_id UUID REFERENCES organizations(id);
-- Create a personal org for each existing user
INSERT INTO organizations (id, name, slug, created_at, updated_at)
    SELECT gen_random_uuid(), 'Personal', 'personal-' || u.id, NOW(), NOW()
    FROM users u;
INSERT INTO organization_members (id, org_id, user_id, role, joined_at)
    SELECT gen_random_uuid(), o.id, u.id, 'admin', NOW()
    FROM users u JOIN organizations o ON o.slug = 'personal-' || u.id;
UPDATE workflows SET org_id = (
    SELECT om.org_id FROM organization_members om WHERE om.user_id = workflows.user_id
);
ALTER TABLE workflows ALTER COLUMN org_id SET NOT NULL;

-- Create indexes
CREATE INDEX idx_workflows_org_id ON workflows(org_id);
CREATE INDEX idx_activity_org_id_created ON activity_events(org_id, created_at DESC);
CREATE INDEX idx_templates_category ON workflow_templates(category);
CREATE INDEX idx_templates_connectors ON workflow_templates USING GIN(connector_keys);
CREATE INDEX idx_memory_user_org ON ai_memory(user_id, org_id);
```

### 14.2 Alembic Migration Strategy

Each milestone creates a separate Alembic revision:

| Migration | Tables Added | Tables Modified |
|---|---|---|
| `M6_visual_builder` | — | workflows (+org_id, +canvas_state) |
| `M7_templates` | workflow_templates | — |
| `M8_workspaces` | organizations, organization_members, org_invitations, activity_events | workflows (+org_id FK, backfill) |
| `M9_memory` | ai_memory | — |

---

## 15. Environments & DevOps

### 15.1 Docker Compose Changes

Phase 2 adds no new services to the stack. The existing Phase 1 stack (api, web, postgres, redis, celery worker) is sufficient.

### 15.2 Environment Variables

No new environment variables for Phase 2. The existing `DATABASE_URL`, `REDIS_URL`, `OPENAI_API_KEY` cover all Phase 2 features.

### 15.3 CI/CD

Add Phase 2 test suites to existing CI:
- `pytest tests/phase2/visual_builder/`
- `pytest tests/phase2/templates/`
- `pytest tests/phase2/workspaces/`
- `pytest tests/phase2/memory/`

---

## 16. Files to Create (Summary)

### Backend (`apps/api/src/`)

| File | Purpose |
|---|---|
| `routers/templates.py` | Template CRUD + instantiation endpoints |
| `routers/workspaces.py` | Organization CRUD + members + invitations |
| `routers/activity.py` | Activity feed endpoint |
| `routers/memory.py` | AI Memory CRUD + settings |
| `routers/builder.py` | Canvas validation + test-step endpoints |
| `services/builder_validator.py` | DAG validation logic (cycles, orphans, types) |
| `services/memory_collector.py` | Background job for memory aggregation |
| `services/memory_retriever.py` | Memory → planner context builder |
| `connectors/github.py` | GitHub connector implementation |
| `connectors/discord.py` | Discord connector implementation |
| `connectors/jira.py` | Jira connector implementation |
| `connectors/stripe.py` | Stripe connector implementation |
| `connectors/calendar.py` | Google Calendar connector implementation |
| `tasks/memory.py` | Celery task for daily memory refresh |
| `models/template.py` | WorkflowTemplate SQLModel |
| `models/organization.py` | Organization + Member + Invitation SQLModels |
| `models/activity.py` | ActivityEvent SQLModel |
| `models/memory.py` | AIMemory SQLModel |

### Frontend (`apps/web/src/`)

| File | Purpose |
|---|---|
| `app/workspace/[slug]/page.tsx` | Workspace home |
| `app/workspace/[slug]/workflows/page.tsx` | Workflow list (scoped) |
| `app/workspace/[slug]/workflows/new/page.tsx` | New workflow in workspace |
| `app/workspace/[slug]/workflows/[id]/edit/page.tsx` | Visual builder |
| `app/workspace/[slug]/templates/page.tsx` | Template gallery |
| `app/workspace/[slug]/templates/[id]/page.tsx` | Template preview |
| `app/workspace/[slug]/settings/page.tsx` | Workspace settings |
| `app/workspace/[slug]/activity/page.tsx` | Activity feed |
| `app/settings/workspaces/page.tsx` | Workspace manager |
| `app/settings/memory/page.tsx` | AI Memory settings |
| `components/canvas/workflow-canvas.tsx` | React Flow canvas |
| `components/canvas/step-node.tsx` | Custom action/trigger node |
| `components/canvas/condition-node.tsx` | Diamond condition node |
| `components/canvas/step-config-panel.tsx` | Right side panel |
| `components/canvas/variable-picker.tsx` | Template variable selector |
| `components/canvas/connector-picker.tsx` | Connector + operation selector |
| `components/canvas/validation-panel.tsx` | Error/warning list |
| `components/canvas/undo-redo-toolbar.tsx` | Undo/redo controls |
| `components/templates/template-card.tsx` | Card component |
| `components/templates/template-gallery.tsx` | Grid with search/filter |
| `components/templates/template-preview.tsx` | Read-only plan view |
| `components/workspace/workspace-switcher.tsx` | Sidebar dropdown |
| `components/workspace/member-list.tsx` | Member management table |
| `components/workspace/invite-dialog.tsx` | Invite modal |
| `components/workspace/activity-feed.tsx` | Activity event list |
| `components/memory/memory-summary.tsx` | Memory display |
| `components/layout/sidebar.tsx` | App sidebar with nav |
| `stores/canvas-store.ts` | Zustand store for canvas state |
| `stores/workspace-store.ts` | Zustand store for active org |

---

## 17. Appendix

### 17.1 Phase 2 vs Phase 1 Feature Matrix

| Feature | Phase 1 | Phase 2 |
|---|---|---|
| Natural language prompt → plan | ✅ | ✅ (enhanced with memory) |
| Email/password + Google OAuth | ✅ | ✅ |
| OAuth connector connections | ✅ (5 connectors) | ✅ (+5 new connectors) |
| Workflow execution | ✅ | ✅ |
| Approval mode | ✅ | ✅ |
| Real-time execution logs | ✅ | ✅ |
| **Visual drag-drop builder** | ❌ | ✅ |
| **Workflow templates** | ❌ | ✅ |
| **Team workspaces** | ❌ | ✅ |
| **AI Memory** | ❌ (basic key-value) | ✅ (full embedding + pattern learning) |
| **Canvas validation** | ❌ | ✅ |
| **Activity feed** | ❌ | ✅ |
| **Sidebar layout** | ❌ | ✅ |
| **Test step** | ❌ | ✅ |

### 17.2 Glossary

| Term | Definition |
|---|---|
| **Canvas** | The React Flow-based drag-and-drop editor for building workflows visually |
| **Template** | A pre-built workflow plan that can be instantiated with one click |
| **Workspace** | An organization-level container for workflows, connectors, and members |
| **Side panel** | The right-side configuration panel in the visual builder |
| **Memory** | AI-stored user preferences and patterns that improve planner output |
| **Activity feed** | Chronological list of events within a workspace |
| **Node** | A visual element in the canvas (trigger, action, condition, etc.) |
| **Edge** | A connection between two nodes representing data flow |
| **Branch** | A conditional path in the workflow (true/false) |
| **DAG** | Directed Acyclic Graph — the structure of a workflow (no cycles allowed) |
