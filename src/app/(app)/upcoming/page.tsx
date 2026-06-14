import { CalendarClock } from "lucide-react"
import { PlaceholderView } from "@/components/placeholder-view"

export default function UpcomingPage() {
  return (
    <PlaceholderView
      icon={CalendarClock}
      title="Upcoming"
      description="The week ahead — scheduled tasks, due dates, and learning sessions, with quick defer and reschedule."
      phase="Phase 3 — Daily System & Views"
    />
  )
}
