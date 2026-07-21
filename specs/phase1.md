# Phase 1 — Core Platform Foundation

> **Goal:** Deliver a working end-to-end platform where a user can authenticate, describe a workflow in natural language, see the AI-generated plan, approve it, and execute it against real connectors.
>
> **Duration Target:** 6–8 weeks
>
> **Definition of Done:** A user can log in, type "When I get an email from Gmail with an invoice PDF, save it to Google Drive and notify me on Slack", review the AI plan, approve, and see it execute successfully with logs.

---

## 1. Strategic Decisions



### 1.2 Library & Tool Decisions

| Concern | Choice | Rationale |
|---|---|---|
| Frontend framework | Next.js 16 + React 19 (App Router) | Per README; best-in-class DX |
| Backend framework | FastAPI (Python 3.13) | Per README; async-native |
| API contract | OpenAPI 3.1 (auto-generated from FastAPI + pydantic) | Single source of truth; TypeScript SDK gen |
| Auth (web) | Clerk (Next.js) | Per README; managed auth with OAuth, MFA, sessions |
| Auth (API) | Clerk JWT Validation (python-jose) | Stateless; validates Clerk-issued JWTs via JWKS |
| Database | PostgreSQL (Neon) + SQLModel + Alembic | Per README; SQLModel = SQLAlchemy + Pydantic |
| Async queue | Celery + Redis | Per README; workflow execution must be decoupled |
| Scheduler | APScheduler | Per README; for watch/cron-style triggers |
| AI | OpenAI Responses API + Structured Outputs | Per README; function calling for planner |
| HTTP client | HTTPX | Per README; async-first |
| Logging | Loguru | Per README |
| Validation | Zod (frontend) + Pydantic v2 (backend) | Per README; shared contract via OpenAPI |
| State (frontend) | TanStack Query (server state) + Zustand (client state) | Per README |
| Forms | React Hook Form + Zod | Per README |
| UI | shadcn/ui + Radix UI + TailwindCSS v4 | Per README |
| Workflow graph | React Flow | Per README |

### 1.3 MVP Connector Set (Phase 1)

Shipping every connector from the README is out of scope. Select **5 high-impact connectors** that cover the major categories and demonstrate the architecture:

| Connector | Category | Priority Rationale |
|---|---|---|
| Gmail | Productivity | Email is the #1 trigger source |
| Slack | Communication | Notification is the #1 action |
| Google Drive | Productivity | File storage is a common action |
| Google Sheets | Productivity | Structured data is universally needed |
| Notion | Project Management | Demonstrates CRM/wiki integration |

Each connector implements a **uniform interface** (see §3) so adding more in Phase 2+ is mechanical.

### 1.4 Interaction Flow

```
User (Web UI)
  │
  ▼
[1] Describe workflow in natural language
  │
  ▼
[2] AI Planner → Structured Workflow Plan
  │   (trigger + actions + conditions + dependencies)
  │
  ▼
[3] Approval Screen (React Flow graph)
  │   - Visual DAG of steps
  │   - Connected apps + permissions shown
  │   - Edit / Regenerate / Approve
  │
  ▼
[4] Workflow Engine executes DAG
  │   - Sequential & parallel steps
  │   - Retry on failure (configurable)
  │   - Real-time log streaming via WebSocket
  │
  ▼
[5] Execution History & Logs
```

### 1.5 Key Architectural Principles

- **Stateless API servers** — scale horizontally; session state in Redis/DB.
- **Async everywhere** — FastAPI handlers are async; Celery workers for heavy lifting.
- **Planner as a service** — the planner is an independent service that accepts a prompt and returns a structured plan. Swappable (OpenAI today, any LLM tomorrow).
- **Connector abstraction** — every connector implements `Trigger`, `Action`, `auth_scheme`, `execute()`. The executor never knows connector internals.
- **Fail-safe execution** — every step has a max retry count; after N failures the workflow enters `failed` state and the user is notified.
- **Audit trail** — every mutation is logged; workflow runs are immutable records.

