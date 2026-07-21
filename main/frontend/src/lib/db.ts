import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "@/db/schema"

const url = process.env.DATABASE_URL

function createDb() {
  if (!url) return null
  const sql = neon(url)
  return drizzle(sql, { schema })
}

export const db = createDb()
