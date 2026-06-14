# Planning Documents — Life Management System

Foundational planning for a personal & professional life-management web app.
Read these in order before starting the build.

1. `01-user-stories.md` — what the system must do, grouped by feature area
2. `02-prd.md` — goals, scope, personas, success metrics, non-goals
3. `03-system-architecture.md` — tech stack + setup (incl. offline addendum & locked decisions)
4. `04-uiux-design-direction.md` — visual language, layout, interaction patterns
5. `05-development-roadmap.md` — phased build plan (start at Phase 0)

## Locked stack (see doc 03)
Next.js (App Router) + TypeScript · Tailwind + Radix + shadcn/ui · Tiptap (rich text)
Motion · cmdk · dnd-kit · TanStack Query + Zustand · Supabase (Postgres + Auth + Realtime
+ Storage) · Drizzle ORM · Biome · Vitest + Playwright · Vercel hosting.
Online-first + pragmatic offline resilience (PWA + IndexedDB cache + write outbox).

## Next step
Begin **Phase 0** in `05-development-roadmap.md`: scaffold + design system (light & dark)
+ Supabase/auth + ship the spine end-to-end.