---

## 2. Data Model (Phase 1)

### 2.1 Database Tables

```sql
-- Users & Organizations
users: id, email, name, avatar_url, created_at, updated_at
organizations: id, name, slug, created_at
organization_members: id, org_id, user_id, role (admin/member), created_at

-- Authentication (managed by Clerk)

-- Connectors
connector_definitions: id, key (e.g. "gmail"), name, description, auth_type
   (oauth2/api_key), icon_url, is_active
oauth_tokens: id, user_id, connector_id, access_token, refresh_token,
   token_type, expires_at, scopes, created_at, updated_at

-- Workflows
workflows: id, org_id, user_id, name, description, natural_language_prompt,
   raw_plan (JSON — planner output), status (draft/active/paused/archived),
   approval_required (bool), created_at, updated_at

workflow_steps: id, workflow_id, step_order, step_type (trigger/action/condition),
   connector_key, operation, config (JSON — connector-specific params),
   depends_on (JSON — array of step_ids), retry_count, max_retries,
   input_mapping (JSON), output_mapping (JSON), status

-- Execution
workflow_runs: id, workflow_id, triggered_by (user/webhook/schedule),
   status (pending/approved/running/completed/failed/cancelled),
   started_at, completed_at, error_message

execution_logs: id, workflow_run_id, step_id, level (info/warn/error),
   message, metadata (JSON), timestamp
   -- indexed by (workflow_run_id, timestamp)

-- Approvals
approvals: id, workflow_run_id, requested_by, approved_by,
   status (pending/approved/rejected), requested_at, decided_at

-- AI Memory (Phase 1 — basic)
ai_memory: id, user_id, key, value (JSON), created_at, updated_at
   -- stores user preferences, frequent connectors, past patterns
```

### 2.2 Pydantic / SQLModel Models

Every table maps 1:1 to a SQLModel class in `apps/api/src/models/`. Reuse these models as Pydantic schemas for request/response validation.

---

## 3. Connector Architecture

### 3.1 Abstract Interface

```python
class BaseConnector(ABC):
    key: str                       # unique identifier
    name: str
    auth_type: AuthType            # oauth2 | api_key | none
    triggers: list[TriggerDef]
    actions: list[ActionDef]

    @abstractmethod
    async def authenticate(self, credentials: dict) -> AuthContext: ...
    @abstractmethod
    async def execute_action(self, action: str, config: dict, auth: AuthContext) -> ActionResult: ...
    @abstractmethod
    async def execute_trigger(self, trigger: str, config: dict, auth: AuthContext) -> TriggerResult: ...
```

### 3.2 Trigger & Action Definitions

```python
class TriggerDef(BaseModel):
    key: str                                # e.g. "new_email"
    label: str                              # "New Email"
    description: str
    input_schema: dict                      # JSON Schema for trigger config
    output_schema: dict                     # JSON Schema for trigger output
    polling_interval: int | None = None     # seconds; None = webhook

class ActionDef(BaseModel):
    key: str                                # e.g. "send_message"
    label: str                              # "Send Message"
    description: str
    input_schema: dict                      # JSON Schema for action params
    output_schema: dict                     # JSON Schema for action output
```

### 3.3 Connector Registration

Connectors register themselves via a **plugin system** (`packages/connectors/`). The backend scans `packages/connectors/` at startup and loads all registered connectors into a registry. The AI Planner receives the registry as tool definitions so it knows available capabilities.

### 3.4 OAuth Flow

1. User clicks "Connect Gmail" in frontend
2. Frontend calls `POST /api/connectors/{key}/auth/start`
3. Backend returns an OAuth URL (or API key prompt)
4. User completes OAuth in browser; callback hits `GET /api/connectors/{key}/auth/callback`
5. Backend stores tokens in `oauth_tokens` table (encrypted at rest)
6. Connector is now "connected" for that user

