# Development Roadmap

*Document 5 of 5 — Foundational Planning Series*
*Status: Draft for review*
*Builds on: 01-user-stories.md, 02-prd.md, 03-system-architecture.md, 04-uiux-design-direction.md*

---

## Sequencing Philosophy

How we order the build matters as much as what we build. Four principles govern the phasing:

1. **Spine before features.** Prove the full pipeline (auth → database → deploy) end-to-end *first*, on a trivial slice, so we never build features on unproven plumbing.
2. **The graph is the heart — build it early.** The connected-item model (the `links` table, bidirectional relationships) is the product's whole differentiator. It comes before the pretty views, so views are built *on* a real graph rather than retrofitted onto it.
3. **Make it active before making it beautiful.** The review/decay loop (what makes this more than a store) lands before the final polish pass.
4. **Vertical slices, quality gated.** Each phase ships a complete, usable, *polished* capability — not a half-built layer. "Quality over speed" means a phase isn't done until it feels right, not just until it functions.

No fixed time estimates — this is a long-term, quality-first solo build. We move by **milestones**, and a milestone is reached only when its definition of done is genuinely met.

---

## Phase 0 — Foundation & the Spine

*Goal: a deployed, authenticated app shell with the design system in place and data round-tripping end-to-end.*

**Build:**
- Repo + project scaffold: Next.js (App Router) + TypeScript + Tailwind; Biome; Vitest + Playwright.
- Supabase project; Drizzle wired to Postgres; initial schema migration covering **core tables + the generic `links` table + tags + areas**.
- Supabase Auth + Row-Level Security (your data locked to your user at the DB level).
- **Design-system foundation:** color tokens (warm neutrals + the chosen accent) in OKLCH, full **light + dark** themes, typography (Inter + the notes serif), spacing scale, radius, Lucide icons, and the base shadcn/Radix components restyled to our language.
- **App shell:** the three-zone frame, left sidebar nav, command-palette skeleton (`cmdk`), quick-capture modal skeleton.
- Deploy to Vercel; connect GitHub for auto-deploys.

**Definition of done:** you can sign in, see the app shell in both themes, and a trivial record writes to and reads from Postgres — live on Vercel. The spine is proven.

---

## Phase 1 — Capture & Core Item Primitives

*Goal: the fundamental loop — capture a thought, clarify it, act on it — works and feels instant.*

**Build (maps to CAP, parts of TSK, rich text):**
- **Inbox + quick-capture** (CAP-1…6): global hotkey, sub-two-second capture, natural-language date parsing (chrono-node), inbox count, triage into the right item type.
- **Tasks core** (TSK-1, 2, 8, 10): create/edit/complete; **scheduled vs. due** dates; subtasks/checklists; optional parent.
- **Rich-text notes** (Tiptap): the editor that powers notes everywhere, with slash-commands, checklists, links — rendered in the editorial serif.
- **The peek / slide-over panel:** the core editing pattern, opening any item without losing context.
- **Optimistic updates** wired via TanStack Query so interactions feel immediate.

**Definition of done:** you can capture an item, triage it into a task, edit it richly in the slide-over, and complete it — with no spinners and a satisfying check-off.

---

## Phase 2 — The Connected Graph (the heart)

*Goal: Projects, Follow-ups, Learning, and Goals all exist and genuinely interconnect.*

**Build (maps to PRJ, FUP, LRN, REL, GOL):**
- **Projects** (PRJ-1…10): statuses; the prominent **next action** + the "missing next action" flag; rich-text log; attach tasks/follow-ups/learning; target date; progress; archive-with-history.
- **Follow-ups** (FUP-1…8): text who/what + since-date + context; **nudge date**; overdue surfacing; link to project; resolve / convert-to-task; the sortable follow-up list.
- **Learning** (LRN-1…9): items with type/source/status; flexible progress units; reflections; link to project/goal; generate/hold tasks; schedule sessions; stalled-learning surfacing.
- **Connections** (REL-1…5): the `links` table in full use — bidirectional, navigable, with the **related-items panel** in every peek; **areas of life** as the lightweight cross-cutting tag.
- **Goals — minimal** (GOL-1…4): light goal records, project/learning links, and the rolled-up "connected projects" view.

**Definition of done:** you can create a project, attach tasks/follow-ups/learning, link it to a goal and an area, and navigate the whole graph from any node. The "everything connects" promise is real.

---

## Phase 3 — The Daily System & Views

*Goal: you can run your actual day, and see your life through multiple lenses.*

