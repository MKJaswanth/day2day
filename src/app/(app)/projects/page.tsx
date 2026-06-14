import { FolderKanban } from "lucide-react"
import { PlaceholderView } from "@/components/placeholder-view"

export default function ProjectsPage() {
  return (
    <PlaceholderView
      icon={FolderKanban}
      title="Projects"
      description="Every project with a prominent next action, a rich-text log, and attached tasks, follow-ups, and learning — all interconnected."
      phase="Phase 2 — The Connected Graph"
    />
  )
}
