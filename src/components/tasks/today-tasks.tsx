"use client"

import { CheckSquare } from "lucide-react"
import { useTasks } from "@/lib/queries/tasks"
import { AddTask } from "./add-task"
import { TaskRow } from "./task-row"

export function TodayTasks() {
  const { data: tasks, isLoading } = useTasks()
  const open = tasks?.filter((t) => !t.completed_at) ?? []
  const done = tasks?.filter((t) => t.completed_at) ?? []

  return (
    <section className="mb-8">
      <div className="mb-2 flex items-center gap-2">
        <CheckSquare className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Tasks</h3>
        {open.length > 0 ? (
          <span className="tabular-nums text-xs text-muted-foreground">{open.length}</span>
        ) : null}
      </div>

      <div className="divide-y divide-border rounded-lg border border-border bg-card">
        {isLoading ? (
          <p className="px-3.5 py-3 text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            {open.map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
            <AddTask />
          </>
        )}
      </div>

      {done.length > 0 ? (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
            {done.length} completed
          </summary>
          <ul className="mt-2 divide-y divide-border rounded-lg border border-border bg-card">
            {done.slice(0, 20).map((t) => (
              <TaskRow key={t.id} task={t} />
            ))}
          </ul>
        </details>
      ) : null}
    </section>
  )
}
