export type ConnectorCategory = "productivity" | "crm"

export interface Connector {
  key: string
  name: string
  category: ConnectorCategory
  description: string
  authType: "oauth2" | "api_key"
}

export const connectors: Connector[] = [
  { key: "gmail", name: "Gmail", category: "productivity", description: "Send and receive emails", authType: "oauth2" },
  { key: "google-sheets", name: "Google Sheets", category: "productivity", description: "Spreadsheet management", authType: "oauth2" },
  { key: "google-calendar", name: "Google Calendar", category: "productivity", description: "Calendar and scheduling", authType: "oauth2" },
  { key: "google-forms", name: "Google Forms", category: "productivity", description: "Create and manage forms and surveys", authType: "oauth2" },
  { key: "notion", name: "Notion", category: "productivity", description: "Docs, wikis, and project management", authType: "oauth2" },
  { key: "slack", name: "Slack", category: "productivity", description: "Team messaging and collaboration", authType: "oauth2" },
  { key: "messenger", name: "Messenger", category: "crm", description: "Facebook Messenger conversations", authType: "oauth2" },
  { key: "whatsapp", name: "WhatsApp", category: "crm", description: "WhatsApp Business messaging", authType: "oauth2" },
  { key: "instagram", name: "Instagram", category: "crm", description: "Instagram Direct messages", authType: "oauth2" },
]

export const categoryLabels: Record<ConnectorCategory, string> = {
  productivity: "Productivity",
  crm: "CRM",
}

export function getConnector(key: string): Connector | undefined {
  return connectors.find((c) => c.key === key)
}
