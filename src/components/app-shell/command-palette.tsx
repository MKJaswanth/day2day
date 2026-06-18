"use client"

import { Title as DialogTitle } from "@radix-ui/react-dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Command } from "cmdk"
import { ArrowRight, Plus, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { allNav } from "@/lib/navigation"
import { useFollowUps } from "@/lib/queries/follow-ups"
import { useGoals } from "@/lib/queries/goals"
import { useLearningItems } from "@/lib/queries/learning"
import { type ItemType, type LinkRef, TYPE_LABEL } from "@/lib/queries/links"
import { useProjects } from "@/lib/queries/projects"
import { useTasks } from "@/lib/queries/tasks"
import { useUIStore } from "@/lib/ui-store"

type PeekType = Exclude<ItemType, "inbox_item">

/** ⌘K command palette — navigation, actions, and global item search (ORG-1/3). */
export function CommandPalette() {
  const router = useRouter()
  const { commandOpen, setCommandOpen, setCaptureOpen } = useUIStore()
  const openPeek = useUIStore((s) => s.openPeek)

  const { data: tasks } = useTasks()
  const { data: projects } = useProjects()
  const { data: followUps } = useFollowUps()
  const { data: learning } = useLearningItems()
  const { data: goals } = useGoals()

  const items = useMemo<LinkRef[]>(
    () => [
      ...(tasks ?? [])
        .filter((t) => !t.completed_at)
        .map((t) => ({ type: "task" as const, id: t.id, label: t.title })),
      ...(projects ?? []).map((p) => ({ type: "project" as const, id: p.id, label: p.title })),
      ...(followUps ?? [])
        .filter((f) => f.status === "open")
        .map((f) => ({ type: "follow_up" as const, id: f.id, label: f.who })),
      ...(learning ?? []).map((l) => ({
        type: "learning_item" as const,
        id: l.id,
        label: l.title,
      })),
      ...(goals ?? []).map((g) => ({ type: "goal" as const, id: g.id, label: g.title })),
    ],
    [tasks, projects, followUps, learning, goals],
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: store setters are stable
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        useUIStore.getState().toggleCommand()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  function go(href: string) {
    setCommandOpen(false)
    router.push(href)
  }

  function peek(type: PeekType, id: string) {
    setCommandOpen(false)
    openPeek({ type, id })
  }

  return (
    <Command.Dialog
      open={commandOpen}
      onOpenChange={setCommandOpen}
      label="Command palette"
      className="fixed left-1/2 top-[12%] z-50 w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl shadow-black/20 data-[state=open]:animate-in data-[state=open]:fade-in-0 sm:top-[20%]"
      overlayClassName="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
    >
      <VisuallyHidden asChild>
        <DialogTitle>Command palette</DialogTitle>
      </VisuallyHidden>
      <div className="flex items-center gap-2 border-b border-border px-4">
        <Search className="size-4 text-muted-foreground" />
        <Command.Input
          autoFocus
          placeholder="Search or jump to…"
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <Command.List className="max-h-80 overflow-y-auto p-2">
        <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
          No results found.
        </Command.Empty>

        <Command.Group
          heading="Actions"
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
        >
          <Item
            onSelect={() => {
              setCommandOpen(false)
              setCaptureOpen(true)
            }}
          >
            <Plus className="size-4 text-primary" />
            <span>Quick capture…</span>
            <kbd className="ml-auto text-xs text-muted-foreground">⌘N</kbd>
          </Item>
        </Command.Group>

        <Command.Group
          heading="Go to"
          className="mt-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
        >
          {allNav.map((item) => {
            const Icon = item.icon
            return (
              <Item key={item.href} onSelect={() => go(item.href)}>
                <Icon className="size-4 text-muted-foreground" />
                <span>{item.label}</span>
                <ArrowRight className="ml-auto size-3.5 text-muted-foreground opacity-0 group-aria-selected:opacity-100" />
              </Item>
            )
          })}
        </Command.Group>

        {items.length > 0 ? (
          <Command.Group
            heading="Items"
            className="mt-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            {items.map((it) => (
              <Command.Item
                key={`${it.type}:${it.id}`}
                value={`${it.label} ${TYPE_LABEL[it.type]} ${it.id}`}
                onSelect={() => peek(it.type as PeekType, it.id)}
                className="group flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
              >
                <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[0.625rem] uppercase text-muted-foreground">
                  {TYPE_LABEL[it.type]}
                </span>
                <span className="truncate">{it.label}</span>
              </Command.Item>
            ))}
          </Command.Group>
        ) : null}
      </Command.List>
    </Command.Dialog>
  )
}

function Item({ children, onSelect }: { children: React.ReactNode; onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="group flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
    >
      {children}
    </Command.Item>
  )
}
