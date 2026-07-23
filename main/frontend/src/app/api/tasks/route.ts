import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { tasks } from "@/db/schema"
import { eq, desc } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session.userId || !db) {
    return NextResponse.json({ tasks: [] })
  }

  const userTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, session.userId))
    .orderBy(desc(tasks.createdAt))

  return NextResponse.json({ tasks: userTasks })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session.userId || !db) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, priority, dueDate } = body

  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 })
  }

  const validPriorities = ["high", "medium", "low"]
  const taskPriority = validPriorities.includes(priority) ? priority : "medium"

  const [task] = await db
    .insert(tasks)
    .values({
      userId: session.userId,
      title: title.trim(),
      description: description?.trim() || null,
      priority: taskPriority,
      dueDate: dueDate ? new Date(dueDate) : null,
    })
    .returning()

  return NextResponse.json({ task })
}