### 3.5 MVP Connector Implementation Notes

| Connector | Auth | Triggers | Actions |
|---|---|---|---|
| Gmail | OAuth 2.0 (Gmail API) | `new_email` (polling) | `send_email`, `search_emails`, `download_attachment` |
| Slack | OAuth 2.0 (Slack API) | `new_message` (webhook via Events API) | `send_message`, `create_channel`, `upload_file` |
| Google Drive | OAuth 2.0 (Drive API) | `new_file` (polling) | `upload_file`, `create_folder`, `search_files` |
| Google Sheets | OAuth 2.0 (Sheets API) | `new_row` (polling) | `append_row`, `update_cell`, `get_sheet_data` |
| Notion | OAuth 2.0 (Internal Integration) | `new_page` (polling) | `create_page`, `update_page`, `append_block` |

---

## 4. AI Planner Service

### 4.1 Architecture

```
User prompt
  │
  ▼
Planner Service (services/planner/)
  │
  ├── Step 1: Call OpenAI with structured output
  │   - System prompt describes available connectors + their triggers/actions
  │   - Tools = function definitions for each action/trigger
  │   - Response is a validated WorkflowPlan (Pydantic)
  │
  ├── Step 2: Validate plan against connector registry
  │   - Check all referenced connectors exist
  │   - Check all referenced operations exist
  │   - Check input schemas are satisfied
  │   - If invalid → call openai again with validation errors for self-healing
  │   - If still invalid after 3 retries → return error to user
  │
  ├── Step 3: Enrich plan with metadata
  │   - Add human-readable labels to each step
  │   - Identify data dependencies (step outputs used as step inputs)
  │   - Compute topological order (DAG)
  │
  └── Step 4: Return structured WorkflowPlan
```

### 4.2 WorkflowPlan Schema (Pydantic)

```python
class WorkflowPlan(BaseModel):
    summary: str                           # "When a new email arrives with a PDF attachment..."
    trigger: StepDef
    steps: list[StepDef]
    dependencies: dict[str, list[str]]     # step_id -> [depends_on_step_ids]
    warnings: list[str]                    # Edge cases the user should know

class StepDef(BaseModel):
    id: str                                # uuid
    type: Literal["trigger", "action", "condition"]
    label: str                             # Human-readable
    connector_key: str
    operation: str                         # e.g. "send_email"
    config: dict                           # Connector-specific parameters
    input_mapping: dict[str, str]          # template references: {{step_1.output.field}}
    conditions: list[ConditionDef] | None  # Conditional branching

class ConditionDef(BaseModel):
    field: str                             # e.g. "email.subject"
    operator: Literal["contains", "equals", "gt", "lt", "exists", "regex"]
    value: Any
```

### 4.3 OpenAI Integration

- **Model:** `gpt-4o` (latest as of July 2026)
- **Response format:** Structured Outputs with Pydantic schema
- **Tool definitions:** Auto-generated from connector registry — each trigger and action becomes a function tool
- **System prompt includes:**
  - Platform context (what WorkOS AI is)
  - Connector registry (available connectors, triggers, actions with schemas)
  - Examples of good workflow plans
  - Instructions for handling ambiguity (ask for clarification)
- **User prompt:** The raw natural language input + any connected connector context
- **Max retries:** 3 for validation failures; 2 for malformed responses

### 4.4 Clarification Flow

If the user's prompt is ambiguous (e.g., "notify me" without specifying where), the AI Planner should:

1. Return a `clarification_required` response with specific questions
2. Frontend shows a clarification dialog
3. User answers; planner re-runs with additional context

```python
class PlannerResponse(BaseModel):
    type: Literal["plan", "clarification_required", "error"]
    plan: WorkflowPlan | None = None
    questions: list[str] | None = None      # Clarification questions
    error: str | None = None
```

### 4.5 AI Memory Integration (Basic)

