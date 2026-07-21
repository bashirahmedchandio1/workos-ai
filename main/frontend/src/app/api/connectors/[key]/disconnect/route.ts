import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { connectedAccounts } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params

  const session = await auth()
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!db) {
    return NextResponse.json({ error: "Database not available" }, { status: 500 })
  }

  await db
    .delete(connectedAccounts)
    .where(
      and(
        eq(connectedAccounts.userId, session.userId),
        eq(connectedAccounts.connectorKey, key)
      )
    )

  return NextResponse.json({ success: true })
}
