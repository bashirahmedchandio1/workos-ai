# Tech Stack Research — WorkOS AI Backend

> **Purpose:** Research findings and strategic rationale for the selected backend technologies.
> **Date:** July 2026
> **Target Stack:** Python 3.13, FastAPI, OpenAI Agents SDK, Qdrant, MCP SDK, SQLModel

---

## 1. OpenAI Agents SDK

### Status

| Attribute | Value |
|-----------|-------|
| Version | 0.18.3 (Jul 2026) |
| PyPI | `pip install openai-agents` |
| Repo | https://github.com/openai/openai-agents-python |
| Docs | https://openai.github.io/openai-agents-python/ |
| License | MIT |
| Python | >= 3.10 |

### Why It Replaces Raw OpenAI API Calls

The existing specs (Phase 1) use the OpenAI Responses API directly with manual function calling loops. The Agents SDK makes this obsolete by providing a managed agent loop:

| Capability | Raw OpenAI API | Agents SDK |
|-------------|---------------|------------|
| Agent loop | Manual — write while-loop for tool_calls | Built-in `Runner.run()` loop |
| Multi-turn | Manual message history management | Automatic via Sessions |
| Multi-agent | Not a concept | First-class via Handoffs + agents-as-tools |
| Tools | JSON schemas in API call | `@function_tool` decorator, auto Pydantic |
| Guardrails | Write separate validation | Built-in input/output/tool guardrails |
| Tracing | Manual logging | Automatic, OpenAI dashboard + custom processors |
| Structured output | `response_format` param | `output_type` param (Pydantic) |
| Context/DI | Manual | Generic context type parameter |
| Human-in-loop | Not available | Built-in approval/interruption |
| MCP integration | Manual | Native `mcp_servers` parameter |

### Key Concepts for WorkOS AI

**Agent** — The core primitive. Each agent is an LLM configured with:
- `instructions` — system prompt
- `tools` — `@function_tool` decorated Python functions or MCP servers
- `handoffs` — child agents for delegation
- `output_type` — Pydantic model for structured output
- `input_guardrails` / `output_guardrails` — validation hooks

**Runner** — The runtime that drives the agent loop:
- `Runner.run()` — async, returns `RunResult`
- `Runner.run_sync()` — sync wrapper
- `Runner.run_streamed()` — async with streaming events

**Handoff** — Delegation from one agent to another:
- LLM sees handoffs as tool calls (`transfer_to_<agent_name>`)
- Supports input filters to control what history the receiving agent sees
- Two patterns: Manager (agents as tools) and Handoffs (peer-to-peer)

**Tracing** — Built-in observability:
- Records LLM calls, tool calls, handoffs, guardrails
- Exportable to 20+ platforms (LangSmith, Weights & Biases, Datadog, etc.)

### Architecture Pattern for WorkOS AI

```
                      ┌──────────────────────────┐
                      │     Orchestrator Agent   │
                      │   (OpenAI Agents SDK)    │
                      └──────────┬───────────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                    │
            ▼                    ▼                    ▼
     ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
     │ Planner      │    │ Researcher   │    │ Executor     │
     │ Agent        │    │ Agent        │    │ Agent        │
     └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
            │                   │                   │
            ▼                   ▼                   ▼
     ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
     │ Breaks       │    │ Gathers      │    │ Calls MCP    │
     │ intent into  │    │ context from │    │ tools for    │
     │ steps        │    │ memory/web   │    │ connectors   │
     └──────────────┘    └──────────────┘    └──────────────┘
```

### Integration with FastAPI

```python
from agents import Agent, Runner, function_tool, trace

# Agents live in services/agents/
# FastAPI routes call Runner.run() with the orchestrator agent
# Results are returned as structured Pydantic models
```

### Decision Rationale

