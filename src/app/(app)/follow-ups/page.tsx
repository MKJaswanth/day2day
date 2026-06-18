"use client"

import { ArrowRightCircle, Check, Clock, Plus } from "lucide-react"
import { useState } from "react"
import { todayStr } from "@/lib/dates"
import {
  type FollowUp,
  useAddFollowUp,
  useConvertFollowUpToTask,
  useFollowUps,
  useUpdateFollowUp,
} from "@/lib/queries/follow-ups"
import { useUIStore } from "@/lib/ui-store"
import { cn } from "@/lib/utils"

function daysSince(date: string) {
  const ms = Date.now() - new Date(`${date}T00:00:00`).getTime()
  return Math.max(0, Math.floor(ms / 86400000))
}
function isOverdue(f: FollowUp) {
  return f.status === "open" && f.nudge_date != null && f.nudge_date < todayStr()
}

function Row({ f }: { f: FollowUp }) {
  const openPeek = useUIStore((s) => s.openPeek)
  const update = useUpdateFollowUp()
  const convert = useConvertFollowUpToTask()
  const overdue = isOverdue(f)
  const age = daysSince(f.since_date)

  return (
    <li className="group flex items-center gap-3 px-3.5 py-3">
      <span
        className={cn("size-1.5 shrink-0 rounded-full", overdue ? "bg-destructive" : "bg-warning")}
      />
      <button
        type="button"
        onClick={() => openPeek({ type: "follow_up", id: f.id })}
        className="min-w-0 flex-1 text-left"
      >
        <span className="text-sm">{f.who}</span>
        <span className="ml-2 text-xs text-muted-foreground">
          waiting {age}d{age === 1 ? "" : ""}
        </span>
      </button>

      {f.nudge_date ? (
        <span
          className={cn(
            "flex shrink-0 items-center gap-1 text-xs tabular-nums",
            overdue ? "font-medium text-destructive" : "text-muted-foreground",
          )}
        >
          <Clock className="size-3" />
          {overdue ? "overdue" : "nudge"}{" "}
          {new Date(`${f.nudge_date}T00:00:00`).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </span>
      ) : null}

      <button
        type="button"
        aria-label="Convert to task"
        onClick={() => convert.mutate(f)}
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-foreground group-hover:opacity-100"
      >
        <ArrowRightCircle className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Resolve"
        onClick={() => update.mutate({ id: f.id, patch: { status: "resolved" } })}
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-success group-hover:opacity-100"
      >
        <Check className="size-4" />
      </button>
    </li>
  )
}

export default function FollowUpsPage() {
  const { data: followUps, isLoading } = useFollowUps()
  const add = useAddFollowUp()
  const [value, setValue] = useState("")

  function submit() {
    if (!value.trim()) return
    add.mutate({ who: value.trim(), sinceDate: todayStr() })
    setValue("")
  }

  const open = (followUps ?? []).filter((f) => f.status === "open")
  const closed = (followUps ?? []).filter((f) => f.status !== "open")
  // Overdue first, then oldest.
  open.sort((a, b) => {
    if (isOverdue(a) !== isOverdue(b)) return isOverdue(a) ? -1 : 1
    return a.since_date.localeCompare(b.since_date)
  })

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">Follow-ups</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything you're waiting on. Overdue nudges rise to the top.
        </p>
      </div>

      <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 py-2.5">
        <Plus className="size-[18px] shrink-0 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit()
          }}
          placeholder="Who / what are you waiting on?"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : open.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
            <Check className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-4 font-medium">Nothing outstanding</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Add anyone you're waiting on above so it never slips your mind.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {open.map((f) => (
            <Row key={f.id} f={f} />
          ))}
        </ul>
      )}

      {closed.length > 0 ? (
        <details className="mt-4">
          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
            {closed.length} resolved / dropped
          </summary>
          <ul className="mt-2 divide-y divide-border rounded-lg border border-border bg-card opacity-70">
            {closed.map((f) => (
              <Row key={f.id} f={f} />
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  )
}