Before planning, the service loads `ai_memory` for the user:
- Recently used connectors → boost in system prompt
- Previously approved workflow patterns → few-shot examples
- User's preferred notification channel

After execution, AI memory is updated with the new pattern.

---

## 5. Workflow Execution Engine

### 5.1 Architecture

```
API Server                          Worker (Celery)
    │                                     │
    ▼                                     ▼
POST /api/workflows/{id}/execute    workflow_execution_task()
    │                                     │
    ├─ Create workflow_run (pending)      ├─ Create workflow_run (running)
    ├─ If approval_required →              ├─ Walk DAG in topological order
    │   Set status = pending_approval      ├─ For each ready step:
    │   Return approval request              │   ├─ Resolve input_mapping
    └─ Else → enqueue Celery task           │   ├─ Load connector handler
                                            │   ├─ Execute (with retry)
                                            │   ├─ Log step result
                                            │   └─ Mark dependencies satisfied
                                            ├─ On completion → status = completed
                                            ├─ On failure (max retries) → status = failed
                                            └─ Stream logs via Redis pub/sub → WebSocket
```

### 5.2 DAG Execution Algorithm

```python
async def execute_dag(run: WorkflowRun, plan: WorkflowPlan):
    steps = {s.id: s for s in plan.steps}
    completed = set()
    failed = set()

    # Build adjacency: step_id -> [dependent_step_ids]
    # Reverse of dependencies

    while len(completed) < len(steps):
        # Find all steps whose dependencies are met
        ready = [
            s for s in plan.steps
            if s.id not in completed
            and s.id not in failed
            and all(dep in completed for dep in plan.dependencies.get(s.id, []))
        ]

        if not ready and len(completed) + len(failed) < len(steps):
            # Circular dependency or stalled
            raise WorkflowStalledError(...)

        # Execute ready steps in parallel (asyncio.gather)
        results = await asyncio.gather(
            *[execute_step(run, s, completed) for s in ready],
            return_exceptions=True
        )

        for step, result in zip(ready, results):
            if isinstance(result, Exception):
                failed.add(step.id)
                await log_error(run, step, result)
            else:
                completed.add(step.id)
```

### 5.3 Step Execution Flow

```
execute_step(run, step, completed_steps)
  │
  ├── Load connector: registry.get(step.connector_key)
  ├── Load auth: oauth_tokens for user + connector
  ├── Resolve input_mapping: substitute {{step_X.output.field}} with actual values
  ├── Validate input against action schema
  ├── Execute with retry:
  │     for attempt in 1..max_retries:
  │         try: result = await connector.execute_action(...)
  │         except (RateLimitError, NetworkError):
  │             wait exponential_backoff(attempt)
  │             continue
  │         except PermanentError: raise
  │         break
  ├── Log success/failure to execution_logs
  ├── Publish log message to Redis pub/sub channel for this run
  └── Return result (or raise)
```

### 5.4 Retry Policy

| Error Type | Retry? | Backoff |
|---|---|---|
| RateLimitError | Yes (up to 3) | Exponential: 5s, 25s, 125s |
| NetworkError | Yes (up to 3) | Exponential: 5s, 25s, 125s |
| AuthError (401) | No | — |
| ValidationError | No | — |
| PermanentError (500) | Yes (up to 2) | Linear: 10s, 20s |

### 5.5 Real-Time Log Streaming

```
Celery Worker                    Redis                     API Server                 Web UI
    │                             │                          │                        │
    ├── execute_step(...)         │                          │                        │
    ├── log: "Sending Slack msg"  │                          │                        │
    ├── publish to                │                          │                        │
    │   channel:run:{run_id} ────►│                          │                        │
    │                             ├── SUBSCRIBE ────────────►│                        │
    │                             │                          ├── WebSocket: ─────────►│
    │                             │                          │   {type:"log",...}     │
    │                             │                          │                        │
    │                             │                          │                        │
    ├── log: "Slack msg sent" ────►──────────────────────────►├── WebSocket: ─────────►│
    │                             │                          │                        │
    ├── step completed ──────────►──────────────────────────►├── WebSocket: ─────────►│
    │                             │                          │   {type:"step_done",..}│
```

