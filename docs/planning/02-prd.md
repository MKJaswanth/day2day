# Product Requirements Document (PRD)

*Document 2 of 5 — Foundational Planning Series*
*Status: Draft for review*
*Builds on: 01-user-stories.md*

---

## 1. Overview & Vision

A single, connected web application for managing one person's entire personal and professional life — projects, follow-ups, learning, and daily tasks — as one interlinked system rather than four disconnected tools.

The product's defining bet: **the value is in the connections, not the modules.** Existing tools each do one thing well (Todoist for tasks, Notion for notes, a spreadsheet for learning, the inbox for follow-ups), and life leaks through the gaps between them. This app eliminates those gaps by making every item part of one graph, with an active review loop that surfaces what's decaying before it's lost.

**Vision statement:** *The trusted single source of truth for everything I'm doing, waiting on, learning, and working toward — that actively keeps me honest about all of it.*

---

## 2. Goals & Objectives

| # | Goal | Why it matters |
|---|------|----------------|
| G1 | **Unify** projects, tasks, follow-ups, and learning in one connected system | Eliminates the cross-tool gaps where things get lost |
| G2 | **Frictionless capture** — anything, in under two seconds | A system that's slow to feed gets abandoned |
| G3 | **Nothing slips** — follow-ups and stalled work resurface automatically | The single biggest failure mode of self-management |
| G4 | **One daily command center** that aggregates across all item types | Replaces the morning scramble across four apps |
| G5 | **An active weekly review** that surfaces decay | Turns a passive store into a living system |
| G6 | **Exceptional, premium UX** — a tool worth living in all day | Delight drives the daily habit that makes any PKM work |

**Primary objective for v1:** a single user can run their entire life out of this app for a full month without reaching for another tool to track a project, task, follow-up, or learning item.

---

## 3. Non-Goals

What this product is deliberately *not*, to keep the vision sharp:

- **Not a team/collaboration tool.** Single-user, personal system first. No sharing, assigning to others, or comments.
- **Not a note-taking/wiki app.** It holds contextual notes on items, but it isn't competing with Notion/Obsidian as a knowledge base.
- **Not a full CRM.** Follow-ups track *who* as text; there's no contacts database, relationship history, or pipeline.
- **Not a calendar replacement.** It has time-based views but is not your primary calendar and (for now) does not sync with one.
- **Not an everything-automation platform.** No deep third-party integrations in the foundation.

---

## 4. Target User & Personas

This is a system of one — built for a specific, demanding user.

**Primary persona — "The Operator"**
A driven professional who simultaneously runs multiple work projects, personal projects, and a continuous learning habit. Juggles many open loops and delegated items. Has tried Todoist, Notion, Apple Reminders, and spreadsheets, and abandoned each because none held the *whole* picture or connected the pieces. Values craft and is willing to invest setup effort for a tool that's genuinely excellent. Lives in the app daily, primarily on desktop, occasionally on a phone.

**Needs:** one trusted source of truth; fast capture; confidence that nothing is silently dropping; a clear daily plan; visibility into how daily work connects to longer-term goals.

**Frustrations the product removes:** context-switching across tools; follow-ups dying in the inbox; projects quietly stalling; learning that's started and abandoned; no sense of how today ladders up to what matters.

---

## 5. Scope — Core Features (v1)

Each feature maps to user-story groups from Document 1. Goals/Areas are intentionally **minimal** per your direction.

### 5.1 Capture & Inbox *(CAP)*
- Global quick-capture via keyboard shortcut, available app-wide.
- Single Inbox for untriaged items, with a visible count.
- Triage an inbox item into a task, project, follow-up, or learning item.
- Lightweight natural-language date parsing on capture (e.g. "friday").

### 5.2 Projects *(PRJ)*
- Create projects with title, description, status (Active / On Hold / Someday / Completed / Archived), and an optional area tag.
- A designated **next action** per project, with a system flag for active projects lacking one.
- Chronological project log/notes.
- Attach tasks, follow-ups, and learning items to a project.
- Optional target date; lightweight progress indicator (tasks done vs. total).
- Archive with full history preserved.

### 5.3 Tasks & Daily Planning *(TSK)*
- Tasks with notes, priority, **separate scheduled and due dates**, and optional parent (project / follow-up / learning).
- Subtasks / checklist items.
- Recurring tasks.
- **Today** view aggregating tasks, due follow-up nudges, and scheduled learning.
- **Upcoming** (week) view; manual reordering; quick defer/reschedule.

### 5.4 Follow-ups / Waiting For *(FUP)*
- Follow-up records a **text "who/what"**, a "since" date, and free-form context. *(No contacts entity in v1, per direction.)*
- A **nudge date**; overdue follow-ups surface prominently.
- Link to a project; resolve, or convert to a task when action is needed.
- Unified follow-up list sortable by age and nudge date.

