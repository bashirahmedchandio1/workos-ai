import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { connectedAccounts } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params

  const session = await auth()
  if (!session.userId) {
    return NextResponse.json({ connected: false })
  }

  if (!db) {
    return NextResponse.json({ connected: false })
  }

  const account = await db
    .select({
      providerAccountEmail: connectedAccounts.providerAccountEmail,
      scopes: connectedAccounts.scopes,
      createdAt: connectedAccounts.createdAt,
      provider: connectedAccounts.provider,
      providerAccountId: connectedAccounts.providerAccountId,
    })
    .from(connectedAccounts)
    .where(
      and(
        eq(connectedAccounts.userId, session.userId),
        eq(connectedAccounts.connectorKey, key)
      )
    )
    .limit(1)

  if (account.length === 0) {
    return NextResponse.json({ connected: false })
  }

  return NextResponse.json({
    connected: true,
    providerAccountEmail: account[0].providerAccountEmail,
    scopes: account[0].scopes,
    createdAt: account[0].createdAt,
    provider: account[0].provider,
    providerAccountId: account[0].providerAccountId,
  })
}
