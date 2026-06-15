"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"

export type ItemType = "task" | "project" | "follow_up" | "learning_item" | "goal" | "inbox_item"

export type LinkRef = { type: ItemType; id: string; label: string }
export type RelatedLink = { linkId: string; ref: LinkRef; relation: string }

/** Per-type table + label column, for resolving heterogeneous link targets. */
const TYPE_META: Record<ItemType, { table: string; labelCol: string }> = {
  task: { table: "tasks", labelCol: "title" },
  project: { table: "projects", labelCol: "title" },
  follow_up: { table: "follow_ups", labelCol: "who" },
  learning_item: { table: "learning_items", labelCol: "title" },
  goal: { table: "goals", labelCol: "title" },
  inbox_item: { table: "inbox_items", labelCol: "content" },
}

export const TYPE_LABEL: Record<ItemType, string> = {
  task: "Task",
  project: "Project",
  follow_up: "Follow-up",
  learning_item: "Learning",
  goal: "Goal",
  inbox_item: "Inbox",
}

const supabase = createClient()
export const relatedKey = (type: ItemType, id: string) => ["related", type, id] as const

async function resolveLabels(refs: { type: ItemType; id: string }[]): Promise<Map<string, string>> {
  const labels = new Map<string, string>()
  const byType = new Map<ItemType, string[]>()
  for (const r of refs) {
    const arr = byType.get(r.type) ?? []
    arr.push(r.id)
    byType.set(r.type, arr)
  }
  for (const [type, ids] of byType) {
    const meta = TYPE_META[type]
    const { data } = await supabase.from(meta.table).select(`id, ${meta.labelCol}`).in("id", ids)
    const rows = (data ?? []) as unknown as Record<string, string>[]
    for (const r of rows) {
      labels.set(`${type}:${r.id}`, r[meta.labelCol] ?? "(untitled)")
    }
  }
  return labels
}

export function useRelatedItems(type: ItemType, id: string) {
  return useQuery({
    queryKey: relatedKey(type, id),
    queryFn: async (): Promise<RelatedLink[]> => {
      const { data, error } = await supabase
        .from("links")
        .select("id, from_type, from_id, to_type, to_id, relation")
        .or(`and(from_type.eq.${type},from_id.eq.${id}),and(to_type.eq.${type},to_id.eq.${id})`)
      if (error) throw error

      const rows = data ?? []
      const others = rows.map((l) => {
        const isFrom = l.from_type === type && l.from_id === id
        return {
          linkId: l.id as string,
          relation: l.relation as string,
          type: (isFrom ? l.to_type : l.from_type) as ItemType,
          id: (isFrom ? l.to_id : l.from_id) as string,
        }
      })
      const labels = await resolveLabels(others)
      return others.map((o) => ({
        linkId: o.linkId,
        relation: o.relation,
        ref: { type: o.type, id: o.id, label: labels.get(`${o.type}:${o.id}`) ?? "(untitled)" },
      }))
    },
  })
}

export function useAddLink(type: ItemType, id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (target: { type: ItemType; id: string }) => {
      const { error } = await supabase.from("links").insert({
        from_type: type,
        from_id: id,
        to_type: target.type,
        to_id: target.id,
      })
      if (error) throw error
    },
    onSettled: () => qc.invalidateQueries({ queryKey: relatedKey(type, id) }),
  })
}

export function useRemoveLink(type: ItemType, id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase.from("links").delete().eq("id", linkId)
      if (error) throw error
    },
    onSettled: () => qc.invalidateQueries({ queryKey: relatedKey(type, id) }),
  })
}
