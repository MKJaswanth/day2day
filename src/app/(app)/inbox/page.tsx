import { Inbox } from "lucide-react"
import { PlaceholderView } from "@/components/placeholder-view"

export default function InboxPage() {
  return (
    <PlaceholderView
      icon={Inbox}
      title="Inbox"
      description="Untriaged thoughts land here. Triage each into a task, project, follow-up, or learning item with a single keystroke."
      phase="Phase 1 — Capture & Inbox"
    />
  )
}
