"use client"

import { AlertCircle, Columns3, FolderKanban, List, Plus } from "lucide-react"
import { useState } from "react"
import { ProjectsBoard } from "@/components/projects/projects-board"
import { useAreas } from "@/lib/queries/areas"
import {
  type Project,
  type ProjectStatus,
  useAddProject,
  useProjects,
  useProjectTasks,
} from "@/lib/queries/projects"
import { useUIStore } from "@/lib/ui-store"
import { cn } from "@/lib/utils"

const STATUS_STYLE: Record<ProjectStatus, string> = {
  active: "bg-primary/10 text-primary",
  on_hold: "bg-warning/15 text-warning",
  someday: "bg-secondary text-muted-foreground",
  completed: "bg-success/15 text-success",
  archived: "bg-secondary text-muted-foreground",
}
const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: "Active",
  on_hold: "On hold",
  someday: "Someday",
  completed: "Completed",
  archived: "Archived",
}

function ProjectCard({ project }: { project: Project }) {
  const { data: tasks } = useProjectTasks(project.id)
  const openPeek = useUIStore((s) => s.openPeek)
  const total = tasks?.length ?? 0
  const done = (tasks ?? []).filter((t) => t.completed_at).length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const openCount = total - done
  const needsNextAction =
    project.status === "active" && !project.next_action_task_id && openCount > 0

  return (
    <button
      type="button"
      onClick={() => openPeek({ type: "project", id: project.id })}
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-muted-foreground/30"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif text-base font-semibold leading-tight">{project.title}</h3>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
            STATUS_STYLE[project.status],
          )}
        >
          {STATUS_LABEL[project.status]}
        </span>
      </div>

      {needsNextAction ? (
        <span className="flex items-center gap-1 text-xs text-warning">
          <AlertCircle className="size-3" /> No next action set
        </span>
      ) : null}

      <div className="mt-auto">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>{total > 0 ? `${done}/${total} tasks` : "No tasks yet"}</span>
          {project.target_date ? (
            <span className="tabular-nums">
              {new Date(`${project.target_date}T00:00:00`).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          ) : null}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </button>
  )
}

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects()
  const { data: areas } = useAreas()
  const add = useAddProject()
  const [value, setValue] = useState("")
  const [view, setView] = useState<"list" | "board">("list")
  const [areaId, setAreaId] = useState<string | null>(null)

  function submit() {
    if (!value.trim()) return
    add.mutate({ title: value.trim() })
    setValue("")
  }

  return (
    <div className={cn("px-6 py-8", view === "board" ? "max-w-none" : "mx-auto max-w-3xl")}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-tight">Projects</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Outcomes you're driving. Each should have a clear next action.
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
            aria-label="Board view"
            onClick={() => setView("board")}
            className={cn(
              "flex size-7 items-center justify-center rounded",
              view === "board" ? "bg-secondary text-foreground" : "text-muted-foreground",
            )}
          >
            <Columns3 className="size-4" />
          </button>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 py-2.5">
        <Plus className="size-[18px] shrink-0 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit()
          }}
          placeholder="New project…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {areas && areas.length > 0 ? (
        <div className="mb-5 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setAreaId(null)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs transition-colors",
              areaId === null
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </button>
          {areas.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAreaId(a.id)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs transition-colors",
                areaId === a.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground",
              )}
            >
              {a.name}
            </button>
          ))}
        </div>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !projects || projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
            <FolderKanban className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-4 font-medium">No projects yet</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Create one above to start grouping tasks, follow-ups, and learning toward an outcome.
          </p>
        </div>
      ) : view === "board" ? (
        <ProjectsBoard areaId={areaId} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {projects
            .filter((p) => !areaId || p.area_id === areaId)
            .map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
        </div>
      )}
    </div>
  )
}
