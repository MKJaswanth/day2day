"use client"

import { Plus, Target, X } from "lucide-react"
import { useState } from "react"
import { useAddArea, useAreas, useDeleteArea } from "@/lib/queries/areas"
import { type Goal, useAddGoal, useGoals } from "@/lib/queries/goals"
import { useUIStore } from "@/lib/ui-store"

function AreasManager() {
  const { data: areas } = useAreas()
  const add = useAddArea()
  const del = useDeleteArea()
  const [value, setValue] = useState("")

  return (
    <div className="mb-8">
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Areas of life
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {areas?.map((a) => (
          <span
            key={a.id}
            className="group flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs"
          >
            {a.name}
            <button
              type="button"
              aria-label={`Delete ${a.name}`}
              onClick={() => del.mutate(a.id)}
              className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              add.mutate(value.trim())
              setValue("")
            }
          }}
          placeholder="+ Add area"
          className="h-7 w-28 rounded-full border border-dashed border-border bg-transparent px-2.5 text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring"
        />
      </div>
    </div>
  )
}

function GoalCard({ goal }: { goal: Goal }) {
  const openPeek = useUIStore((s) => s.openPeek)
  return (
    <button
      type="button"
      onClick={() => openPeek({ type: "goal", id: goal.id })}
      className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-muted-foreground/30"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Target className="size-4 text-primary" />
      </div>
      <h3 className="font-serif text-base font-semibold leading-tight">{goal.title}</h3>
    </button>
  )
}

export default function GoalsPage() {
  const { data: goals, isLoading } = useGoals()
  const add = useAddGoal()
  const [value, setValue] = useState("")

  function submit() {
    if (!value.trim()) return
    add.mutate(value.trim())
    setValue("")
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">Goals</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The outcomes your projects and learning ladder up to.
        </p>
      </div>

      <AreasManager />

      <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 py-2.5">
        <Plus className="size-[18px] shrink-0 text-muted-foreground" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit()
          }}
          placeholder="New goal…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !goals || goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
            <Target className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-4 font-medium">No goals yet</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Add a goal, then link projects and learning to it from their panels.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {goals.map((g) => (
            <GoalCard key={g.id} goal={g} />
          ))}
        </div>
      )}
    </div>
  )
}
