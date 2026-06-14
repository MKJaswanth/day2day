"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

export type TaskPriority = "none" | "low" | "medium" | "high"

export type Task = {
  id: string
  title: string
  notes: unknown | null
  priority: TaskPriority
  scheduled_date: string | null
  due_date: string | null
  completed_at: string | null
  parent_task_id: string | null
  project_id: string | null
  sort_order: number
  created_at: string
}

const supabase = createClient()
const SELECT =
  "id, title, notes, priority, scheduled_date, due_date, completed_at, parent_task_id, project_id, sort_order, created_at"

export const tasksKey = ["tasks"] as const
export const subtasksKey = (parentId: string) => ["subtasks", parentId] as const

/** Top-level tasks (no parent). */
export function useTasks() {
  return useQuery({
    queryKey: tasksKey,
    queryFn: async (): Promise<Task[]> => {
      const { data, error } = await supabase
        .from("tasks")
        .select(SELECT)
        .is("parent_task_id", null)
        .order("completed_at", { ascending: true, nullsFirst: true })
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
      if (error) throw error
      return (data ?? []) as Task[]
    },
  })
}

export function useSubtasks(parentId: string) {
  return useQuery({
    queryKey: subtasksKey(parentId),
    queryFn: async (): Promise<Task[]> => {
      const { data, error } = await supabase
        .from("tasks")
        .select(SELECT)
        .eq("parent_task_id", parentId)
        .order("created_at", { ascending: true })
      if (error) throw error
      return (data ?? []) as Task[]
    },
  })
}

export type NewTask = {
  title: string
  scheduledDate?: string | null
  dueDate?: string | null
  priority?: TaskPriority
  parentTaskId?: string | null
  projectId?: string | null
}

export function useAddTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: NewTask) => {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title: input.title,
          scheduled_date: input.scheduledDate ?? null,
          due_date: input.dueDate ?? null,
          priority: input.priority ?? "none",
          parent_task_id: input.parentTaskId ?? null,
          project_id: input.projectId ?? null,
        })
        .select(SELECT)
        .single()
      if (error) throw error
      return data as Task
    },
    onSettled: (_d, _e, input) => {
      if (input.parentTaskId) {
        qc.invalidateQueries({ queryKey: subtasksKey(input.parentTaskId) })
      } else {
        qc.invalidateQueries({ queryKey: tasksKey })
      }
    },
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<Task> }) => {
      const { error } = await supabase.from("tasks").update(patch).eq("id", id)
      if (error) throw error
    },
    onMutate: async ({ id, patch }) => {
      await qc.cancelQueries({ queryKey: tasksKey })
      const previous = qc.getQueryData<Task[]>(tasksKey)
      if (previous) {
        qc.setQueryData<Task[]>(
          tasksKey,
          previous.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        )
      }
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(tasksKey, ctx.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: tasksKey }),
  })
}

export function useToggleTask() {
  const update = useUpdateTask()
  return (task: Task) =>
    update.mutate({
      id: task.id,
      patch: { completed_at: task.completed_at ? null : new Date().toISOString() },
    })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id)
      if (error) throw error
    },
    onSettled: () => qc.invalidateQueries({ queryKey: tasksKey }),
  })
}
