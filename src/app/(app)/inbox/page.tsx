"use client"

import { CalendarDays, Check, Inbox as InboxIcon, SquareCheckBig, Trash2 } from "lucide-react"
import { type InboxItem, useDeleteInboxItem, useInboxItems } from "@/lib/queries/inbox"
import { useAddTask } from "@/lib/queries/tasks"

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  return `${days}d ago`
}

function Row({ item }: { item: InboxItem }) {
  const del = useDeleteInboxItem()
  const addTask = useAddTask()
  const isOptimistic = item.id.startsWith("optimistic-")

  function triageToTask() {
    addTask.mutate({ title: item.content, scheduledDate: item.parsed_date })
    del.mutate(item.id)
  }

  return (
    <li className="group flex items-center gap-3 px-3.5 py-3">
      <button
        type="button"
        aria-label="Mark done & remove"
        disabled={isOptimistic}
        onClick={() => del.mutate(item.id)}
        className="flex size-5 shrink-0 items-center justify-center rounded-full border border-muted-foreground/40 text-transparent transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
      >
        <Check className="size-3" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{item.content}</p>
        {item.parsed_date ? (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-primary">
            <CalendarDays className="size-3" />
            {new Date(`${item.parsed_date}T00:00:00`).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
        ) : null}
      </div>
      <span className="tabular-nums shrink-0 text-xs text-muted-foreground">
        {relativeTime(item.created_at)}
      </span>
      <button
        type="button"
        disabled={isOptimistic}
        onClick={triageToTask}
        className="flex shrink-0 items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-foreground group-hover:opacity-100"
      >
        <SquareCheckBig className="size-3.5" />
        Make task
      </button>
      <button
        type="button"
        aria-label="Delete"
        disabled={isOptimistic}
        onClick={() => del.mutate(item.id)}
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-destructive group-hover:opacity-100"
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  )
}

export default function InboxPage() {
  const { data: items, isLoading } = useInboxItems()

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">Inbox</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything you capture lands here. Clear it to keep a calm mind.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !items || items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
            <InboxIcon className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-4 font-medium">Inbox zero ✨</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Nothing to triage. Press{" "}
            <kbd className="rounded border border-border bg-background px-1">⌘N</kbd> to capture a
            thought.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {items.map((item) => (
            <Row key={item.id} item={item} />
          ))}
        </ul>
      )}
    </div>
  )
}
