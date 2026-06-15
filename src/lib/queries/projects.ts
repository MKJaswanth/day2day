"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import type { Task } from "./tasks"

export type ProjectStatus = "active" | "on_hold" | "someday" | "completed" | "archived"

export type Project = {
  id: string
  title: string
  description: string | null
  status: ProjectStatus
  area_id: string | null
  goal_id: string | null
  next_action_task_id: string | null
  log: unknown | null
  target_date: string | null
  created_at: string
}

const supabase = createClient()
const SELECT =
  "id, title, description, status, area_id, goal_id, next_action_task_id, log, target_date, created_at"

export const projectsKey = ["projects"] as const
export const projectTasksKey = (id: string) => ["project-tasks", id] as const

export function useProjects() {
  return useQuery({
    queryKey: projectsKey,
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from("projects")
        .select(SELECT)
        .order("created_at", { ascending: false })
      if (error) throw error
      return (data ?? []) as Project[]
    },
  })
}

/** Tasks attached to a project (for progress + next-action picking). */
export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: projectTasksKey(projectId),
    queryFn: async (): Promise<Task[]> => {
      const { data, error } = await supabase
        .from("tasks")
        .select(
          "id, title, notes, priority, scheduled_date, due_date, completed_at, parent_task_id, project_id, sort_order, created_at",
        )
        .eq("project_id", projectId)
        .is("parent_task_id", null)
        .order("completed_at", { ascending: true, nullsFirst: true })
        .order("created_at", { ascending: false })
      if (error) throw error
      return (data ?? []) as Task[]
    },
  })
}

export function useAddProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { title: string }) => {
      const { data, error } = await supabase
        .from("projects")
        .insert({ title: input.title })
        .select(SELECT)
        .single()
      if (error) throw error
      return data as Project
    },
    onSettled: () => qc.invalidateQueries({ queryKey: projectsKey }),
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Project> }) => {
      const { error } = await supabase.from("projects").update(patch).eq("id", id)
      if (error) throw error
    },
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: projectsKey })
      const previous = qc.getQueryData<Project[]>(projectsKey)
      if (previous) {
        qc.setQueryData<Project[]>(
          projectsKey,
          previous.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        )
      }
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(projectsKey, ctx.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: projectsKey }),
  })
}

export function useAddProjectTask(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (title: string) => {
      const { error } = await supabase.from("tasks").insert({ title, project_id: projectId })
      if (error) throw error
    },
    onSettled: () => qc.invalidateQueries({ queryKey: projectTasksKey(projectId) }),
  })
}

export function useToggleProjectTask(projectId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (task: Task) => {
      const { error } = await supabase
        .from("tasks")
        .update({ completed_at: task.completed_at ? null : new Date().toISOString() })
        .eq("id", task.id)
      if (error) throw error
    },
    onSettled: () => qc.invalidateQueries({ queryKey: projectTasksKey(projectId) }),
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id)
      if (error) throw error
    },
    onSettled: () => qc.invalidateQueries({ queryKey: projectsKey }),
  })
}
