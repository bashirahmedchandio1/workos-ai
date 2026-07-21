import { openai } from "@ai-sdk/openai"
import { streamText, convertToModelMessages, createUIMessageStreamResponse, toUIMessageStream } from "ai"
import type { UIMessage } from "ai"
import { z } from "zod"

const systemPrompt = `You are WorkOS AI — an AI automation platform that builds workflows from natural language.

Your job is to:
1. Understand what the user wants to automate
2. Identify the relevant connectors (apps) needed
3. Produce a structured workflow plan with trigger → steps

Available connectors: Gmail, Google Sheets, Google Calendar, Google Forms, Notion, Slack

When the user describes a workflow, generate a structured plan with:
- A trigger (e.g., "New Gmail Email")
- Steps (actions to perform)
- Conditions/filters if applicable
- Dependencies between steps

Respond conversationally but always include the structured plan at the end of your response.`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
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
    },
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  })
}
