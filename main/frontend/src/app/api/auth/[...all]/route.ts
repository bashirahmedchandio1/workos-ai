async function handle(request: Request) {
  const { getAuth } = await import("@/lib/auth")
  const auth = await getAuth()
  return auth.handler(request)
}

export const GET = handle
export const POST = handle
export const PATCH = handle
export const PUT = handle
export const DELETE = handle
