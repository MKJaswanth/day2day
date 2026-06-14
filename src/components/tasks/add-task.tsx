"use client"

import * as chrono from "chrono-node"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useAddTask } from "@/lib/queries/tasks"

/** Inline task creator with natural-language date parsing (e.g. "ship deck friday"). */
export function AddTask() {
  const add = useAddTask()
  const [value, setValue] = useState("")

  function submit() {
    const raw = value.trim()
    if (!raw) return
    const parsed = chrono.parse(raw)[0]
    const date = parsed?.start?.date()
    // Strip the matched date text from the title for a clean task name.
    const title = (parsed ? raw.replace(parsed.text, "").trim() : raw) || raw
    add.mutate({
      title,
      scheduledDate: date ? date.toISOString().slice(0, 10) : null,
    })
    setValue("")
  }

  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5">
      <Plus className="size-[18px] shrink-0 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit()
        }}
        placeholder="Add a task…  (try “review notes tomorrow”)"
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}