1. **Reduces boilerplate** — no manual tool-calling loop, no message history management
2. **Production-ready** — 28k+ GitHub stars, MIT license, active development
3. **MCP native** — `mcp_servers` parameter means connectors can be MCP servers
4. **Tracing built-in** — observability without extra infrastructure
5. **Guardrails** — prevent prompt injection and bad plans before execution
6. **Handoffs** — natural fit for multi-agent architecture (Planner → Researcher → Executor)

---

## 2. Qdrant Vector Database

### Status

| Attribute | Value |
|-----------|-------|
| Version | 1.x (stable) |
| PyPI | `pip install qdrant-client` |
| Repo | https://github.com/qdrant/qdrant |
| Docs | https://qdrant.tech/documentation/ |
| License | Apache 2.0 |
| Deployment | Docker, Cloud, In-memory |

### Why Qdrant Replaces/Supplements pgvector

The existing specs mention AI Memory stored in PostgreSQL with optional pgvector embeddings. Qdrant provides a dedicated vector database with significant advantages:

| Capability | pgvector | Qdrant |
|-------------|----------|--------|
| Type | PostgreSQL extension | Dedicated vector DB (Rust) |
| Infra overhead | None (uses existing PG) | Separate service |
| Hybrid search | Manual | Native (dense + sparse + RRF/DBSF) |
| Payload filtering | SQL WHERE | Built-in filterable HNSW |
| Quantization | Binary, scalar | Binary, scalar, product, TurboQuant |
| Multi-vector | Not supported | Native (ColBERT-style) |
| GPU acceleration | Not supported | CUDA 12.x + AMD |
| Horizontal scaling | Not supported | Sharding + replication |
| Latency (1M vectors p95) | ~12ms | ~5ms (HNSW + scalar quant) |
| Async client | No native | Yes (AsyncQdrantClient) |

### Architecture for WorkOS AI

Qdrant replaces the `ai_memory` PostgreSQL table for **vector-based memory** while keeping SQLModel for relational data (users, workflows, runs, etc.):

```
Relational Data (PostgreSQL + SQLModel)     Vector Data (Qdrant)
─────────────────────────────────────       ────────────────────────
users, organizations, workflows             ai_memory_embeddings
workflow_steps, workflow_runs               (user preferences, patterns,
execution_logs, approvals                    past plans, corrections)
oauth_tokens, connectors                    semantic_workflow_search
                                            (find similar past workflows)
```

### Key Collections for WorkOS AI

| Collection | Vector Dim | Payload Fields | Purpose |
|------------|-----------|----------------|---------|
| `memory_user_{user_id}` | 1536 (ada-003) | key, category, weight, created_at | Per-user AI memory |
| `workflow_patterns` | 1536 | prompt, plan_hash, success_rate, connector_keys | Semantic workflow search |
| `connector_docs` | 1536 | connector_key, action_key, description | RAG for planner |

### Integration Pattern

```python
from qdrant_client import AsyncQdrantClient, models

class MemoryService:
    def __init__(self):
        self.client = AsyncQdrantClient(url="http://localhost:6333")

    async def store_memory(self, user_id: str, key: str, value: dict, embedding: list[float]):
        await self.client.upsert(
            collection_name=f"memory_user_{user_id}",
            points=[
                models.PointStruct(
                    id=hash(f"{key}_{user_id}"),
                    vector=embedding,
                    payload={"key": key, "value": value, "category": "preference"},
                )
            ],
        )

    async def search_similar(self, user_id: str, query_embedding: list[float], limit: int = 5):
        results = await self.client.query_points(
            collection_name=f"memory_user_{user_id}",
            query=query_embedding,
            limit=limit,
            with_payload=True,
        )
        return results.points
```

### Decision Rationale

1. **Purpose-built for vectors** — pgvector works, but Qdrant is optimized for vector operations
2. **Hybrid search** — combine dense embeddings with sparse keyword search for memory retrieval
3. **Per-user collections** — natural multi-tenant isolation via separate collections
4. **Payload filtering** — filter by category, timestamp, weight without SQL
5. **Async native** — `AsyncQdrantClient` integrates cleanly with FastAPI asyncio
6. **Quantization** — reduces memory by 75-97% for production scale
7. **In-memory mode** — `QdrantClient(":memory:")` for testing without infrastructure

