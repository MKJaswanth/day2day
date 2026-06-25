"use client"

import { CalendarDays, Repeat } from "lucide-react"
import { toDateStr } from "@/lib/dates"
import { type Task, useToggleTask, useUpdateTask } from "@/lib/queries/tasks"
import { useUIStore } from "@/lib/ui-store"
import { cn } from "@/lib/utils"

function fmtDate(d: string) {
  return new Date(`${d}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function bump(dateStr: string, days: number) {
  const [y, m, d] = dateStr.split("-").map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + days)
  return toDateStr(dt)
}

export function TaskRow({ task, showDefer = false }: { task: Task; showDefer?: boolean }) {
  const toggle = useToggleTask()
  const update = useUpdateTask()
  const openPeek = useUIStore((s) => s.openPeek)
  const done = !!task.completed_at

  function defer(days: number) {
    const base = task.scheduled_date ?? task.due_date ?? toDateStr(new Date())
    const next = bump(base, days)
    update.mutate({
      id: task.id,
      patch: task.scheduled_date ? { scheduled_date: next } : { due_date: next },
    })
  }

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

      {task.recurrence_rule && task.recurrence_rule !== "none" ? (
        <Repeat className="size-3 shrink-0 text-muted-foreground" />
      ) : null}

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

      {showDefer && !done ? (
        <span className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => defer(1)}
            className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            +1d
          </button>
          <button
            type="button"
            onClick={() => defer(7)}
            className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            +1w
          </button>
        </span>
      ) : null}
    </li>
  )
}
