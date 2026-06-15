"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { LearningItem } from "./learning"
import type { Project } from "./projects"

export type Goal = {
  id: string
  title: string
  notes: unknown | null
  area_id: string | null
  created_at: string
}

const supabase = createClient()
const SELECT = "id, title, notes, area_id, created_at"

export const goalsKey = ["goals"] as const
export const goalProjectsKey = (id: string) => ["goal-projects", id] as const
export const goalLearningKey = (id: string) => ["goal-learning", id] as const

export function useGoals() {
  return useQuery({
    queryKey: goalsKey,
    queryFn: async (): Promise<Goal[]> => {
      const { data, error } = await supabase
        .from("goals")
        .select(SELECT)
        .order("created_at", { ascending: false })
      if (error) throw error
      return (data ?? []) as Goal[]
    },
  })
}

/** Rolled-up projects connected to a goal (GOL-4). */
export function useGoalProjects(goalId: string) {
  return useQuery({
    queryKey: goalProjectsKey(goalId),
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select(
          "id, title, description, status, area_id, goal_id, next_action_task_id, log, target_date, created_at",
        )
        .eq("goal_id", goalId)
      if (error) throw error
      return (data ?? []) as Project[]
    },
  })
}

export function useGoalLearning(goalId: string) {
  return useQuery({
    queryKey: goalLearningKey(goalId),
    queryFn: async (): Promise<LearningItem[]> => {
      const { data, error } = await supabase
        .from("learning_items")
        .select(
          "id, title, type, source, status, progress_current, progress_total, progress_unit, reflections, project_id, goal_id, last_progress_at, created_at",
        )
        .eq("goal_id", goalId)
      if (error) throw error
      return (data ?? []) as LearningItem[]
    },
  })
}

export function useAddGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (title: string) => {
      const { error } = await supabase.from("goals").insert({ title })
      if (error) throw error
    },
    onSettled: () => qc.invalidateQueries({ queryKey: goalsKey }),
  })
}

export function useUpdateGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Goal> }) => {
      const { error } = await supabase.from("goals").update(patch).eq("id", id)
      if (error) throw error
    },
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: goalsKey })
      const previous = qc.getQueryData<Goal[]>(goalsKey)
      if (previous) {
        qc.setQueryData<Goal[]>(
          goalsKey,
          previous.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        )
      }
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(goalsKey, ctx.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: goalsKey }),
  })
}

export function useDeleteGoal() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("goals").delete().eq("id", id)
      if (error) throw error
    },
    onSettled: () => qc.invalidateQueries({ queryKey: goalsKey }),
  })
}