---

## 3. MCP SDK (Model Context Protocol)

### Status

| Attribute | Value |
|-----------|-------|
| Version | 1.x (stable), 2.0.0b2 (beta, stable ~Jul 28 2026) |
| PyPI | `pip install mcp` |
| Repo | https://github.com/modelcontextprotocol/python-sdk |
| Docs | https://py.sdk.modelcontextprotocol.io |
| Spec | https://modelcontextprotocol.io/specification/latest |
| License | MIT |
| Python | >= 3.10 |

### What MCP Solves

MCP (Model Context Protocol) is an open standard for how applications provide context and tools to LLMs. Think of it as "USB-C for AI" — a universal plug-and-play standard that decouples LLMs from tool implementations.

**Before MCP:** Every connector (Gmail, Slack, Notion) requires custom integration code wired directly into the agent loop.

**After MCP:** Each connector is an independent MCP server exposing its operations as standardized tools. The agent discovers and calls them dynamically.

### Architecture for WorkOS AI

```
┌─────────────────────────────────────────────────────────────┐
│                  WorkOS AI Backend (FastAPI)                  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              AI Agent (OpenAI Agents SDK)             │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │   │
│  │  │ MCP      │ │ MCP      │ │ MCP      │ │ MCP   │  │   │
│  │  │ Client 1 │ │ Client 2 │ │ Client 3 │ │ ...   │  │   │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘  │   │
│  └───────┼────────────┼────────────┼────────────┼───────┘   │
│          │            │            │            │           │
│          ▼            ▼            ▼            ▼           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Gmail    │ │ Slack    │ │ Notion   │ │ Drive    │       │
│  │ MCP Srv  │ │ MCP Srv  │ │ MCP Srv  │ │ MCP Srv  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Connector as MCP Server Pattern

Each connector (Gmail, Slack, Notion, etc.) becomes an independent MCP server:

```python
# gmail_server.py
from mcp.server import MCPServer

mcp = MCPServer("Gmail Connector")

@mcp.tool()
def send_email(to: str, subject: str, body: str) -> dict:
    """Send an email via Gmail."""
    # Gmail API logic
    return {"status": "sent", "message_id": "..."}

@mcp.tool(read_only_hint=True)
def search_emails(query: str, max_results: int = 10) -> list[dict]:
    """Search emails in Gmail."""
    return [...]

@mcp.resource("email://{message_id}")
def get_email(message_id: str) -> str:
    """Fetch full email content."""
    return "..."
```

### Integration with OpenAI Agents SDK

The Agents SDK natively supports MCP servers via the `mcp_servers` parameter:

```python
from agents import Agent
from agents.mcp import MCPServerStdio

