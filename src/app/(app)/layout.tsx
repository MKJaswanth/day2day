import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { AppShell } from "@/components/app-shell/app-shell"
import { createClient } from "@/lib/supabase/server"
import { displayNameFromUser, firstNameFromUser } from "@/lib/user"

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const name = firstNameFromUser(user)
  return { title: name ? `Welcome, ${name} · day2day` : "day2day" }
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Middleware already guards this, but belt-and-suspenders for the data layer.
  if (!user) redirect("/login")

  return (
    <AppShell userName={displayNameFromUser(user)} userEmail={user.email ?? ""}>
      {children}
    </AppShell>
  )
}
