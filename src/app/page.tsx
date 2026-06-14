import { redirect } from "next/navigation"

export default function RootPage() {
  // Today is the home — the calm command center (TSK-3).
  redirect("/today")
}
