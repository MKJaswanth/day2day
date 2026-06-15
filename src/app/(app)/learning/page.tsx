"use client"

import { BookOpen, Plus } from "lucide-react"
import { useState } from "react"
import {
  type LearningItem,
  type LearningStatus,
  useAddLearningItem,
  useLearningItems,
} from "@/lib/queries/learning"
import { useUIStore } from "@/lib/ui-store"
import { cn } from "@/lib/utils"

const STATUS_STYLE: Record<LearningStatus, string> = {
  queued: "bg-secondary text-muted-foreground",
  in_progress: "bg-primary/10 text-primary",
  completed: "bg-success/15 text-success",
  paused: "bg-warning/15 text-warning",
  dropped: "bg-secondary text-muted-foreground",
}
const STATUS_LABEL: Record<LearningStatus, string> = {
  queued: "Queued",
  in_progress: "In progress",
  completed: "Completed",
  paused: "Paused",
  dropped: "Dropped",
}

function Card({ item }: { item: LearningItem }) {
  const openPeek = useUIStore((s) => s.openPeek)
  const pct =
    item.progress_total && item.progress_total > 0
      ? Math.round((item.progress_current / item.progress_total) * 100)
      : null

  return (
    <button
      type="button"
      onClick={() => openPeek({ type: "learning_item", id: item.id })}
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-muted-foreground/30"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <BookOpen className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div>
            <h3 className="font-serif text-base font-semibold leading-tight">{item.title}</h3>
            <p className="mt-0.5 text-xs capitalize text-muted-foreground">{item.type}</p>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
            STATUS_STYLE[item.status],
          )}
        >
          {STATUS_LABEL[item.status]}
        </span>
      </div>

      {pct != null ? (
        <div className="mt-auto">
          <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
            <span className="tabular-nums">
              {item.progress_current}/{item.progress_total} {item.progress_unit ?? ""}
            </span>
            <span className="tabular-nums">{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      ) : null}
    </button>
  )
}

export default function LearningPage() {
  const { data: items, isLoading } = useLearningItems()
  const add = useAddLearningItem()
  const [value, setValue] = useState("")

  function submit() {
    if (!value.trim()) return
    add.mutate({ title: value.trim() })
    setValue("")
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">Learning</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Courses, books, topics, and skills you're growing — with progress you can see.
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
          placeholder="Add something to learn…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !items || items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
            <BookOpen className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-4 font-medium">Nothing on the shelf yet</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Add a course, book, topic, or skill you want to grow.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((l) => (
            <Card key={l.id} item={l} />
          ))}
        </div>
      )}
    </div>
  )
}