---

## 6. Approval Mode

### 6.1 Flow

1. User describes workflow → AI generates plan
2. Frontend displays **approval screen**:
   - React Flow graph showing trigger → steps → conditions
   - Side panel showing connected apps (which OAuth tokens will be used)
   - Warning section if the plan has potential issues
   - "Edit Prompt" / "Regenerate" / "Approve" / "Reject" buttons
3. User clicks "Approve"
4. `POST /api/workflows/{id}/approve` (checks user has permission)
5. Workflow run transitions to `approved` → enqueues execution
6. If "Reject" → `POST /api/workflows/{id}/reject` with optional reason
7. If "Edit Prompt" → returns to prompt input with previous prompt pre-filled

### 6.2 API Endpoints

```http
POST   /api/workflows/{id}/approve
       Body: { comment?: string }
       200: { status: "approved", run_id: "..." }

POST   /api/workflows/{id}/reject
       Body: { reason?: string }
       200: { status: "rejected" }
```

### 6.3 Approval Data Model

```python
class Approval(BaseModel):
    id: UUID
    workflow_id: UUID
    workflow_run_id: UUID
    requested_by: UUID          # user_id
    approved_by: UUID | None    # user_id who decided
    status: ApprovalStatus      # pending | approved | rejected
    comment: str | None
    requested_at: datetime
    decided_at: datetime | None
```

---

## 7. API Design (Phase 1)

### 7.1 Authentication

Authentication is handled by **Clerk**. The frontend uses `<SignIn />`, `<SignUp />`, and `auth()` from `@clerk/nextjs`. The backend validates Clerk-issued JWTs via the JWKS endpoint.

```http
# Clerk handles:
# - Sign-in / Sign-up (managed UI components)
# - Session management
# - OAuth providers (Google, GitHub, etc.)
# - MFA

# Backend validates Clerk JWTs on every protected API call:
GET    /api/auth/me                # Validates Clerk JWT → returns current user profile
```

### 7.2 Connector Endpoints

```http
GET    /api/connectors             # List all available connectors
GET    /api/connectors/{key}       # Get connector details + triggers + actions
POST   /api/connectors/{key}/auth/start    # Initiate OAuth → { url }
GET    /api/connectors/{key}/auth/callback # OAuth callback → redirect to UI
DELETE /api/connectors/{key}/auth          # Disconnect connector
GET    /api/connectors/connected           # List user's connected connectors
```

### 7.3 Workflow Endpoints

```http
POST   /api/workflows              # Create workflow from prompt
       # Body: { prompt: string }
       # Returns: { workflow_id, plan, approval_required }

GET    /api/workflows              # List user's workflows (paginated)
GET    /api/workflows/{id}         # Get workflow details + plan
PUT    /api/workflows/{id}         # Update name, description, approval_required
DELETE /api/workflows/{id}         # Soft-delete workflow

POST   /api/workflows/{id}/execute
       # Returns: { run_id, status: "pending"|"pending_approval" }
       # If approval_required → status = "pending_approval"
       # Else → enqueues execution immediately

POST   /api/workflows/{id}/approve # Approve execution
POST   /api/workflows/{id}/reject  # Reject execution
```

### 7.4 Execution Endpoints

```http
GET    /api/workflow-runs          # List runs (paginated, filterable)
GET    /api/workflow-runs/{id}     # Get run details + step statuses
GET    /api/workflow-runs/{id}/logs# Get execution logs (paginated)

WebSocket /api/ws/workflow-runs/{id}
       # Real-time log streaming
       # Messages: { type: "log"|"step_start"|"step_done"|"run_complete"|"run_failed", data: {...} }
```

### 7.5 Planner Endpoints

