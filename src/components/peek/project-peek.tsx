"use client"

import { AlertCircle, Check, Trash2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { RichText } from "@/components/editor/rich-text"
import { RelatedItems } from "@/components/peek/related-items"
import { useAreas } from "@/lib/queries/areas"
import { useGoals } from "@/lib/queries/goals"
import {
  type Project,
  type ProjectStatus,
  useAddProjectTask,
  useDeleteProject,
  useProjects,
  useProjectTasks,
  useToggleProjectTask,
  useUpdateProject,
} from "@/lib/queries/projects"
import { useUIStore } from "@/lib/ui-store"
import { cn } from "@/lib/utils"

const STATUSES: ProjectStatus[] = ["active", "on_hold", "someday", "completed", "archived"]
const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: "Active",
  on_hold: "On hold",
  someday: "Someday",
  completed: "Completed",
  archived: "Archived",
}

export function ProjectPeek({ projectId }: { projectId: string }) {
  const { closePeek } = useUIStore()
  const { data: projects } = useProjects()
  const project = projects?.find((p) => p.id === projectId)
  const { data: tasks } = useProjectTasks(projectId)
  const { data: areas } = useAreas()
  const { data: goals } = useGoals()
  const update = useUpdateProject()
  const del = useDeleteProject()
  const addTask = useAddProjectTask(projectId)
  const toggleTask = useToggleProjectTask(projectId)

  const [title, setTitle] = useState(project?.title ?? "")
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on project switch (id)
  useEffect(() => setTitle(project?.title ?? ""), [project?.id, project?.title])
  const [newTask, setNewTask] = useState("")

  const logTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  function onLogChange(json: unknown) {
    if (logTimer.current) clearTimeout(logTimer.current)
    logTimer.current = setTimeout(() => {
      update.mutate({ id: projectId, patch: { log: json as Project["log"] } })
    }, 600)
  }

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Project not found.
      </div>
    )
  }

  const open = tasks?.filter((t) => !t.completed_at) ?? []
  const total = tasks?.length ?? 0
  const done = total - open.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const needsNextAction =
    project.status === "active" && !project.next_action_task_id && open.length > 0
  const nextActionOptions = open

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="flex-1 text-xs text-muted-foreground">Project</span>
        <button
          type="button"
          aria-label="Delete project"
          onClick={() => {
            del.mutate(projectId)
            closePeek()
          }}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Close"
          onClick={closePeek}
          className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            if (title.trim() && title !== project.title)
              update.mutate({ id: projectId, patch: { title: title.trim() } })
          }}
          className="w-full bg-transparent font-serif text-lg font-semibold tracking-tight outline-none"
        />

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Status
            </span>
            <select
              value={project.status}
              onChange={(e) =>
                update.mutate({ id: projectId, patch: { status: e.target.value as ProjectStatus } })
              }
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Target date
            </span>
            <input
              type="date"
              value={project.target_date ?? ""}
              onChange={(e) =>
                update.mutate({ id: projectId, patch: { target_date: e.target.value || null } })
              }
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Area
            </span>
            <select
              value={project.area_id ?? ""}
              onChange={(e) =>
                update.mutate({ id: projectId, patch: { area_id: e.target.value || null } })
              }
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring"
            >
              <option value="">— None —</option>
              {areas?.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Goal
            </span>
            <select
              value={project.goal_id ?? ""}
              onChange={(e) =>
                update.mutate({ id: projectId, patch: { goal_id: e.target.value || null } })
              }
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring"
            >
              <option value="">— None —</option>
              {goals?.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Next action */}
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Next action
            {needsNextAction ? (
              <span className="flex items-center gap-1 normal-case text-warning">
                <AlertCircle className="size-3" /> none set
              </span>
            ) : null}
          </p>
          <select
            value={project.next_action_task_id ?? ""}
            onChange={(e) =>
              update.mutate({
                id: projectId,
                patch: { next_action_task_id: e.target.value || null },
              })
            }
            className={cn(
              "h-9 w-full rounded-md border bg-background px-2 text-sm outline-none focus-visible:border-ring",
              needsNextAction ? "border-warning/60" : "border-input",
            )}
          >
            <option value="">— Choose the next action —</option>
            {nextActionOptions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* Progress */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium uppercase tracking-wider text-muted-foreground">
              Progress
            </span>
            <span className="tabular-nums text-muted-foreground">
              {done}/{total}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Tasks */}
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Tasks
          </p>
          <ul className="space-y-1">
            {tasks?.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm">
                <button
                  type="button"
                  aria-label="Toggle task"
                  onClick={() => toggleTask.mutate(t)}
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                    t.completed_at
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/40 text-transparent hover:border-primary",
                  )}
                >
                  <Check className="size-2.5" />
                </button>
                <span className={cn(t.completed_at && "text-muted-foreground line-through")}>
                  {t.title}
                </span>
              </li>
            ))}
          </ul>
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newTask.trim()) {
                addTask.mutate(newTask.trim())
                setNewTask("")
              }
            }}
            placeholder="Add a task to this project…"
            className="mt-2 h-8 w-full rounded-md border border-input bg-background px-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring"
          />
        </div>

        <RelatedItems type="project" id={projectId} />

        {/* Log */}
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Log
          </p>
          <RichText
            content={project.log}
            onChange={onLogChange}
            placeholder="Project notes & log…"
          />
        </div>
      </div>
    </div>
  )
}
