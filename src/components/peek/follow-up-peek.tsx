"use client"

import { ArrowRightCircle, Trash2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { RichText } from "@/components/editor/rich-text"
import { RelatedItems } from "@/components/peek/related-items"
import {
  type FollowUp,
  type FollowUpStatus,
  useConvertFollowUpToTask,
  useDeleteFollowUp,
  useFollowUps,
  useUpdateFollowUp,
} from "@/lib/queries/follow-ups"
import { useProjects } from "@/lib/queries/projects"
import { useUIStore } from "@/lib/ui-store"

const STATUSES: FollowUpStatus[] = ["open", "resolved", "dropped"]

export function FollowUpPeek({ followUpId }: { followUpId: string }) {
  const { closePeek } = useUIStore()
  const { data: followUps } = useFollowUps()
  const followUp = followUps?.find((f) => f.id === followUpId)
  const { data: projects } = useProjects()
  const update = useUpdateFollowUp()
  const del = useDeleteFollowUp()
  const convert = useConvertFollowUpToTask()

  const [who, setWho] = useState(followUp?.who ?? "")
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset on switch (id)
  useEffect(() => setWho(followUp?.who ?? ""), [followUp?.id, followUp?.who])

  const ctxTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  function onContextChange(json: unknown) {
    if (ctxTimer.current) clearTimeout(ctxTimer.current)
    ctxTimer.current = setTimeout(() => {
      update.mutate({ id: followUpId, patch: { context: json as FollowUp["context"] } })
    }, 600)
  }

  if (!followUp) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Follow-up not found.
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="flex-1 text-xs text-muted-foreground">Follow-up</span>
        <button
          type="button"
          onClick={() => {
            convert.mutate(followUp)
            closePeek()
          }}
          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ArrowRightCircle className="size-3.5" /> Convert to task
        </button>
        <button
          type="button"
          aria-label="Delete follow-up"
          onClick={() => {
            del.mutate(followUpId)
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
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Waiting on
          </p>
          <input
            value={who}
            onChange={(e) => setWho(e.target.value)}
            onBlur={() => {
              if (who.trim() && who !== followUp.who)
                update.mutate({ id: followUpId, patch: { who: who.trim() } })
            }}
            className="w-full bg-transparent font-serif text-lg font-semibold tracking-tight outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Since
            </span>
            <input
              type="date"
              value={followUp.since_date}
              onChange={(e) =>
                e.target.value &&
                update.mutate({ id: followUpId, patch: { since_date: e.target.value } })
              }
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Nudge date
            </span>
            <input
              type="date"
              value={followUp.nudge_date ?? ""}
              onChange={(e) =>
                update.mutate({ id: followUpId, patch: { nudge_date: e.target.value || null } })
              }
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Status
            </span>
            <select
              value={followUp.status}
              onChange={(e) =>
                update.mutate({
                  id: followUpId,
                  patch: { status: e.target.value as FollowUpStatus },
                })
              }
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm capitalize outline-none focus-visible:border-ring"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Project
            </span>
            <select
              value={followUp.project_id ?? ""}
              onChange={(e) =>
                update.mutate({ id: followUpId, patch: { project_id: e.target.value || null } })
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
          </label>
        </div>

        <RelatedItems type="follow_up" id={followUpId} />

        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Context
          </p>
          <RichText
            content={followUp.context}
            onChange={onContextChange}
            placeholder="What are you waiting for?"
          />
        </div>
      </div>
    </div>
  )
}
