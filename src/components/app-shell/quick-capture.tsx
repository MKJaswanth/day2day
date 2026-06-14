"use client"

import * as chrono from "chrono-node"
import { Command } from "cmdk"
import { CalendarDays, CornerDownLeft } from "lucide-react"
import { useEffect, useState } from "react"
import { useUIStore } from "@/lib/ui-store"

/**
 * ⌘N global quick-capture (CAP-1/2/6). Minimal modal, natural-language date
 * parsing, sub-two-second feel. Persistence wired in Phase 1.
 */
export function QuickCapture() {
  const { captureOpen, setCaptureOpen } = useUIStore()
  const [value, setValue] = useState("")

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "n" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        useUIStore.getState().toggleCapture()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  // Lightweight NL date preview, e.g. "call dentist friday"
  const parsed = value ? chrono.parse(value)[0] : undefined
  const parsedDate = parsed?.start?.date()

  function submit() {
    // TODO(Phase 1): write to inbox via TanStack Query optimistic mutation.
    setValue("")
    setCaptureOpen(false)
  }

  return (
    <Command.Dialog
      open={captureOpen}
      onOpenChange={(o) => {
        setCaptureOpen(o)
        if (!o) setValue("")
      }}
      label="Quick capture"
      shouldFilter={false}
      className="fixed left-1/2 top-[14%] z-50 w-[calc(100%-1.5rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl shadow-black/20 sm:top-[22%]"
      overlayClassName="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
    >
      <div className="px-4 pt-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Quick capture
        </p>
      </div>
      <Command.Input
        autoFocus
        value={value}
        onValueChange={setValue}
        placeholder="What's on your mind? (e.g. call dentist friday)"
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) submit()
        }}
        className="h-14 w-full bg-transparent px-4 text-base outline-none placeholder:text-muted-foreground"
      />
      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          {parsedDate ? (
            <>
              <CalendarDays className="size-3.5 text-primary" />
              <span className="text-foreground">
                {parsedDate.toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span>· “{parsed?.text}”</span>
            </>
          ) : (
            <span>Lands in your Inbox</span>
          )}
        </span>
        <span className="flex items-center gap-1">
          Save <CornerDownLeft className="size-3.5" />
        </span>
      </div>
    </Command.Dialog>
  )
}
