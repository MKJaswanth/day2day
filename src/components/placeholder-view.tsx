import type { LucideIcon } from "lucide-react"

export function PlaceholderView({
  icon: Icon,
  title,
  description,
  phase,
}: {
  icon: LucideIcon
  title: string
  description: string
  phase: string
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-card">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <h2 className="mt-4 font-serif text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      <span className="mt-4 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
        {phase}
      </span>
    </div>
  )
}
