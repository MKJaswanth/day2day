"use client"

import { usePathname } from "next/navigation"
import { allNav } from "@/lib/navigation"
import { CommandPalette } from "./command-palette"
import { QuickCapture } from "./quick-capture"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

export function AppShell({
  children,
  userName,
  userEmail,
}: {
  children: React.ReactNode
  userName: string
  userEmail: string
}) {
  const pathname = usePathname()
  const title = allNav.find((n) => n.href === pathname)?.label ?? "day2day"

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar userName={userName} userEmail={userEmail} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Global overlays */}
      <CommandPalette />
      <QuickCapture />
    </div>
  )
}
