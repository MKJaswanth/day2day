"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

export type FollowUpStatus = "open" | "resolved" | "dropped"

export type FollowUp = {
  id: string
  who: string
  context: unknown | null
  since_date: string
  nudge_date: string | null
  status: FollowUpStatus
  project_id: string | null
  created_at: string
}

const supabase = createClient()
const SELECT = "id, who, context, since_date, nudge_date, status, project_id, created_at"

export const followUpsKey = ["follow-ups"] as const

export function useFollowUps() {
  return useQuery({
    queryKey: followUpsKey,
    queryFn: async (): Promise<FollowUp[]> => {
      const { data, error } = await supabase
        .from("follow_ups")
        .select(SELECT)
        .order("since_date", { ascending: true })
      if (error) throw error
      return (data ?? []) as FollowUp[]
    },
  })
}

export function useAddFollowUp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { who: string; sinceDate: string; nudgeDate?: string | null }) => {
      const { data, error } = await supabase
        .from("follow_ups")
        .insert({
          who: input.who,
          since_date: input.sinceDate,
          nudge_date: input.nudgeDate ?? null,
        })
        .select(SELECT)
        .single()
      if (error) throw error
      return data as FollowUp
    },
    onSettled: () => qc.invalidateQueries({ queryKey: followUpsKey }),
  })
}

export function useUpdateFollowUp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<FollowUp> }) => {
      const { error } = await supabase.from("follow_ups").update(patch).eq("id", id)
      if (error) throw error
    },
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: followUpsKey })
      const previous = qc.getQueryData<FollowUp[]>(followUpsKey)
      if (previous) {
        qc.setQueryData<FollowUp[]>(
          followUpsKey,
          previous.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        )
      }
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(followUpsKey, ctx.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: followUpsKey }),
  })
}

export function useDeleteFollowUp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("follow_ups").delete().eq("id", id)
      if (error) throw error
    },
    onSettled: () => qc.invalidateQueries({ queryKey: followUpsKey }),
  })
}

/** Convert a follow-up into an actionable task, marking the follow-up resolved. */
export function useConvertFollowUpToTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (followUp: FollowUp) => {
      const { error: taskErr } = await supabase
        .from("tasks")
        .insert({ title: `Follow up: ${followUp.who}`, project_id: followUp.project_id })
      if (taskErr) throw taskErr
      const { error } = await supabase
        .from("follow_ups")
        .update({ status: "resolved" })
        .eq("id", followUp.id)
      if (error) throw error
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: followUpsKey })
      qc.invalidateQueries({ queryKey: ["tasks"] })
    },
  })
}
