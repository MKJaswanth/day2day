"use client"

import { Link2, Plus, X } from "lucide-react"
import { useMemo, useState } from "react"
import { useFollowUps } from "@/lib/queries/follow-ups"
import { useGoals } from "@/lib/queries/goals"
import { useLearningItems } from "@/lib/queries/learning"
import {
  type ItemType,
  type LinkRef,
  TYPE_LABEL,
  useAddLink,
  useRelatedItems,
  useRemoveLink,
} from "@/lib/queries/links"
import { useProjects } from "@/lib/queries/projects"
import { useTasks } from "@/lib/queries/tasks"
import { useUIStore } from "@/lib/ui-store"

const PEEKABLE: ItemType[] = ["task", "project", "follow_up", "learning_item", "goal"]

export function RelatedItems({ type, id }: { type: ItemType; id: string }) {
  const { data: related } = useRelatedItems(type, id)
  const add = useAddLink(type, id)
  const remove = useRemoveLink(type, id)
  const openPeek = useUIStore((s) => s.openPeek)
  const [picking, setPicking] = useState(false)
  const [query, setQuery] = useState("")

  const { data: tasks } = useTasks()
  const { data: projects } = useProjects()
  const { data: followUps } = useFollowUps()
  const { data: learning } = useLearningItems()
  const { data: goals } = useGoals()

  const candidates = useMemo<LinkRef[]>(() => {
    const all: LinkRef[] = [
      ...(tasks ?? []).map((t) => ({ type: "task" as const, id: t.id, label: t.title })),
      ...(projects ?? []).map((p) => ({ type: "project" as const, id: p.id, label: p.title })),
      ...(followUps ?? []).map((f) => ({ type: "follow_up" as const, id: f.id, label: f.who })),
      ...(learning ?? []).map((l) => ({
        type: "learning_item" as const,
        id: l.id,
        label: l.title,
      })),
      ...(goals ?? []).map((g) => ({ type: "goal" as const, id: g.id, label: g.title })),
    ]
    const linked = new Set((related ?? []).map((r) => `${r.ref.type}:${r.ref.id}`))
    const q = query.trim().toLowerCase()
    return all
      .filter((c) => !(c.type === type && c.id === id))
      .filter((c) => !linked.has(`${c.type}:${c.id}`))
      .filter((c) => (q ? c.label.toLowerCase().includes(q) : true))
      .slice(0, 8)
  }, [tasks, projects, followUps, learning, goals, related, type, id, query])

  function openRef(ref: LinkRef) {
    if (PEEKABLE.includes(ref.type)) {
      // PeekTarget shares the same type strings for peekable items.
      openPeek({ type: ref.type, id: ref.id } as Parameters<typeof openPeek>[0])
    }
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Related
        </p>
        <button
          type="button"
          onClick={() => setPicking((v) => !v)}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Plus className="size-3.5" /> Link
        </button>
      </div>

      {picking ? (
        <div className="mb-2 rounded-md border border-border bg-background p-2">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items to link…"
            className="mb-1 h-8 w-full rounded border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring"
          />
          <ul className="max-h-48 overflow-y-auto">
            {candidates.length === 0 ? (
              <li className="px-2 py-1.5 text-xs text-muted-foreground">No matches</li>
            ) : (
              candidates.map((c) => (
                <li key={`${c.type}:${c.id}`}>
                  <button
                    type="button"
                    onClick={() => {
                      add.mutate({ type: c.type, id: c.id })
                      setQuery("")
                      setPicking(false)
                    }}
                    className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary"
                  >
                    <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[0.625rem] uppercase text-muted-foreground">
                      {TYPE_LABEL[c.type]}
                    </span>
                    <span className="truncate">{c.label}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}

      {related && related.length > 0 ? (
        <ul className="space-y-1">
          {related.map((r) => (
            <li key={r.linkId} className="group flex items-center gap-2">
              <button
                type="button"
                onClick={() => openRef(r.ref)}
                className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary"
              >
                <Link2 className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[0.625rem] uppercase text-muted-foreground">
                  {TYPE_LABEL[r.ref.type]}
                </span>
                <span className="truncate">{r.ref.label}</span>
              </button>
              <button
                type="button"
                aria-label="Unlink"
                onClick={() => remove.mutate(r.linkId)}
                className="flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : !picking ? (
        <p className="text-sm text-muted-foreground">Nothing linked yet.</p>
      ) : null}
    </div>
  )
}
