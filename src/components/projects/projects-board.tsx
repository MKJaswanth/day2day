"use client"

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { AlertCircle } from "lucide-react"
import {
  type Project,
  type ProjectStatus,
  useProjects,
  useUpdateProject,
} from "@/lib/queries/projects"
import { useUIStore } from "@/lib/ui-store"
import { cn } from "@/lib/utils"

const COLUMNS: { status: ProjectStatus; label: string }[] = [
  { status: "active", label: "Active" },
  { status: "on_hold", label: "On hold" },
  { status: "someday", label: "Someday" },
  { status: "completed", label: "Completed" },
]

function Card({ project }: { project: Project }) {
  const openPeek = useUIStore((s) => s.openPeek)
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: project.id,
  })
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 50 }
    : undefined
  const needsNextAction = project.status === "active" && !project.next_action_task_id

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => openPeek({ type: "project", id: project.id })}
      className={cn(
        "cursor-grab touch-none rounded-md border border-border bg-card p-3 shadow-sm transition-shadow active:cursor-grabbing",
        isDragging && "opacity-60 shadow-lg",
      )}
    >
      <p className="font-serif text-sm font-semibold leading-snug">{project.title}</p>
      {needsNextAction ? (
        <span className="mt-1.5 flex items-center gap-1 text-xs text-warning">
          <AlertCircle className="size-3" /> No next action
        </span>
      ) : null}
    </div>
  )
}

function Column({
  status,
  label,
  projects,
}: {
  status: ProjectStatus
  label: string
  projects: Project[]
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-64 shrink-0 flex-col gap-2 rounded-lg border border-border bg-secondary/30 p-2 transition-colors",
        isOver && "ring-2 ring-primary/40",
      )}
    >
      <div className="flex items-center gap-2 px-1 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
        <span className="tabular-nums">{projects.length}</span>
      </div>
      {projects.map((p) => (
        <Card key={p.id} project={p} />
      ))}
    </div>
  )
}

export function ProjectsBoard() {
  const { data: projects } = useProjects()
  const update = useUpdateProject()
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function onDragEnd(e: DragEndEvent) {
    const status = e.over?.id as ProjectStatus | undefined
    const id = e.active.id as string
    if (!status) return
    const proj = projects?.find((p) => p.id === id)
    if (proj && proj.status !== status) update.mutate({ id, patch: { status } })
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {COLUMNS.map((c) => (
          <Column
            key={c.status}
            status={c.status}
            label={c.label}
            projects={(projects ?? []).filter((p) => p.status === c.status)}
          />
        ))}
      </div>
    </DndContext>
  )
}