```http
POST   /api/planner/generate       # Generate plan from prompt
       # Body: { prompt: string, workflow_id?: UUID }
       # Returns: PlannerResponse (plan | clarification_required | error)

POST   /api/planner/refine         # Refine plan with user clarification
       # Body: { workflow_id: UUID, answers: dict }
       # Returns: PlannerResponse
```

---

## 8. Frontend Pages & Components (Phase 1)

### 8.1 Pages

| Path | Page | Description |
|---|---|---|
| `/` | Landing | Hero + sign-up CTA (simple, redirects to dashboard if authenticated) |
| `/sign-in` | Login | Clerk-managed sign-in (email/password + OAuth) |
| `/register` | Register | Clerk-managed sign-up (email/password + OAuth) |
| `/dashboard` | Dashboard | Workflow list + "Create Workflow" button + connected connectors |
| `/workflows/new` | New Workflow | Prompt input + AI planner preview |
| `/workflows/[id]/approve` | Approval | React Flow graph + approve/reject |
| `/workflows/[id]` | Workflow Detail | Plan view, settings, history |
| `/workflows/[id]/runs/[runId]` | Run Detail | Real-time logs, step-by-step status |
| `/settings/connectors` | Connectors | Connect/disconnect OAuth connectors |

### 8.2 Key Components

| Component | Location | Description |
|---|---|---|
| `PromptInput` | `/workflows/new` | Textarea with submit; sends prompt to planner |
| `WorkflowGraph` | Shared | React Flow DAG visualization (reused in approval + detail) |
| `StepNode` | Shared | Custom React Flow node showing connector icon + operation |
| `ApprovalPanel` | `/workflows/[id]/approve` | Side panel with approve/reject + warnings |
| `LogStream` | `/workflows/[id]/runs/[runId]` | Real-time log viewer (terminal-style) |
| `ConnectorCard` | `/settings/connectors` | Connector status + connect/disconnect button |
| `WorkflowCard` | `/dashboard` | Workflow summary card (status, last run) |

---

## 9. Implementation Order & Milestones

### Milestone M1: Foundation (Week 1–2)

```
Backend:
  [ ] Scaffold FastAPI project (apps/api/)
  [ ] Set up Poetry/pyproject.toml, alembic, SQLModel base
  [ ] Set up PostgreSQL schema (users, organizations)
  [ ] Implement Clerk JWT validation middleware (JWKS verification)
  [ ] Docker Compose: api + postgres + redis

Frontend:
  [ ] Scaffold login/register pages
  [ ] Clerk integration (@clerk/nextjs)
  [ ] Auth state management (ClerkProvider + useUser)
  [ ] Protected route layout (proxy.ts with clerkMiddleware)
  [ ] Docker Compose: web

Deliverable: User can register, log in, and see a blank dashboard.
```

### Milestone M2: Connectors (Week 3–4)

```
Backend:
  [ ] Connector registry + base classes
  [ ] OAuth infrastructure (start, callback, token storage)
  [ ] Gmail connector (new_email trigger, send_email action)
  [ ] Slack connector (send_message action)
  [ ] Google Drive connector (upload_file action)
  [ ] Google Sheets connector (append_row action)
  [ ] Notion connector (create_page action)
  [ ] GET /api/connectors endpoints

Frontend:
  [ ] Connector settings page (connect/disconnect)
  [ ] OAuth callback handler
  [ ] Connected connector indicators

Deliverable: User can connect Gmail and Slack, see them in settings.
```

### Milestone M3: AI Planner (Week 4–5)

```
Backend:
  [ ] Planner service scaffold (services/planner/)
  [ ] OpenAI integration with Structured Outputs
  [ ] Tool definition generation from connector registry
  [ ] WorkflowPlan validation (schema checks, connector existence)
  [ ] Self-healing loop (retry with validation errors)
  [ ] Clarification flow (ambiguity detection)
  [ ] POST /api/planner/generate + /refine

Frontend:
  [ ] PromptInput component
  [ ] Plan preview (WorkflowGraph read-only)
  [ ] Clarification dialog
  [ ] Loading/error states

Deliverable: User can type a prompt and see a structured workflow plan.
```

