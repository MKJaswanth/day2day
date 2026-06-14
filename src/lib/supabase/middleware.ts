import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import { REMEMBER_COOKIE, toSessionCookie } from "@/lib/supabase/cookies"

const PUBLIC_PATHS = ["/login", "/auth"]

/**
 * Refreshes the Supabase session cookie on every request and guards routes:
 * signed-out users are sent to /login; signed-in users are kept out of /login.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  // Honor the Remember-me preference: when off, keep auth cookies session-only.
  const persist = request.cookies.get(REMEMBER_COOKIE)?.value !== "0"

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }
          response = NextResponse.next({ request })
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, persist ? options : toSessionCookie(options))
          }
        },
      },
    },
  )

  // IMPORTANT: do not run code between client creation and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (user && pathname.startsWith("/login")) {
    const url = request.nextUrl.clone()
    url.pathname = "/today"
    return NextResponse.redirect(url)
  }

  return response
}
