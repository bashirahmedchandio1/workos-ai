import { createOpenAI } from "@ai-sdk/openai"
import { streamText, convertToModelMessages, createUIMessageStreamResponse, toUIMessageStream } from "ai"
import type { UIMessage } from "ai"
import { auth } from "@clerk/nextjs/server"
import { z } from "zod"

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
  headers: {
    "HTTP-Referer": "http://localhost:3000",
    "X-OpenRouter-Title": "WorkOS AI",
  },
})

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const MODEL = process.env.OPENROUTER_MODEL || "openrouter/free"

const systemPrompt = `You are WorkOS AI — an AI automation platform that executes tasks using connected apps.

Strict behavioral rules:
- NEVER output JSON, code fences containing raw data, or debug/technical text
- NEVER say "as an AI" or equivalent self-references
- Respond only in user-facing markdown with branded action buttons when referencing tools
- Use active voice and direct language
- If a tool is not connected, indicate that authentication is needed
- When a task is created, describe it conversationally (the frontend renders TaskCards automatically)
- Always end with 3 follow-up suggestions as a bullet list

Available connectors: Gmail, Google Sheets, Google Calendar, Google Forms, Notion, Slack, Messenger, Instagram, WhatsApp

When the user asks you to DO something (create, send, post, schedule, save, etc.), use the \`executeTask\` tool. Pass the user's full request as the prompt. The agent will handle execution and return a result. Then summarize the result for the user.

When the user is just asking a question or exploring, answer directly without calling the tool.`

function extractText(msg: UIMessage): string {
  return msg.parts
    .filter((p) => p.type === "text")
    .map((p) => (p as { text: string }).text)
    .join("")
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const session = await auth()
  const token = await session.getToken()

  const result = streamText({
    model: openrouter.chat(MODEL),
    instructions: systemPrompt,
    messages: await convertToModelMessages(messages),
    tools: {
      searchConnectors: {
        description: "Search available connectors by name or keyword",
        inputSchema: z.object({
          query: z.string().describe("Search query"),
        }),
        execute: async ({ query }: { query: string }) => {
          const { connectors } = await import("@/lib/connectors")
          const q = query.toLowerCase()
          return connectors.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.key.includes(q) ||
              c.description.toLowerCase().includes(q)
          )
        },
      },
      executeTask: {
        description:
          "Execute a task or action using connected apps (e.g. send email, create notion page, post slack message). Use this when the user asks to actually DO something.",
        inputSchema: z.object({
          prompt: z.string().describe("The full task description or request from the user"),
        }),
        execute: async ({ prompt }: { prompt: string }) => {
          if (!token) {
            return "Authentication required. Please sign in to execute tasks."
          }
          const response = await fetch(`${BACKEND_URL}/api/agent/execute`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ prompt }),
            signal: AbortSignal.timeout(60000),
          })
          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Agent execution failed (${response.status}): ${errorText}`)
          }
          const data = await response.json()
          return data.response || "Task executed successfully."
        },
      },
    },
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