### Milestone M4: Workflow Execution (Week 5–7)

```
Backend:
  [ ] WORKFLOW RUN DATABASE LAYER
  [ ] Workflow engine (DAG executor) in services/executor/
  [ ] Celery worker setup + Redis queue
  [ ] Step execution with connector resolution
  [ ] Input mapping resolution ({{step_X.output.field}})
  [ ] Retry logic + exponential backoff
  [ ] Real-time log streaming (Redis pub/sub → WebSocket)
  [ ] POST /api/workflows + GET /api/workflows + execute
  [ ] WebSocket endpoint for log streaming

Frontend:
  [ ] Workflow creation flow (prompt → plan → name → save)
  [ ] Workflow list on dashboard
  [ ] Workflow detail page
  [ ] Run detail page with real-time LogStream
  [ ] WebSocket client hook (useWorkflowRun)

Deliverable: User can type a prompt, see the plan, save it, execute it, and watch logs in real-time.
```

### Milestone M5: Approval Mode + Polish (Week 7–8)

```
Backend:
  [ ] Approval data model + endpoints
  [ ] approval_required flag on workflow
  [ ] Approval gate in execution flow
  [ ] AI memory basic (store/retrieve user preferences)

Frontend:
  [ ] Approval screen with WorkflowGraph (interactive)
  [ ] Approve/Reject buttons + confirmation
  [ ] Warning display (edge cases from planner)
  [ ] Edit Prompt → regenerate flow
  [ ] Workflow history view

Platform:
  [ ] End-to-end test: auth → connect → prompt → approve → execute → logs
  [ ] Error handling polish
  [ ] Loading/empty/error states across all pages
  [ ] Responsive layout (mobile-friendly for approval/log viewing)

Deliverable: Complete Phase 1 — user can run through the entire flow.
```

---

## 10. Risk Register

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| OpenAI API changes / rate limits | High | Medium | Response caching; fallback model; queue planner requests |
| OAuth token expiry mid-execution | High | High | Refresh-before-execute; retry with refreshed token; fail with clear message |
| Connector API rate limits | Medium | High | Per-connector rate limiter; exponential backoff; user-facing rate limit warnings |
| Ambiguous user prompts produce bad plans | Medium | High | Clarification loop; self-healing validation; "Edit Prompt" button |
| Long-running workflows hit timeout | Medium | Medium | Streaming logs; configurable timeout; status updates every 30s |
| WebSocket connection drops | Low | Medium | Reconnect logic with exponential backoff; full log recovery via REST |
| Database migration issues | Low | Low | Alembic auto-generation; staging DB for testing; rollback script |

---

## 11. Testing Strategy (Phase 1)

### 11.1 Backend

| Layer | Tool | Focus |
|---|---|---|
| Unit (models, validators) | pytest | Pydantic schemas, SQLModel models, helpers |
| Unit (connectors) | pytest + responses (HTTPX mock) | Each connector action with mocked API responses |
| Integration (API) | pytest + TestClient (FastAPI) | All auth, connector, workflow endpoints |
| Integration (planner) | pytest | Planner with mocked OpenAI responses |
| Integration (executor) | pytest + Celery task runner | DAG execution with mocked connectors |
| E2E | pytest + Playwright | Full flow: register → connect → prompt → execute |

### 11.2 Frontend

| Layer | Tool | Focus |
|---|---|---|
| Unit (components) | Vitest + React Testing Library | Individual component rendering + behavior |
| Integration (pages) | Vitest + MSW (mock API) | Page-level interactions, form submissions |
| E2E | Playwright (if time) | Full UI flow |

### 11.3 Critical Path Test Scenarios

