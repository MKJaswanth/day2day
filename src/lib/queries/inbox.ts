"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

export type InboxItem = {
  id: string
  content: string
  parsed_date: string | null
  created_at: string
}

const supabase = createClient()
export const inboxKey = ["inbox"] as const

export function useInboxItems() {
  return useQuery({
    queryKey: inboxKey,
    queryFn: async (): Promise<InboxItem[]> => {
      const { data, error } = await supabase
        .from("inbox_items")
        .select("id, content, parsed_date, created_at")
        .order("created_at", { ascending: false })
      if (error) throw error
      return data ?? []
    },
  })
}

export function useAddInboxItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: { content: string; parsedDate: string | null }) => {
      const { data, error } = await supabase
        .from("inbox_items")
        .insert({ content: input.content, parsed_date: input.parsedDate })
        .select("id, content, parsed_date, created_at")
        .single()
      if (error) throw error
      return data as InboxItem
    },
    onMutate: async (input) => {
      await qc.cancelQueries({ queryKey: inboxKey })
      const previous = qc.getQueryData<InboxItem[]>(inboxKey) ?? []
      const optimistic: InboxItem = {
        id: `optimistic-${previous.length}-${input.content.length}`,
        content: input.content,
        parsed_date: input.parsedDate,
        created_at: new Date().toISOString(),
      }
      qc.setQueryData<InboxItem[]>(inboxKey, [optimistic, ...previous])
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(inboxKey, ctx.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: inboxKey }),
  })
}

export function useDeleteInboxItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("inbox_items").delete().eq("id", id)
      if (error) throw error
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: inboxKey })
      const previous = qc.getQueryData<InboxItem[]>(inboxKey) ?? []
      qc.setQueryData<InboxItem[]>(
        inboxKey,
        previous.filter((i) => i.id !== id),
      )
      return { previous }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(inboxKey, ctx.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: inboxKey }),
  })
}
