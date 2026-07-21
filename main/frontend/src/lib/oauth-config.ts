export type OAuthProvider = "google" | "notion" | "slack" | "meta"

export interface OAuthProviderConfig {
  provider: OAuthProvider
  authorizationUrl: string
  tokenUrl: string
  clientId: () => string | undefined
  clientSecret: () => string | undefined
  scopes: string[]
  additionalParams?: Record<string, string>
}

export const oauthProviders: Record<string, OAuthProviderConfig> = {
  google: {
    provider: "google",
    authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientId: () => process.env.GOOGLE_CLIENT_ID,
    clientSecret: () => process.env.GOOGLE_CLIENT_SECRET,
    scopes: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/forms.body",
      "https://www.googleapis.com/auth/forms.responses.readonly",
    ],
    additionalParams: {
      access_type: "offline",
      prompt: "consent",
    },
  },
  notion: {
    provider: "notion",
    authorizationUrl: "https://api.notion.com/v1/oauth/authorize",
    tokenUrl: "https://api.notion.com/v1/oauth/token",
    clientId: () => process.env.NOTION_CLIENT_ID,
    clientSecret: () => process.env.NOTION_CLIENT_SECRET,
    scopes: [],
  },
  slack: {
    provider: "slack",
    authorizationUrl: "https://slack.com/oauth/v2/authorize",
    tokenUrl: "https://slack.com/api/oauth.v2.access",
    clientId: () => process.env.SLACK_CLIENT_ID,
    clientSecret: () => process.env.SLACK_CLIENT_SECRET,
    scopes: [
      "channels:history",
      "channels:read",
      "chat:write",
      "users:read",
      "reactions:read",
      "files:read",
    ],
    additionalParams: {
      user_scope: "channels:history,channels:read,chat:write,users:read",
    },
  },
  meta: {
    provider: "meta",
    authorizationUrl: "https://www.facebook.com/v19.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v19.0/oauth/access_token",
    clientId: () => process.env.META_CLIENT_ID,
    clientSecret: () => process.env.META_CLIENT_SECRET,
    scopes: [
      "pages_messaging",
      "whatsapp_business_messaging",
      "instagram_basic",
      "instagram_content_publish",
    ],
  },
}

const connectorProviderMap: Record<string, string> = {
  gmail: "google",
  "google-sheets": "google",
  "google-calendar": "google",
  "google-forms": "google",
  notion: "notion",
  slack: "slack",
  messenger: "meta",
  whatsapp: "meta",
  instagram: "meta",
}

export function getProviderForConnector(connectorKey: string): string | undefined {
  return connectorProviderMap[connectorKey]
}

export function getRedirectUri(): string {
  const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  return `${origin}/api/connectors/callback`
}
