"use client"

import { BookOpen, FolderKanban, Trash2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { RichText } from "@/components/editor/rich-text"
import { RelatedItems } from "@/components/peek/related-items"
import { useAreas } from "@/lib/queries/areas"
import {
  type Goal,
  useDeleteGoal,
  useGoalLearning,
  useGoalProjects,
  useGoals,
  useUpdateGoal,
} from "@/lib/queries/goals"
import { useUIStore } from "@/lib/ui-store"

export function GoalPeek({ goalId }: { goalId: string }) {
  const { closePeek, openPeek } = useUIStore()
  const { data: goals } = useGoals()
  const goal = goals?.find((g) => g.id === goalId)
  const { data: areas } = useAreas()
  const { data: projects } = useGoalProjects(goalId)
  const { data: learning } = useGoalLearning(goalId)
  const update = useUpdateGoal()
  const del = useDeleteGoal()

  const [title, setTitle] = useState(goal?.title ?? "")
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on switch (id)
  useEffect(() => setTitle(goal?.title ?? ""), [goal?.id, goal?.title])

  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  function onNotesChange(json: unknown) {
    if (notesTimer.current) clearTimeout(notesTimer.current)
    notesTimer.current = setTimeout(() => {
      update.mutate({ id: goalId, patch: { notes: json as Goal["notes"] } })
    }, 600)
  }

  if (!goal) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Goal not found.
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="flex-1 text-xs text-muted-foreground">Goal</span>
        <button
          type="button"
          aria-label="Delete goal"
          onClick={() => {
            del.mutate(goalId)
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
            if (title.trim() && title !== goal.title)
              update.mutate({ id: goalId, patch: { title: title.trim() } })
          }}
          className="w-full bg-transparent font-serif text-lg font-semibold tracking-tight outline-none"
        />

        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Area of life
          </span>
          <select
            value={goal.area_id ?? ""}
            onChange={(e) =>
              update.mutate({ id: goalId, patch: { area_id: e.target.value || null } })
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
        </div>

        {/* Connected projects (rolled up) */}
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Connected projects
          </p>
          {projects && projects.length > 0 ? (
            <ul className="space-y-1">
              {projects.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => openPeek({ type: "project", id: p.id })}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary"
                  >
                    <FolderKanban className="size-3.5 text-muted-foreground" />
                    {p.title}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Link projects to this goal from a project's panel.
            </p>
          )}
        </div>

        {learning && learning.length > 0 ? (
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Connected learning
            </p>
            <ul className="space-y-1">
              {learning.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => openPeek({ type: "learning_item", id: l.id })}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary"
                  >
                    <BookOpen className="size-3.5 text-muted-foreground" />
                    {l.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <RelatedItems type="goal" id={goalId} />

        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Notes
          </p>
          <RichText
            content={goal.notes}
            onChange={onNotesChange}
            placeholder="What does success look like?"
          />
        </div>
      </div>
    </div>
  )
}
