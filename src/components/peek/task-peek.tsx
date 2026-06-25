"use client"

import { Check, Trash2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { RichText } from "@/components/editor/rich-text"
import { RelatedItems } from "@/components/peek/related-items"
import {
  type Recurrence,
  type Task,
  type TaskPriority,
  useAddTask,
  useDeleteTask,
  useSubtasks,
  useTasks,
  useToggleTask,
  useUpdateTask,
} from "@/lib/queries/tasks"
import { useUIStore } from "@/lib/ui-store"
import { cn } from "@/lib/utils"

const PRIORITIES: TaskPriority[] = ["none", "low", "medium", "high"]
const RECURRENCES: Recurrence[] = ["none", "daily", "weekly", "monthly"]

export function TaskPeek({ taskId }: { taskId: string }) {
  const { closePeek } = useUIStore()
  const { data: tasks } = useTasks()
  const task = tasks?.find((t) => t.id === taskId)
  const update = useUpdateTask()
  const del = useDeleteTask()
  const toggle = useToggleTask()

  const [title, setTitle] = useState(task?.title ?? "")
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset title when switching tasks (id)
  useEffect(() => setTitle(task?.title ?? ""), [task?.id, task?.title])

  // Debounced notes save.
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  function onNotesChange(json: unknown) {
    if (notesTimer.current) clearTimeout(notesTimer.current)
    notesTimer.current = setTimeout(() => {
      update.mutate({ id: taskId, patch: { notes: json as Task["notes"] } })
    }, 600)
  }

  if (!task) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Task not found.
      </div>
    )
  }

  const done = !!task.completed_at

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <button
          type="button"
          onClick={() => toggle(task)}
          aria-label={done ? "Mark incomplete" : "Mark complete"}
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
            done
              ? "border-primary bg-primary text-primary-foreground"
              : "border-muted-foreground/40 text-transparent hover:border-primary",
          )}
        >
          <Check className="size-3" />
        </button>
        <span className="flex-1 text-xs text-muted-foreground">Task</span>
        <button
          type="button"
          aria-label="Delete task"
          onClick={() => {
            del.mutate(taskId)
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
        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => {
            if (title.trim() && title !== task.title)
              update.mutate({ id: taskId, patch: { title: title.trim() } })
          }}
          className={cn(
            "w-full bg-transparent font-serif text-lg font-semibold tracking-tight outline-none",
            done && "text-muted-foreground line-through",
          )}
        />

        {/* Meta fields */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Scheduled">
            <DateInput
              value={task.scheduled_date}
              onChange={(v) => update.mutate({ id: taskId, patch: { scheduled_date: v } })}
            />
          </Field>
          <Field label="Due">
            <DateInput
              value={task.due_date}
              onChange={(v) => update.mutate({ id: taskId, patch: { due_date: v } })}
            />
          </Field>
          <Field label="Priority">
            <select
              value={task.priority}
              onChange={(e) =>
                update.mutate({ id: taskId, patch: { priority: e.target.value as TaskPriority } })
              }
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm capitalize outline-none focus-visible:border-ring"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Repeat">
            <select
              value={task.recurrence_rule ?? "none"}
              onChange={(e) =>
                update.mutate({
                  id: taskId,
                  patch: { recurrence_rule: e.target.value === "none" ? null : e.target.value },
                })
              }
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm capitalize outline-none focus-visible:border-ring"
            >
              {RECURRENCES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* Subtasks */}
        <Subtasks parentId={taskId} />

        <RelatedItems type="task" id={taskId} />

        {/* Notes */}
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Notes
          </p>
          <RichText content={task.notes} onChange={onNotesChange} placeholder="Add details…" />
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}

function DateInput({
  value,
  onChange,
}: {
  value: string | null
  onChange: (v: string | null) => void
}) {
  return (
    <input
      type="date"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring"
    />
  )
}

function Subtasks({ parentId }: { parentId: string }) {
  const { data: subtasks } = useSubtasks(parentId)
  const add = useAddTask()
  const update = useUpdateTask()
  const [value, setValue] = useState("")

  return (
    <div>
      <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Subtasks
      </p>
      <ul className="space-y-1">
        {subtasks?.map((s) => (
          <li key={s.id} className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() =>
                update.mutate({
                  id: s.id,
                  patch: { completed_at: s.completed_at ? null : new Date().toISOString() },
                })
              }
              aria-label="Toggle subtask"
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                s.completed_at
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/40 text-transparent hover:border-primary",
              )}
            >
              <Check className="size-2.5" />
            </button>
            <span className={cn(s.completed_at && "text-muted-foreground line-through")}>
              {s.title}
            </span>
          </li>
        ))}
      </ul>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) {
            add.mutate({ title: value.trim(), parentTaskId: parentId })
            setValue("")
          }
        }}
        placeholder="Add a subtask…"
        className="mt-2 h-8 w-full rounded-md border border-input bg-background px-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring"
      />
    </div>
  )
}
