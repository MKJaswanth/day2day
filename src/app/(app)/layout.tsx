import { redirect } from "next/navigation"
import { AppShell } from "@/components/app-shell/app-shell"
import { createClient } from "@/lib/supabase/server"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Middleware already guards this, but belt-and-suspenders for the data layer.
  if (!user) redirect("/login")

  return <AppShell userEmail={user.email ?? "you"}>{children}</AppShell>
}