### 5.5 Learning *(LRN)*
- Learning items (course / book / topic / skill) with type, source, and status (Queued / In Progress / Completed / Paused / Dropped).
- Progress in flexible units (%, chapters, modules, pages).
- Reflections/takeaways field.
- Link to a project or goal; generate/hold tasks; schedule sessions into Today/Upcoming.
- Stalled-learning surfacing (no progress in N days).

### 5.6 Connections *(REL)*
- Link any item to any other; bidirectional and navigable from either side.
- A "related items" panel on every item.
- **Areas of life** as a lightweight tagging dimension across all item types. *(This is the minimal Goals/Areas layer — see 5.7.)*

### 5.7 Goals & Areas — Minimal *(GOL)*
Per your direction, kept lightweight in v1:
- **Areas of life** = simple categories/tags (Work, Health, Side Project, etc.) usable as a filter dimension.
- **Goals** = an optional light record that projects and learning items can link to, with a rolled-up view of connected projects.
- *No* deep horizon hierarchy, vision documents, or progress modeling yet.

### 5.8 Dashboard & Views *(VIEW)*
- Home dashboard: today's plan, open follow-ups, active projects, learning in progress.
- Filter by area of life; saved/custom filtered views.
- Project tasks in list and board (kanban) views.
- A calendar-style *view* of scheduled items (read-only against time; **no external sync**).

### 5.9 Reviews & Reflection *(REV)*
- Guided **weekly review** flow: inbox → stalled projects → projects missing a next action → overdue follow-ups → stalled learning.
- Optional daily reflection prompt.
- Lightweight history of past reviews/reflections.

### 5.10 Reminders & Notifications *(NOT)*
- Reminders for due/scheduled tasks and follow-up nudge dates.
- Nudge when inbox or weekly review is overdue.
- Channel and quiet-hours controls.

### 5.11 Search & Organization *(ORG)*
- Fast global search across all item types.
- Free-form tags + tag filtering.
- Command palette for navigation and actions.

### 5.12 Account, Data & Personalization *(ACC)*
- Secure authentication.
- Reliable cross-device sync (single source of truth).
- Full data export.
- Light/dark themes.

---

## 6. Out of Scope (v1)

Explicitly excluded — to protect focus and confirmed by your decisions:

| Item | Rationale | Revisit |
|------|-----------|---------|
| Multi-user / sharing / collaboration | Personal system first | Possibly never |
| Contacts/people database for follow-ups | Text "who" is enough for now *(your call)* | Later |
| Two-way calendar sync | Can wait *(your call)* | Phase 2+ |
| Native mobile apps | Web-first, responsive | Later phase |
| Deep integrations (email, Readwise, etc.) | Core graph comes first | Post-MVP |
| AI features (auto next-action, log summaries) | Park until the graph is solid | Post-MVP |
| Rich text / wiki-grade notes | Not competing as a knowledge base | TBD |

---

## 7. Success Metrics

How we'll know it's working. Since this is a single-user product, metrics are behavioral and qualitative rather than growth-oriented.

**North-star metric:** *Days per week the user opens the app and acts on it (target: 6–7).* If it's a daily habit, it's working.

**Supporting metrics:**

- **Capture adoption** — % of new items entered via quick-capture (target: high; proves capture is frictionless).
- **Inbox hygiene** — inbox returns to near-zero at least weekly (proves the triage loop is alive).
- **Review consistency** — weekly review completed ≥3 of 4 weeks/month.
- **Nothing-slips rate** — follow-ups resolved or consciously dropped rather than going stale and ignored.
- **Connectedness** — share of tasks/follow-ups/learning items linked to a parent project or goal (proves the graph is real, not theoretical).
- **Single-source-of-truth test** — the qualitative month-long objective from §2: a full month run entirely from this app.

**Quality bar (not a metric, a gate):** every core flow should feel fast and premium. If capture, the Today view, or navigation feels sluggish or generic, it has failed regardless of feature completeness.

---

## 8. Assumptions & Constraints

- **Single user**, authenticated, accessed primarily on desktop browsers with responsive mobile-web support.
- **Quality and UX are prioritized over development speed** at every decision point (your explicit direction).
- The data model must support a **flexible graph of links** between heterogeneous item types from day one — this is foundational, not a later bolt-on.
- The product must remain **fast** as data grows over years of daily use.

---

## 9. Open Questions for Your Feedback

1. **Notes richness** — for project logs, reflections, and item notes: is plain text / lightweight markdown enough for v1, or do you want rich text (formatting, embedded links, checklists inside notes)?
2. **Recurring tasks** — keep simple (daily/weekly/monthly), or do you need advanced rules (every 2nd Tuesday, weekdays only)?
3. **Offline use** — do you need the app to work offline (e.g. on a plane), or is online-only acceptable for v1? *(This materially affects the architecture in Document 3.)*
4. **Single device vs. true multi-device** — confirm you want cross-device sync from day one (it shapes hosting and the data layer).

---

*Next document in sequence: **System Architecture** — pending your approval of this PRD. Note that Q3 (offline) and Q4 (multi-device) directly affect the tech-stack recommendations, so your answers there will sharpen Document 3.*