1. **Auth flow:** Register → Login → View dashboard → Logout → Cannot access dashboard
2. **Connector connect:** Settings → Connect Gmail → OAuth page → Authorize → See connected
3. **Workflow create:** Dashboard → "New Workflow" → Type prompt → See valid plan
4. **Workflow execute:** Create → Execute → See logs streaming → See "Completed" status
5. **Approval flow:** Create with approval → See approval screen → Approve → See execution → See logs
6. **Error handling:** Create workflow with invalid connector → See error state → Retry

---

## 12. Non-Goals (Phase 1)

- Visual workflow builder (drag & drop UI to edit steps) → Phase 2
- Workflow templates → Phase 2
- Team workspaces → Phase 2
- AI memory (full) → Phase 2
- Scheduled/cron triggers → Phase 3
- Marketplace / community templates → Phase 3
- Enterprise RBAC → Phase 3
- Self-healing workflows → Phase 3
- Multi-tenant isolation beyond org-level → Phase 3
- Performance optimization beyond "it works" → Ongoing

---

## 13. Success Metrics

| Metric | Target (Phase 1) | Measurement |
|---|---|---|
| Workflow creation success rate | >90% of prompts produce a valid plan | Planner endpoint success/error ratio |
| Workflow execution success rate | >80% of runs complete without error | Runs with status=completed / total runs |
| Average execution latency (3-step workflow) | <30 seconds | Execution duration from `workflow_runs` |
| Approval-to-execution time | <5 seconds | Time from approval → Celery enqueue |
| Connector connection success rate | >95% | OAuth flows completed / started |
| User satisfaction | >4/5 in internal testing | User survey after Phase 1 demo |

---

## 14. Environment & DevOps (Phase 1)

| Environment | Purpose | Setup |
|---|---|---|
| `local` | Development | Docker Compose (api, web, postgres, redis, celery worker) |
| `staging` | Integration testing | Deployed to Vercel (web) + Railway/Render (api) |
| `production` | Live demo | Same as staging + Cloudflare R2 for file storage |

**CI/CD (`.github/workflows/`):**
- `ci.yml`: Run lint + typecheck + tests on PR
- `deploy.yml`: Deploy to staging on merge to `main`

---

## 15. Files to Create (Summary)

| File | Purpose |
|---|---|
| `apps/api/pyproject.toml` | Python project config |
| `apps/api/alembic.ini` | Migration config |
| `apps/api/src/main.py` | FastAPI app entrypoint |
| `apps/api/src/config.py` | Environment config (pydantic-settings) |
| `apps/api/src/database.py` | SQLModel engine + session |
| `apps/api/src/models/*.py` | SQLModel models (one per table group) |
| `apps/api/src/routers/auth.py` | Clerk JWT validation + user profile endpoint |
| `apps/api/src/routers/connectors.py` | Connector endpoints |
| `apps/api/src/routers/workflows.py` | Workflow + execution endpoints |
| `apps/api/src/routers/planner.py` | Planner endpoints |
| `apps/api/src/services/planner.py` | AI planner logic |
| `apps/api/src/services/executor.py` | DAG executor logic |
| `apps/api/src/middleware/auth.py` | Clerk JWT validation middleware (JWKS) |
| `apps/api/src/connectors/*.py` | Individual connector implementations |
| `apps/api/src/worker.py` | Celery app definition |
| `apps/api/tasks/execution.py` | Celery execution tasks |
| `services/planner/` | Standalone planner service (or in-app) |
| `services/executor/` | Standalone executor (or in-app) |
| `packages/connectors/src/*.py` | Connector base classes + registry |
| `packages/types/src/*.ts` | Shared TypeScript types |
| `packages/ui/src/*.tsx` | Shared UI components |
| `docker/docker-compose.yml` | Local dev orchestration |
| `docker/Dockerfile.api` | FastAPI Dockerfile |
| `docker/Dockerfile.web` | Next.js Dockerfile |
| `.github/workflows/ci.yml` | CI pipeline |
| `.env.example` | Environment variable template |
