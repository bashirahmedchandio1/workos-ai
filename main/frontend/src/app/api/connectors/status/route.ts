import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { connectedAccounts } from "@/db/schema"
import { eq } from "drizzle-orm"
import { connectors } from "@/lib/connectors"

export const dynamic = "force-dynamic"

export async function GET() {
  const session = await auth()
  if (!session.userId || !db) {
    const empty: Record<string, { connected: false }> = {}
    for (const c of connectors) {
      empty[c.key] = { connected: false }
    }
    return NextResponse.json({ statuses: empty })
  }

  const accounts = await db
    .select({
      connectorKey: connectedAccounts.connectorKey,
      providerAccountEmail: connectedAccounts.providerAccountEmail,
      createdAt: connectedAccounts.createdAt,
    })
    .from(connectedAccounts)
    .where(eq(connectedAccounts.userId, session.userId))

  const statuses: Record<string, { connected: boolean; providerAccountEmail?: string | null; createdAt?: Date | null }> = {}

  for (const connector of connectors) {
    const account = accounts.find((a) => a.connectorKey === connector.key)
    statuses[connector.key] = account
      ? { connected: true, providerAccountEmail: account.providerAccountEmail, createdAt: account.createdAt }
      : { connected: false }
  }

  return NextResponse.json({ statuses })
}
