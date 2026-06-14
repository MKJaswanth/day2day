import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { toSessionCookie } from "@/lib/supabase/cookies"

/**
 * Server-side Supabase client (Server Components, Route Handlers, Server Actions).
 * Pass `persistSession: false` to write session-only cookies (Remember-me off).
 */
export async function createClient(opts?: { persistSession?: boolean }) {
  const cookieStore = await cookies()
  const persist = opts?.persistSession ?? true

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, persist ? options : toSessionCookie(options))
            }
          } catch {
            // Called from a Server Component — safe to ignore when middleware refreshes sessions.
          }
        },
      },
    },
  )
}
