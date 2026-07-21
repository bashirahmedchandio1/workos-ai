import { betterAuth } from "better-auth"
import { nextCookies } from "better-auth/next-js"

export async function getAuth() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      "DATABASE_URL is not configured. Auth is unavailable.\n" +
        "Set DATABASE_URL in .env.local with your NeonDB connection string."
    )
  }

  const { neon } = await import("@neondatabase/serverless")
  const { drizzle } = await import("drizzle-orm/neon-http")
  const { drizzleAdapter } = await import("@better-auth/drizzle-adapter")
  const schema = await import("@/db/schema")

  const sql = neon(url)
  const db = drizzle(sql, { schema })

  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    plugins: [nextCookies()],
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
  })
}
