"use client"

import { CalendarClock, CalendarDays, List } from "lucide-react"
import { useState } from "react"
import { CalendarView } from "@/components/tasks/calendar-view"
import { TaskRow } from "@/components/tasks/task-row"
import { toDateStr } from "@/lib/dates"
import { type Task, useTasks } from "@/lib/queries/tasks"
import { cn } from "@/lib/utils"

function effectiveDate(t: Task): string | null {
  return t.scheduled_date ?? t.due_date
}

function addDays(base: Date, days: number) {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

export default function UpcomingPage() {
  const { data: tasks } = useTasks()
  const [view, setView] = useState<"list" | "calendar">("list")
  const today = new Date()
  const todayStr = toDateStr(today)

  const dated = (tasks ?? [])
    .filter((t) => !t.completed_at && effectiveDate(t) != null)
    .sort((a, b) => (effectiveDate(a) as string).localeCompare(effectiveDate(b) as string))

  // Build the next 7 day-buckets plus Overdue and Later.
  const dayKeys = Array.from({ length: 7 }, (_, i) => toDateStr(addDays(today, i)))
  const lastDay = dayKeys[dayKeys.length - 1]

  function labelFor(key: string, idx: number) {
    if (idx === 0) return "Today"
    if (idx === 1) return "Tomorrow"
    return new Date(`${key}T00:00:00`).toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    })
  }

  const overdue = dated.filter((t) => (effectiveDate(t) as string) < todayStr)
  const later = dated.filter((t) => (effectiveDate(t) as string) > lastDay)

  const groups: { label: string; tasks: Task[] }[] = []
  if (overdue.length) groups.push({ label: "Overdue", tasks: overdue })
  dayKeys.forEach((key, idx) => {
    const dayTasks = dated.filter((t) => effectiveDate(t) === key)
    if (dayTasks.length) groups.push({ label: labelFor(key, idx), tasks: dayTasks })
  })
  if (later.length) groups.push({ label: "Later", tasks: later })

  return (
    <div className={cn("px-6 py-8", view === "calendar" ? "max-w-none" : "mx-auto max-w-2xl")}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-tight">Upcoming</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {view === "list"
              ? "The week ahead. Hover a task to defer it a day or a week."
              : "Your scheduled and due items, by month."}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1 rounded-md border border-border p-0.5">
          <button
            type="button"
            aria-label="List view"
            onClick={() => setView("list")}
            className={cn(
              "flex size-7 items-center justify-center rounded",
              view === "list" ? "bg-secondary text-foreground" : "text-muted-foreground",
            )}
          >
            <List className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Calendar view"
            onClick={() => setView("calendar")}
            className={cn(
              "flex size-7 items-center justify-center rounded",
              view === "calendar" ? "bg-secondary text-foreground" : "text-muted-foreground",
            )}
          >
            <CalendarDays className="size-4" />
          </button>
        </div>
      </div>

      {view === "calendar" ? (
        <CalendarView />
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
            <CalendarClock className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-4 font-medium">Nothing scheduled</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Give tasks a scheduled or due date and they'll line up here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => (
            <section key={g.label}>
              <div className="mb-2 flex items-center gap-2">
                <h3
                  className={
                    g.label === "Overdue"
                      ? "text-sm font-medium text-destructive"
                      : "text-sm font-medium"
                  }
                >
                  {g.label}
                </h3>
                <span className="tabular-nums text-xs text-muted-foreground">{g.tasks.length}</span>
              </div>
              <ul className="divide-y divide-border rounded-lg border border-border bg-card">
                {g.tasks.map((t) => (
                  <TaskRow key={t.id} task={t} showDefer />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