agent = Agent(
    name="Workflow Assistant",
    instructions="You help users automate workflows across their apps.",
    mcp_servers=[
        MCPServerStdio(params=StdioServerParameters(command="uv", args=["run", "gmail_server.py"])),
        MCPServerStdio(params=StdioServerParameters(command="uv", args=["run", "slack_server.py"])),
        MCPServerStdio(params=StdioServerParameters(command="uv", args=["run", "notion_server.py"])),
    ],
)
```

### Connector Registry via MCP

Instead of a custom registry, MCP provides:

1. **Runtime Discovery** — `tools/list` returns all available tools from a server
2. **Dynamic Capabilities** — servers announce changes via `notifications/tools/list_changed`
3. **Standardized Schemas** — every tool returns JSON Schema for its parameters
4. **Independent Deployment** — each connector runs as its own process (stdio or HTTP)

### Transport Strategy

| Transport | Use Case |
|-----------|----------|
| **stdio** | Development, local testing, connectors bundled with backend |
| **Streamable HTTP** | Production — deploy connectors as microservices behind reverse proxy |
| **In-memory** | Unit tests — pass MCPServer directly to Client |

### Decision Rationale

1. **Industry standard** — MCP is becoming the universal protocol for AI-tool communication
2. **OpenAI Agents SDK native** — the `mcp_servers` parameter means zero glue code
3. **Loose coupling** — connectors can be developed, deployed, and scaled independently
4. **Runtime discovery** — new connectors don't require code changes in the agent
5. **Security isolation** — connectors run as separate processes with declared permissions
6. **Reusability** — MCP servers work with any MCP-compatible client (Claude Desktop, VS Code, etc.)

---

## 4. Technology Interaction Summary

```
                    ┌──────────────────────────────┐
                    │     FastAPI (API Server)     │
                    │  ┌────────────────────────┐  │
                    │  │  OpenAI Agents SDK     │  │
                    │  │  - Agent Runner        │  │
                    │  │  - Guardrails          │  │
                    │  │  - Handoffs            │  │
                    │  │  - Tracing             │  │
                    │  └───────────┬────────────┘  │
                    │              │               │
                    │              ▼               │
                    │  ┌────────────────────────┐  │
                    │  │   MCP Client Layer     │  │
                    │  │   (Discovers + Calls)  │  │
                    │  └──┬────┬────┬────┬─────┘  │
                    └─────┼────┼────┼────┼────────┘
                          │    │    │    │
         ┌────────────────┘    │    │    └──────────────┐
         ▼                     ▼    ▼                   ▼
  ┌──────────┐          ┌──────────┐           ┌──────────────┐
  │PostgreSQL│          │Qdrant    │           │ MCP Servers  │
  │SQLModel  │          │Vectors   │           │ Gmail,Slack, │
  │(relational)         │(memory)  │           │ Notion, etc. │
  └──────────┘          └──────────┘           └──────────────┘
```

**Data Flow:**
1. User prompt arrives via FastAPI → route handler
2. Route creates an Agent (OpenAI Agents SDK) with relevant MCP servers
3. Agent discovers tools from MCP servers → analyses intent
4. Agent retrieves user memory from Qdrant (vector similarity)
5. Agent generates structured WorkflowPlan (Pydantic output_type)
6. Plan validated, stored in PostgreSQL via SQLModel
7. Execution phase: Agent calls MCP tools to execute workflow steps
8. Results stored, memory updated in Qdrant

---

## 5. Dependency Summary

```toml
# pyproject.toml additions for new tech stack
dependencies = [
    # Existing
    "fastapi[standard]>=0.115.0",
    "sqlmodel>=0.0.22",
    "alembic>=1.14.0",
    "psycopg2-binary>=2.9.10",

    # New — AI Agent Framework
    "openai-agents>=0.18.0",           # OpenAI Agents SDK (supersedes raw openai)

    # New — Vector Database
    "qdrant-client>=1.12.0",           # Qdrant Python client (async + sync)

    # New — MCP SDK
    "mcp>=1.0.0",                      # Model Context Protocol Python SDK

    # Retained — utility
    "redis>=5.2.0",
    "celery>=5.4.0",
    "loguru>=0.7.3",
    "pydantic-settings>=2.7.0",
    "httpx>=0.28.0",
    "apscheduler>=3.10.4",
]
```

---

## 6. Migration Path from Current Specs

| Phase 1 Spec | New Approach | Rationale |
|-------------|-------------|-----------|
| Raw OpenAI API (Responses API) | OpenAI Agents SDK | Managed agent loop, guardrails, handoffs, tracing |
| `ai_memory` table (PostgreSQL) | Qdrant collections | Purpose-built vector search, hybrid search, per-user isolation |
| Custom connector registry | MCP SDK servers | Industry standard protocol, runtime discovery, independent deployment |
| SQLModel for relational data | SQLModel (unchanged) | Still best for structured relational data |
| Celery for background tasks | Celery (unchanged) | Still needed for long-running workflow execution |
| APScheduler for cron | APScheduler (unchanged) | Still needed for watch mode / scheduled triggers |
