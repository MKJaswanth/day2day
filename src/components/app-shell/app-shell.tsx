"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { allNav } from "@/lib/navigation"
import { cn } from "@/lib/utils"
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
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close the mobile drawer on route change.
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">
        <Sidebar userName={userName} userEmail={userEmail} />
      </div>

      {/* Mobile drawer */}
      <div className={cn("md:hidden", drawerOpen ? "" : "pointer-events-none")}>
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setDrawerOpen(false)}
          className={cn(
            "fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity",
            drawerOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-out",
            drawerOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <Sidebar
            userName={userName}
            userEmail={userEmail}
            onNavigate={() => setDrawerOpen(false)}
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Global overlays */}
      <CommandPalette />
      <QuickCapture />
    </div>
  )
}
