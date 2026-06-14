"use client"

import { LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "@/app/login/actions"
import { collectionsNav, type NavItem, primaryNav, systemNav } from "@/lib/navigation"
import { useInboxItems } from "@/lib/queries/inbox"
import { cn } from "@/lib/utils"

function NavLink({
  item,
  active,
  onNavigate,
  badge,
}: {
  item: NavItem
  active: boolean
  onNavigate?: () => void
  badge?: number
}) {
  const Icon = item.icon
  const count = badge ?? item.badge
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0",
          active ? "text-sidebar-primary" : "text-muted-foreground group-hover:text-foreground",
        )}
        strokeWidth={2}
      />
      <span className="flex-1 truncate">{item.label}</span>
      {count ? (
        <span className="tabular-nums rounded-full bg-sidebar-primary/10 px-1.5 text-xs font-medium text-sidebar-primary">
          {count}
        </span>
      ) : null}
    </Link>
  )
}

function Section({
  items,
  label,
  onNavigate,
  counts,
}: {
  items: NavItem[]
  label?: string
  onNavigate?: () => void
  counts?: Record<string, number>
}) {
  const pathname = usePathname()
  return (
    <div className="space-y-0.5">
      {label ? (
        <p className="px-2.5 pb-1 pt-3 text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground/70">
          {label}
        </p>
      ) : null}
      {items.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          active={pathname === item.href}
          onNavigate={onNavigate}
          badge={counts?.[item.href]}
        />
      ))}
    </div>
  )
}

export function Sidebar({
  userName,
  userEmail,
  onNavigate,
}: {
  userName: string
  userEmail: string
  onNavigate?: () => void
}) {
  const { data: inbox } = useInboxItems()
  const counts: Record<string, number> = {}
  if (inbox && inbox.length > 0) counts["/inbox"] = inbox.length

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="flex size-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <span className="font-serif text-sm font-semibold">d</span>
        </div>
        <span className="font-serif text-[0.95rem] font-semibold tracking-tight">day2day</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <Section items={primaryNav} onNavigate={onNavigate} counts={counts} />
        <Section items={collectionsNav} label="Collections" onNavigate={onNavigate} />
        <Section items={systemNav} label="System" onNavigate={onNavigate} />
      </nav>

      <div className="space-y-2 border-t border-sidebar-border p-3">
        <p className="px-1 text-xs text-muted-foreground">
          <kbd className="rounded border border-border bg-background px-1 font-sans">⌘K</kbd>{" "}
          commands
          {"  ·  "}
          <kbd className="rounded border border-border bg-background px-1 font-sans">⌘N</kbd>{" "}
          capture
        </p>
        <div className="flex items-center gap-2 rounded-md px-1">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-xs font-medium text-sidebar-accent-foreground uppercase">
            {(userName || userEmail).charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium capitalize text-sidebar-accent-foreground">
              {userName}
            </p>
            {userEmail ? (
              <p className="truncate text-[0.6875rem] text-muted-foreground">{userEmail}</p>
            ) : null}
          </div>
          <form action={signOut}>
            <button
              type="submit"
              aria-label="Sign out"
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
