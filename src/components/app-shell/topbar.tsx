"use client"

import { Moon, Plus, Search, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useUIStore } from "@/lib/ui-store"

export function Topbar({ title }: { title: string }) {
  const { setCommandOpen, setCaptureOpen } = useUIStore()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-5">
      <h1 className="font-serif text-lg font-semibold tracking-tight">{title}</h1>

      <button
        type="button"
        onClick={() => setCommandOpen(true)}
        className="ml-auto flex h-8 items-center gap-2 rounded-md border border-border bg-background px-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary"
      >
        <Search className="size-3.5" />
        <span className="hidden sm:inline">Search…</span>
        <kbd className="hidden rounded border border-border px-1 text-xs sm:inline">⌘K</kbd>
      </button>

      <button
        type="button"
        onClick={() => setCaptureOpen(true)}
        className="flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Plus className="size-4" />
        <span className="hidden sm:inline">Capture</span>
      </button>

      <button
        type="button"
        aria-label="Toggle theme"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        {mounted && resolvedTheme === "dark" ? (
          <Sun className="size-4" />
        ) : (
          <Moon className="size-4" />
        )}
      </button>
    </header>
  )
}
