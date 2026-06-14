import { BookOpen, CheckSquare, Circle, Clock } from "lucide-react"

const tasks = [
  { id: 1, title: "Draft Q3 planning outline", project: "Roadmap", done: false, priority: true },
  { id: 2, title: "Reply to onboarding feedback", project: "Product", done: false },
  { id: 3, title: "Book flights for the offsite", project: "Personal", done: true },
]

const followups = [
  { id: 1, who: "Maya (design contract)", since: "5 days ago" },
  { id: 2, who: "Accounting — invoice #204", since: "2 days ago" },
]

const learning = [{ id: 1, title: "Designing Data-Intensive Apps", unit: "Ch. 6 of 12" }]

function Greeting() {
  const now = new Date()
  const hour = now.getHours()
  const part = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
  const date = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
  return (
    <div className="mb-8">
      <p className="tabular-nums text-sm text-muted-foreground">{date}</p>
      <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight">{part}.</h2>
    </div>
  )
}

function SectionLabel({
  icon: Icon,
  label,
  count,
}: {
  icon: typeof Clock
  label: string
  count?: number
}) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <Icon className="size-4 text-muted-foreground" />
      <h3 className="text-sm font-medium">{label}</h3>
      {count != null ? (
        <span className="tabular-nums text-xs text-muted-foreground">{count}</span>
      ) : null}
    </div>
  )
}

export default function TodayPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <Greeting />

      <section className="mb-8">
        <SectionLabel icon={CheckSquare} label="Tasks" count={tasks.length} />
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {tasks.map((t) => (
            <li key={t.id} className="flex items-center gap-3 px-3.5 py-2.5">
              <Circle
                className={`size-4 shrink-0 ${t.done ? "fill-primary text-primary" : "text-muted-foreground/50"}`}
              />
              <span
                className={`flex-1 text-sm ${t.done ? "text-muted-foreground line-through" : ""}`}
              >
                {t.title}
              </span>
              {t.priority ? (
                <span className="rounded bg-warning/15 px-1.5 py-0.5 text-xs font-medium text-warning">
                  Priority
                </span>
              ) : null}
              <span className="text-xs text-muted-foreground">{t.project}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <SectionLabel icon={Clock} label="Follow-ups due" count={followups.length} />
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {followups.map((f) => (
            <li key={f.id} className="flex items-center gap-3 px-3.5 py-2.5">
              <span className="size-1.5 shrink-0 rounded-full bg-warning" />
              <span className="flex-1 text-sm">{f.who}</span>
              <span className="text-xs text-muted-foreground">waiting {f.since}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionLabel icon={BookOpen} label="Learning" />
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {learning.map((l) => (
            <li key={l.id} className="flex items-center gap-3 px-3.5 py-2.5">
              <BookOpen className="size-4 shrink-0 text-muted-foreground/60" />
              <span className="flex-1 text-sm">{l.title}</span>
              <span className="tabular-nums text-xs text-muted-foreground">{l.unit}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        Sample data — real items arrive in Phase 1. Press{" "}
        <kbd className="rounded border border-border bg-background px-1">⌘N</kbd> to try capture.
      </p>
    </div>
  )
}
