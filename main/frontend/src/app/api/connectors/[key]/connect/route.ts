import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { randomBytes } from "crypto"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { connectedAccounts } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { encrypt } from "@/lib/encryption"
import { getConnector } from "@/lib/connectors"
import { getProviderForConnector, oauthProviders, getRedirectUri } from "@/lib/oauth-config"

function redirectError(req: Request, error: string) {
  return NextResponse.redirect(new URL(`/settings/connectors?error=${error}`, req.url))
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params

  const connector = getConnector(key)
  if (!connector) {
    return redirectError(req, "unknown_connector")
  }

  const providerKey = getProviderForConnector(key)
  if (!providerKey) {
    return redirectError(req, "unknown_provider")
  }

  const config = oauthProviders[providerKey]
  if (!config) {
    return redirectError(req, "provider_not_configured")
  }

  const clientId = config.clientId()
  const clientSecret = config.clientSecret()

  const session = await auth()
  if (!session.userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }

  if (!db) {
    return redirectError(req, "database_not_available")
  }

  if (!clientId || !clientSecret) {
    const mockEmail = `demo@${key}.local`
    const mockToken = encrypt(JSON.stringify({
      access_token: `demo_${key}_${randomBytes(16).toString("hex")}`,
      provider: providerKey,
    }))

    const existing = await db
      .select()
      .from(connectedAccounts)
      .where(
        and(
          eq(connectedAccounts.userId, session.userId),
          eq(connectedAccounts.connectorKey, key)
        )
      )
      .limit(1)

    if (existing.length > 0) {
      await db
        .update(connectedAccounts)
        .set({
          accessToken: mockToken,
          providerAccountEmail: mockEmail,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(connectedAccounts.userId, session.userId),
            eq(connectedAccounts.connectorKey, key)
          )
        )
    } else {
      await db.insert(connectedAccounts).values({
        userId: session.userId,
        connectorKey: key,
        provider: providerKey,
        accessToken: mockToken,
        providerAccountEmail: mockEmail,
      })
    }

    return NextResponse.redirect(new URL(`/settings/connectors?connected=${key}`, req.url))
  }

  const csrfToken = randomBytes(32).toString("hex")
  const state = Buffer.from(
    JSON.stringify({ csrf: csrfToken, connectorKey: key })
  ).toString("base64url")

  const cookieStore = await cookies()
  cookieStore.set("oauth_state", csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  })

  const oauthParams = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: config.scopes.join(" "),
    state,
  })

  if (config.additionalParams) {
    for (const [k, v] of Object.entries(config.additionalParams)) {
      oauthParams.set(k, v)
    }
  }

  return NextResponse.redirect(`${config.authorizationUrl}?${oauthParams.toString()}`)
}
