"use client"

import {
  addDays,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { toDateStr } from "@/lib/dates"
import { type Task, useTasks } from "@/lib/queries/tasks"
import { useUIStore } from "@/lib/ui-store"
import { cn } from "@/lib/utils"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function CalendarView() {
  const { data: tasks } = useTasks()
  const openPeek = useUIStore((s) => s.openPeek)
  const [cursor, setCursor] = useState(() => new Date())

  const byDate = new Map<string, Task[]>()
  for (const t of tasks ?? []) {
    if (t.completed_at) continue
    const d = t.scheduled_date ?? t.due_date
    if (!d) continue
    const arr = byDate.get(d) ?? []
    arr.push(t)
    byDate.set(d, arr)
  }

  const monthStart = startOfMonth(cursor)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))
  const today = new Date()

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <h3 className="font-serif text-lg font-semibold tracking-tight">
          {format(cursor, "MMMM yyyy")}
        </h3>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setCursor(addMonths(cursor, -1))}
            className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date())}
            className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            Today
          </button>
          <button
            type="button"
            aria-label="Next month"
            onClick={() => setCursor(addMonths(cursor, 1))}
            className="flex size-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="bg-secondary/50 px-2 py-1.5 text-center text-xs font-medium text-muted-foreground"
          >
            {w}
          </div>
        ))}
        {days.map((day) => {
          const key = toDateStr(day)
          const dayTasks = byDate.get(key) ?? []
          const inMonth = isSameMonth(day, monthStart)
          const isToday = isSameDay(day, today)
          return (
            <div
              key={key}
              className={cn(
                "min-h-24 bg-card p-1.5 text-left align-top",
                !inMonth && "bg-card/40 text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "mb-1 flex size-5 items-center justify-center rounded-full text-xs tabular-nums",
                  isToday
                    ? "bg-primary font-medium text-primary-foreground"
                    : "text-muted-foreground",
                )}
              >
                {format(day, "d")}
              </div>
              <div className="space-y-0.5">
                {dayTasks.slice(0, 3).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => openPeek({ type: "task", id: t.id })}
                    className="block w-full truncate rounded bg-primary/10 px-1 py-0.5 text-left text-[0.6875rem] text-primary hover:bg-primary/20"
                  >
                    {t.title}
                  </button>
                ))}
                {dayTasks.length > 3 ? (
                  <p className="px-1 text-[0.625rem] text-muted-foreground">
                    +{dayTasks.length - 3} more
                  </p>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
