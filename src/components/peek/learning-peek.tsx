"use client"

import { Trash2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { RichText } from "@/components/editor/rich-text"
import { RelatedItems } from "@/components/peek/related-items"
import { useGoals } from "@/lib/queries/goals"
import {
  type LearningItem,
  type LearningStatus,
  type LearningType,
  useDeleteLearningItem,
  useLearningItems,
  useUpdateLearningItem,
} from "@/lib/queries/learning"
import { useProjects } from "@/lib/queries/projects"
import { useUIStore } from "@/lib/ui-store"

const TYPES: LearningType[] = ["course", "book", "topic", "skill"]
const STATUSES: LearningStatus[] = ["queued", "in_progress", "completed", "paused", "dropped"]
const STATUS_LABEL: Record<LearningStatus, string> = {
  queued: "Queued",
  in_progress: "In progress",
  completed: "Completed",
  paused: "Paused",
  dropped: "Dropped",
}

export function LearningPeek({ itemId }: { itemId: string }) {
  const { closePeek } = useUIStore()
  const { data: items } = useLearningItems()
  const item = items?.find((l) => l.id === itemId)
  const { data: projects } = useProjects()
  const { data: goals } = useGoals()
  const update = useUpdateLearningItem()
  const del = useDeleteLearningItem()

  const [title, setTitle] = useState(item?.title ?? "")
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on switch (id)
  useEffect(() => setTitle(item?.title ?? ""), [item?.id, item?.title])

  const reflTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  function onReflectionsChange(json: unknown) {
    if (reflTimer.current) clearTimeout(reflTimer.current)
    reflTimer.current = setTimeout(() => {
      update.mutate({ id: itemId, patch: { reflections: json as LearningItem["reflections"] } })
    }, 600)
  }

  if (!item) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Learning item not found.
      </div>
    )
  }

  const pct =
    item.progress_total && item.progress_total > 0
      ? Math.round((item.progress_current / item.progress_total) * 100)
      : null

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="flex-1 text-xs text-muted-foreground">Learning</span>
        <button
          type="button"
          aria-label="Delete"
          onClick={() => {
            del.mutate(itemId)
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
            if (title.trim() && title !== item.title)
              update.mutate({ id: itemId, patch: { title: title.trim() } })
          }}
          className="w-full bg-transparent font-serif text-lg font-semibold tracking-tight outline-none"
        />

        <div className="grid grid-cols-2 gap-3">
          <Labeled label="Type">
            <select
              value={item.type}
              onChange={(e) =>
                update.mutate({ id: itemId, patch: { type: e.target.value as LearningType } })
              }
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm capitalize outline-none focus-visible:border-ring"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Labeled>
          <Labeled label="Status">
            <select
              value={item.status}
              onChange={(e) =>
                update.mutate({ id: itemId, patch: { status: e.target.value as LearningStatus } })
              }
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </Labeled>
        </div>

        <Labeled label="Source">
          <input
            defaultValue={item.source ?? ""}
            onBlur={(e) => update.mutate({ id: itemId, patch: { source: e.target.value || null } })}
            placeholder="URL, author, platform…"
            className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring"
          />
        </Labeled>

        {/* Progress */}
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Progress
          </p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={item.progress_current}
              onChange={(e) =>
                update.mutate({
                  id: itemId,
                  patch: {
                    progress_current: Number(e.target.value) || 0,
                    last_progress_at: new Date().toISOString(),
                  },
                })
              }
              className="h-9 w-16 rounded-md border border-input bg-background px-2 text-sm tabular-nums outline-none focus-visible:border-ring"
            />
            <span className="text-sm text-muted-foreground">of</span>
            <input
              type="number"
              min={0}
              defaultValue={item.progress_total ?? ""}
              onBlur={(e) =>
                update.mutate({
                  id: itemId,
                  patch: { progress_total: e.target.value ? Number(e.target.value) : null },
                })
              }
              className="h-9 w-16 rounded-md border border-input bg-background px-2 text-sm tabular-nums outline-none focus-visible:border-ring"
            />
            <input
              defaultValue={item.progress_unit ?? ""}
              onBlur={(e) =>
                update.mutate({ id: itemId, patch: { progress_unit: e.target.value || null } })
              }
              placeholder="chapters, %, modules…"
              className="h-9 flex-1 rounded-md border border-input bg-background px-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring"
            />
          </div>
          {pct != null ? (
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          ) : null}
        </div>

        <Labeled label="Project">
          <select
            value={item.project_id ?? ""}
            onChange={(e) =>
              update.mutate({ id: itemId, patch: { project_id: e.target.value || null } })
            }
            className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring"
          >
            <option value="">— None —</option>
            {projects?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </Labeled>

        <Labeled label="Goal">
          <select
            value={item.goal_id ?? ""}
            onChange={(e) =>
              update.mutate({ id: itemId, patch: { goal_id: e.target.value || null } })
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
        </Labeled>

        <RelatedItems type="learning_item" id={itemId} />

        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Reflections & takeaways
          </p>
          <RichText
            content={item.reflections}
            onChange={onReflectionsChange}
            placeholder="What are you learning?"
          />
        </div>
      </div>
    </div>
  )
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  )
}
