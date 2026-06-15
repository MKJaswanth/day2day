"use client"

import { useEffect } from "react"
import { useUIStore } from "@/lib/ui-store"
import { cn } from "@/lib/utils"
import { FollowUpPeek } from "./follow-up-peek"
import { LearningPeek } from "./learning-peek"
import { ProjectPeek } from "./project-peek"
import { TaskPeek } from "./task-peek"

/** Right-hand slide-over for editing any item without leaving the current view. */
export function PeekPanel() {
  const { peek, closePeek } = useUIStore()
  const open = peek !== null

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closePeek()
    }
    if (open) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, closePeek])

  return (
    <>
      <button
        type="button"
        aria-label="Close panel"
        tabIndex={open ? 0 : -1}
        onClick={closePeek}
        className={cn(
          "fixed inset-0 z-40 bg-black/30 transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-card shadow-2xl shadow-black/20 transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {peek?.type === "task" ? <TaskPeek taskId={peek.id} /> : null}
        {peek?.type === "project" ? <ProjectPeek projectId={peek.id} /> : null}
        {peek?.type === "follow_up" ? <FollowUpPeek followUpId={peek.id} /> : null}
        {peek?.type === "learning_item" ? <LearningPeek itemId={peek.id} /> : null}
      </aside>
    </>
  )
}
