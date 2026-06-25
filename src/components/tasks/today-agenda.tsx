"use client"

import { AlertCircle, BookOpen, CheckSquare, Clock, FolderKanban } from "lucide-react"
import { todayStr } from "@/lib/dates"
import { useFollowUps } from "@/lib/queries/follow-ups"
import { useLearningItems } from "@/lib/queries/learning"
import { useProjects } from "@/lib/queries/projects"
import { useTasks } from "@/lib/queries/tasks"
import { useUIStore } from "@/lib/ui-store"
import { AddTask } from "./add-task"
import { TaskRow } from "./task-row"

function SectionHead({
  icon: Icon,
  label,
  count,
}: {
  icon: typeof Clock
  label: string
  count?: number
}) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <Icon className="size-4 text-muted-foreground" />
      <h3 className="text-sm font-medium">{label}</h3>
      {count ? <span className="tabular-nums text-xs text-muted-foreground">{count}</span> : null}
    </div>
  )
}

export function TodayAgenda() {
  const t = todayStr()
  const { data: tasks } = useTasks()
  const { data: followUps } = useFollowUps()
  const { data: learning } = useLearningItems()
  const { data: projects } = useProjects()
  const openPeek = useUIStore((s) => s.openPeek)

  // Tasks scheduled for today or earlier, or due today or earlier — not done.
  const todayTasks = (tasks ?? []).filter(
    (task) =>
      !task.completed_at &&
      ((task.scheduled_date != null && task.scheduled_date <= t) ||
        (task.due_date != null && task.due_date <= t)),
  )
  const doneToday = (tasks ?? []).filter(
    (task) => task.completed_at != null && task.completed_at.slice(0, 10) === t,
  )

  const dueFollowUps = (followUps ?? []).filter(
    (f) => f.status === "open" && f.nudge_date != null && f.nudge_date <= t,
  )
  const inProgressLearning = (learning ?? []).filter((l) => l.status === "in_progress")
  const activeProjects = (projects ?? []).filter((p) => p.status === "active")

  return (
    <div className="space-y-8">
      <section>
        <SectionHead icon={CheckSquare} label="Tasks" count={todayTasks.length} />
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {todayTasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
          <AddTask scheduledToday />
        </div>
        {doneToday.length > 0 ? (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
              {doneToday.length} completed today
            </summary>
            <ul className="mt-2 divide-y divide-border rounded-lg border border-border bg-card">
              {doneToday.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </ul>
          </details>
        ) : null}
      </section>

      {dueFollowUps.length > 0 ? (
        <section>
          <SectionHead icon={Clock} label="Follow-ups due" count={dueFollowUps.length} />
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {dueFollowUps.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => openPeek({ type: "follow_up", id: f.id })}
                  className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-warning" />
                  <span className="flex-1 text-sm">{f.who}</span>
                  <span className="text-xs text-muted-foreground">nudge due</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {activeProjects.length > 0 ? (
        <section>
          <SectionHead icon={FolderKanban} label="Active projects" count={activeProjects.length} />
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {activeProjects.map((p) => {
              const needsNextAction = !p.next_action_task_id
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => openPeek({ type: "project", id: p.id })}
                    className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left"
                  >
                    <FolderKanban className="size-4 shrink-0 text-muted-foreground/60" />
                    <span className="flex-1 text-sm">{p.title}</span>
                    {needsNextAction ? (
                      <span className="flex items-center gap-1 text-xs text-warning">
                        <AlertCircle className="size-3" /> no next action
                      </span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}

      {inProgressLearning.length > 0 ? (
        <section>
          <SectionHead icon={BookOpen} label="Learning in progress" />
          <ul className="divide-y divide-border rounded-lg border border-border bg-card">
            {inProgressLearning.map((l) => {
              const pct =
                l.progress_total && l.progress_total > 0
                  ? Math.round((l.progress_current / l.progress_total) * 100)
                  : null
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => openPeek({ type: "learning_item", id: l.id })}
                    className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left"
                  >
                    <BookOpen className="size-4 shrink-0 text-muted-foreground/60" />
                    <span className="flex-1 text-sm">{l.title}</span>
                    {pct != null ? (
                      <span className="tabular-nums text-xs text-muted-foreground">{pct}%</span>
                    ) : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