**Build (maps to TSK daily, VIEW, ORG):**
- **Today** (TSK-3): the calm command center aggregating tasks, due follow-up nudges, and scheduled learning.
- **Upcoming** (TSK-9), **manual reordering** (TSK-6), **quick defer/reschedule** (TSK-7), **simple recurring tasks** (TSK-5).
- **Home dashboard** (VIEW-1); **filter by area** (VIEW-2); **board/kanban** view with drag-and-drop (VIEW-3, dnd-kit); **calendar view** of scheduled items (VIEW-4, read-only — no external sync); **saved/custom views** (VIEW-5).
- **Search, tags, command palette** fully wired (ORG-1…3).

**Definition of done:** you start your day in Today and work entirely from it; you can slice your life by area, board, or calendar; global search finds anything instantly.

---

## Phase 4 — The Review Loop & Reflection

*Goal: the system becomes active — it surfaces decay and supports the rituals that keep it alive.*

**Build (maps to REV):**
- **Weekly review** (REV-1, 2): the guided, full-screen, one-decision-at-a-time flow — inbox → stalled projects → projects missing a next action → overdue follow-ups → stalled learning.
- The **decay/stale-detection logic** feeding it.
- **Daily reflection** prompt (REV-3); **review/reflection history** (REV-4).

**Definition of done:** the weekly review feels like a calm, satisfying ritual that genuinely surfaces what's slipping; nothing decays unnoticed.

---

## Phase 5 — Reminders, Notifications & Offline Resilience

*Goal: nothing slips because the system reaches out — and the app works on a plane.*

**Build (maps to NOT + the offline addendum):**
- **Reminders & notifications** (NOT-1…4): `pg_cron` + Supabase Edge Function dispatching **Web Push** for due tasks, follow-up nudges, and overdue inbox/review prompts; channel + quiet-hours controls.
- **Offline-resilience layer:** PWA/service worker (Serwist); persisted query cache in IndexedDB (readable offline); the **offline write outbox** with auto-flush on reconnect; last-write-wins reconciliation.

**Definition of done:** the right things resurface at the right time; you can capture and work offline, and it syncs cleanly when you reconnect.

---

## Phase 6 — Polish, Craft & Hardening

*Goal: it doesn't just work — it feels premium, end to end, and is built to last for years.*

**Build:**
- **Micro-interactions** (Motion): refined check-off, reordering, view transitions, slide-over easing — purposeful, quick, never gratuitous.
- **Empty/first-run states** and light onboarding.
- **Accessibility pass:** full keyboard operability, beautiful focus states, contrast verified in both themes, reduced-motion honored.
- **Performance pass:** stays fast as data grows over years of daily use.
- **Data export** (ACC-3) and **settings/personalization** (ACC-4).
- **Test hardening:** Playwright coverage on the critical flows (capture, Today, linking, review); a real bug bash.

**Definition of done:** the **month-long single-source-of-truth test** from the PRD — you run your entire life out of the app for a month without reaching for another tool, and it feels like a calm, beautiful, fast place to think.

---

## At-a-Glance

| Phase | Theme | Heart of it | Done when |
|-------|-------|-------------|-----------|
| 0 | Foundation & Spine | Plumbing + design system | Auth→DB→deploy proven, in both themes |
| 1 | Capture & Primitives | The capture→act loop | Capture, triage, edit, complete — instantly |
| 2 | The Connected Graph | Projects/Follow-ups/Learning + links | Everything connects and navigates |
| 3 | Daily System & Views | Today + multiple lenses | You run your day from the app |
| 4 | Review Loop | Active decay-surfacing | Weekly review feels like a ritual |
| 5 | Reminders & Offline | Nothing slips; works offline | Nudges fire; offline syncs cleanly |
| 6 | Polish & Hardening | Premium feel + longevity | The month-long SSOT test passes |

---

## What We Deliberately Do Last (and why)

- **Notifications and offline (Phase 5)** come *after* the core system is usable — they're resilience, not foundation.
- **Final polish (Phase 6)** is a dedicated phase, not an afterthought sprinkled throughout — but note that each earlier phase is still quality-gated, so we're never shipping ugly. Phase 6 is the *cohesion and craft* pass across the whole.
- **Everything in the PRD's "out of scope"** (collaboration, contacts DB, calendar sync, native mobile, integrations, AI features) stays out until the foundation has proven itself in daily use.

---

## Foundational Planning: Complete

With your approval of this roadmap, the five foundational documents are done:

1. ✅ User Stories
2. ✅ PRD
3. ✅ System Architecture (with offline addendum)
4. ✅ UI/UX Design Direction
5. ✅ Development Roadmap

**The natural next step** is to begin **Phase 0** — scaffold the project, stand up the design system and themes, wire Supabase + auth, and ship the spine end-to-end. When you're ready, we start there.

---

*End of foundational planning series.*
