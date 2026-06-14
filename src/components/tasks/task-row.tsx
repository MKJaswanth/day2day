"use client"

import { CalendarDays } from "lucide-react"
import { type Task, useToggleTask } from "@/lib/queries/tasks"
import { useUIStore } from "@/lib/ui-store"
import { cn } from "@/lib/utils"

function fmtDate(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

export function TaskRow({ task }: { task: Task }) {
  const toggle = useToggleTask()
  const openPeek = useUIStore((s) => s.openPeek)
  const done = !!task.completed_at

  return (
    <li className="group flex items-center gap-3 px-3.5 py-2.5">
      <button
        type="button"
        aria-label={done ? "Mark incomplete" : "Mark complete"}
        onClick={() => toggle(task)}
        className={cn(
          "flex size-[18px] shrink-0 items-center justify-center rounded-full border transition-colors",
          done ? "border-primary bg-primary" : "border-muted-foreground/40 hover:border-primary",
        )}
      >
        {done ? <span className="size-2 rounded-full bg-primary-foreground" /> : null}
      </button>

      <button
        type="button"
        onClick={() => openPeek({ type: "task", id: task.id })}
        className="min-w-0 flex-1 text-left"
      >
        <span className={cn("text-sm", done && "text-muted-foreground line-through")}>
          {task.title}
        </span>
      </button>

      {task.priority !== "none" && !done ? (
        <span className="shrink-0 rounded bg-warning/15 px-1.5 py-0.5 text-xs font-medium capitalize text-warning">
          {task.priority}
        </span>
      ) : null}

      {task.due_date ? (
        <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground tabular-nums">
          <CalendarDays className="size-3" />
          {fmtDate(task.due_date)}
        </span>
      ) : null}
    </li>
  )
}
