import type { User } from "@supabase/supabase-js"

function metaName(user: User): string | undefined {
  const meta = user.user_metadata ?? {}
  const name = (meta.full_name as string) || (meta.name as string) || (meta.display_name as string)
  return name?.trim() || undefined
}

/** Turn an email local part like "jaswanth.mk63" into a readable "Jaswanth". */
function nameFromEmail(email: string): string {
  const local = email.split("@")[0]
  const firstAlpha = local.split(/[._\-0-9]+/).find((p) => p.length > 0) ?? local
  return firstAlpha.charAt(0).toUpperCase() + firstAlpha.slice(1)
}

/** Best-effort full display name: metadata name, else a cleaned email local part. */
export function displayNameFromUser(user: User | null): string {
  if (!user) return "you"
  return metaName(user) ?? (user.email ? nameFromEmail(user.email) : "you")
}

/** Just the first name, for greetings ("Good morning, Jaswanth."). */
export function firstNameFromUser(user: User | null): string | null {
  if (!user) return null
  const name = metaName(user)
  if (name) return name.split(/\s+/)[0]
  return user.email ? nameFromEmail(user.email) : null
}
