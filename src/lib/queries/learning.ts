"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

export type LearningType = "course" | "book" | "topic" | "skill"
export type LearningStatus = "queued" | "in_progress" | "completed" | "paused" | "dropped"

export type LearningItem = {
  id: string
  title: string
  type: LearningType
  source: string | null
  status: LearningStatus
  progress_current: number
  progress_total: number | null
  progress_unit: string | null
  reflections: unknown | null
  project_id: string | null
  goal_id: string | null
  last_progress_at: string | null
  created_at: string
}

const supabase = createClient()
const SELECT =
  "id, title, type, source, status, progress_current, progress_total, progress_unit, reflections, project_id, goal_id, last_progress_at, created_at"

export const learningKey = ["learning"] as const

export function useLearningItems() {
  return useQuery({
    queryKey: learningKey,
    queryFn: async (): Promise<LearningItem[]> => {
      const { data, error } = await supabase
        .from("learning_items")
        .select(SELECT)
        .order("created_at", { ascending: false })
      if (error) throw error
      return (data ?? []) as LearningItem[]
    },
  })
}

export function useAddLearningItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { title: string; type?: LearningType }) => {
      const { data, error } = await supabase
        .from("learning_items")
        .insert({ title: input.title, type: input.type ?? "topic" })
        .select(SELECT)
        .single()
      if (error) throw error
      return data as LearningItem
    },
    onSettled: () => qc.invalidateQueries({ queryKey: learningKey }),
  })
}

export function useUpdateLearningItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<LearningItem> }) => {
      const { error } = await supabase.from("learning_items").update(patch).eq("id", id)
      if (error) throw error
    },
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: learningKey })
      const previous = qc.getQueryData<LearningItem[]>(learningKey)
      if (previous) {
        qc.setQueryData<LearningItem[]>(
          learningKey,
          previous.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        )
      }
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(learningKey, ctx.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: learningKey }),
  })
}

export function useDeleteLearningItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("learning_items").delete().eq("id", id)
      if (error) throw error
    },
    onSettled: () => qc.invalidateQueries({ queryKey: learningKey }),
  })
}
