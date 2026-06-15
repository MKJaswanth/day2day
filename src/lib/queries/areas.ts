"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

export type Area = {
  id: string
  name: string
  color: string | null
  created_at: string
}

const supabase = createClient()
export const areasKey = ["areas"] as const

export function useAreas() {
  return useQuery({
    queryKey: areasKey,
    queryFn: async (): Promise<Area[]> => {
      const { data, error } = await supabase
        .from("areas")
        .select("id, name, color, created_at")
        .order("name", { ascending: true })
      if (error) throw error
      return (data ?? []) as Area[]
    },
  })
}

export function useAddArea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.from("areas").insert({ name })
      if (error) throw error
    },
    onSettled: () => qc.invalidateQueries({ queryKey: areasKey }),
  })
}

export function useDeleteArea() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("areas").delete().eq("id", id)
      if (error) throw error
    },
    onSettled: () => qc.invalidateQueries({ queryKey: areasKey }),
  })
}
