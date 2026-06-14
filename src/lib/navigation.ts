import {
  BookOpen,
  CalendarClock,
  CheckSquare,
  FolderKanban,
  Inbox,
  type LucideIcon,
  RefreshCw,
  Sun,
  Target,
} from "lucide-react"

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  /** Optional count badge key — wired to real data later. */
  badge?: number
}

/** Left sidebar navigation, per the design doc's three-zone frame. */
export const primaryNav: NavItem[] = [
  { label: "Inbox", href: "/inbox", icon: Inbox },
  { label: "Today", href: "/today", icon: Sun },
  { label: "Upcoming", href: "/upcoming", icon: CalendarClock },
]

export const collectionsNav: NavItem[] = [
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Follow-ups", href: "/follow-ups", icon: CheckSquare },
  { label: "Learning", href: "/learning", icon: BookOpen },
  { label: "Goals", href: "/goals", icon: Target },
]

export const systemNav: NavItem[] = [{ label: "Review", href: "/review", icon: RefreshCw }]

export const allNav = [...primaryNav, ...collectionsNav, ...systemNav]
