import { NextResponse } from "next/server"
import { cookies } from "next/headers"
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

function redirectSuccess(req: Request, connectorKey: string) {
  return NextResponse.redirect(new URL(`/settings/connectors?connected=${connectorKey}`, req.url))
}

interface GoogleUserInfo {
  id: string
  email: string
  verified_email?: boolean
  name?: string
  picture?: string
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const stateParam = searchParams.get("state")
  const errorParam = searchParams.get("error")

  if (errorParam) {
    return redirectError(req, "access_denied")
  }

  if (!code || !stateParam) {
    return redirectError(req, "invalid_request")
  }

  let state: { csrf: string; connectorKey: string }
  try {
    state = JSON.parse(Buffer.from(stateParam, "base64url").toString())
  } catch {
    return redirectError(req, "invalid_state")
  }

  const cookieStore = await cookies()
  const csrfCookie = cookieStore.get("oauth_state")
  if (!csrfCookie || csrfCookie.value !== state.csrf) {
    return redirectError(req, "csrf_mismatch")
  }
  cookieStore.delete("oauth_state")

  const session = await auth()
  if (!session.userId) {
    return redirectError(req, "unauthenticated")
  }

  const connector = getConnector(state.connectorKey)
  if (!connector) {
    return redirectError(req, "unknown_connector")
  }

  const providerKey = getProviderForConnector(state.connectorKey)
  if (!providerKey) {
    return redirectError(req, "unknown_provider")
  }

  const config = oauthProviders[providerKey]
  if (!config) {
    return redirectError(req, "provider_not_configured")
  }

  const clientId = config.clientId()
  const clientSecret = config.clientSecret()
  if (!clientId || !clientSecret) {
    return redirectError(req, "provider_not_configured")
  }

  const tokenHeaders: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  }

  const tokenBody = new URLSearchParams({
    code,
    redirect_uri: getRedirectUri(),
    grant_type: "authorization_code",
  })

  if (providerKey === "notion") {
    tokenHeaders["Authorization"] = `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`
  } else {
    tokenBody.set("client_id", clientId)
    tokenBody.set("client_secret", clientSecret)
  }

  const tokenResponse = await fetch(config.tokenUrl, {
    method: "POST",
    headers: tokenHeaders,
    body: tokenBody,
  })

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text()
    console.error(`Token exchange failed for ${providerKey}:`, errorText)
    return redirectError(req, "token_exchange_failed")
  }

  const tokens = await tokenResponse.json()

  const encryptedAccessToken = encrypt(tokens.access_token)
  const encryptedRefreshToken = tokens.refresh_token ? encrypt(tokens.refresh_token) : null

  let providerAccountId = ""
  let providerAccountEmail = ""

  if (providerKey === "google") {
    try {
      const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })
      if (userInfoRes.ok) {
        const userInfo = (await userInfoRes.json()) as GoogleUserInfo
        providerAccountId = userInfo.id
        providerAccountEmail = userInfo.email
      }
    } catch (e) {
      console.error("Failed to fetch Google user info:", e)
    }
  }

  if (providerKey === "hubspot") {
    providerAccountId = tokens.user_id ? String(tokens.user_id) : ""
    if (tokens.hub_domain) {
      providerAccountEmail = tokens.hub_domain
    }
  }

  if (!db) {
    return redirectError(req, "database_not_available")
  }

  const existing = await db
    .select()
    .from(connectedAccounts)
    .where(
      and(
        eq(connectedAccounts.userId, session.userId),
        eq(connectedAccounts.connectorKey, state.connectorKey)
      )
    )
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(connectedAccounts)
      .set({
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken ?? existing[0].refreshToken,
        expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null,
        scopes: tokens.scope || config.scopes.join(" "),
        providerAccountId: providerAccountId || existing[0].providerAccountId,
        providerAccountEmail: providerAccountEmail || existing[0].providerAccountEmail,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(connectedAccounts.userId, session.userId),
          eq(connectedAccounts.connectorKey, state.connectorKey)
        )
      )
  } else {
    await db.insert(connectedAccounts).values({
      userId: session.userId,
      connectorKey: state.connectorKey,
      provider: providerKey,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      expiresAt: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null,
      scopes: tokens.scope || config.scopes.join(" "),
      providerAccountId,
      providerAccountEmail,
    })
  }

  return redirectSuccess(req, state.connectorKey)
}
