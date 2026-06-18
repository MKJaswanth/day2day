/** Local-timezone date helpers. Using UTC (toISOString) would shift the date
 *  by a day for users ahead of UTC, so we format from local components. */

export function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function todayStr(): string {
  return toDateStr(new Date())
}
