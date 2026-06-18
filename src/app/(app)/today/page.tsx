import { TodayAgenda } from "@/components/tasks/today-agenda"
import { createClient } from "@/lib/supabase/server"
import { firstNameFromUser } from "@/lib/user"

function Greeting({ name }: { name: string | null }) {
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
      <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight">
        {name ? `${part}, ${name}.` : `${part}.`}
      </h2>
    </div>
  )
}

export default async function TodayPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <Greeting name={firstNameFromUser(user)} />
      <TodayAgenda />
    </div>
  )
}
