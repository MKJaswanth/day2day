"use server"

import { revalidatePath } from "next/cache"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { REMEMBER_COOKIE } from "@/lib/supabase/cookies"
import { createClient } from "@/lib/supabase/server"

/** Resolve this deployment's origin from request headers (works local + Vercel). */
async function getOrigin() {
  const h = await headers()
  const host = h.get("x-forwarded-host") ?? h.get("host")
  const proto = h.get("x-forwarded-proto") ?? "https"
  return `${proto}://${host}`
}

export type AuthState = { error?: string; message?: string }

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")
  const remember = formData.get("remember") === "on"

  // Persist the preference so middleware keeps cookies session-only when off.
  const store = await cookies()
  store.set(REMEMBER_COOKIE, remember ? "1" : "0", {
    path: "/",
    sameSite: "lax",
    maxAge: remember ? 60 * 60 * 24 * 365 : undefined,
  })

  const supabase = await createClient({ persistSession: remember })
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  revalidatePath("/", "layout")
  redirect("/today")
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")
  const name = String(formData.get("name") ?? "").trim()

  const supabase = await createClient()
  const origin = await getOrigin()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${origin}/auth/callback?next=/today`,
    },
  })
  if (error) return { error: error.message }

  // If email confirmation is on, there's no active session yet.
  if (!data.session) {
    return {
      message: `Almost there — we sent a confirmation link to ${email}. Click it to finish, then sign in.`,
    }
  }

  revalidatePath("/", "layout")
  redirect("/today")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
