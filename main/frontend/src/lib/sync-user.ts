import { db } from "@/lib/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function syncUser(clerkUser: {
  id: string
  email: string
  name: string
  image?: string | null
}) {
  if (!db) return

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.id, clerkUser.id))
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(users)
      .set({
        email: clerkUser.email,
        name: clerkUser.name,
        image: clerkUser.image ?? null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, clerkUser.id))
  } else {
    await db.insert(users).values({
      id: clerkUser.id,
      email: clerkUser.email,
      name: clerkUser.name,
      image: clerkUser.image ?? null,
    })
  }
}
