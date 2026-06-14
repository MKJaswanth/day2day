# User Stories — Personal & Professional Life Management System

*Document 1 of 5 — Foundational Planning Series*
*Status: Draft for review*

---

## Mental Model & Design Philosophy

Before the stories, the model they're built on — so every story traces back to a deliberate idea rather than a feature wishlist.

**It is one connected graph.** Projects, tasks, follow-ups, and learning are not four separate modules; they are different *node types* in a single web. The product's core value is the edges between them: a follow-up belongs to a project, a learning goal spawns a task, a task rolls up to a goal. Anything that can't be connected will eventually be lost.

**Three horizons of focus.** Every item lives at one of three altitudes, and lower horizons roll up into higher ones:

- **Now** — today's tasks, due follow-ups, scheduled learning sessions.
- **Mid** — projects (active efforts spanning weeks to months).
- **High** — goals and areas of life (the durable "why" — Career, Health, Side Business, Relationships).

**The core loop: Capture → Clarify → Organize → Do → Reflect → Review.** The system supports each stage explicitly rather than assuming the user arrives with perfectly-formed tasks.

**Four states every actionable item can be in:** *To Do* (mine to act on), *Doing*, *Waiting For* (someone else's court — the follow-up state), and *Done/Dropped*. Treating "Waiting For" as a first-class state is what keeps follow-ups from vanishing.

**The weekly review is the heartbeat.** The system is *active*, not passive — it surfaces decay (stale projects, overdue follow-ups, stalled courses) instead of waiting to be asked.

---

## A. Capture & Inbox

The frictionless front door. If capture is slow, the system dies.

- **CAP-1** — As a user, I want to capture a thought, task, or idea in under two seconds from anywhere in the app, so that I never lose a thought because the tool got in my way.
- **CAP-2** — As a user, I want a global quick-capture shortcut (keyboard hotkey) that opens a capture box over whatever I'm doing, so that capturing never forces me to navigate away.
- **CAP-3** — As a user, I want everything I capture to land in a single **Inbox**, so that I have one trusted place to triage later instead of deciding everything in the moment.
- **CAP-4** — As a user, I want to triage an inbox item by turning it into a task, a project, a follow-up, or a learning item, so that raw thoughts get clarified into the right kind of thing.
- **CAP-5** — As a user, I want to see how many untriaged items are in my inbox, so that I'm nudged to keep it clear.
- **CAP-6** — As a user, I want to capture using natural language (e.g. "call dentist friday") and have the app pre-fill a due date, so that capture stays fast even with details attached.

## B. Projects

Long-horizon efforts with a lifecycle, history, and a living "next action."

- **PRJ-1** — As a user, I want to create a project with a title, description, and area of life, so that every effort has a home and a context.
- **PRJ-2** — As a user, I want to set a project's status (Active, On Hold, Someday/Maybe, Completed, Archived), so that I can distinguish what I'm pushing on now from what's parked.
- **PRJ-3** — As a user, I want each active project to display its single **next action**, so that I always know the very next physical step and can spot stalled projects instantly.
- **PRJ-4** — As a user, I want the app to flag any active project that has no next action, so that nothing silently stalls.
- **PRJ-5** — As a user, I want to keep a chronological **log/notes** on a project (decisions, updates, links, meeting notes), so that the project's history and context live in one place.
- **PRJ-6** — As a user, I want to attach tasks, follow-ups, and learning items to a project, so that everything related to an effort is visible from one screen.
- **PRJ-7** — As a user, I want to set an optional target date or deadline on a project, so that time-bound efforts surface as they approach.
- **PRJ-8** — As a user, I want to see a project's progress (e.g. tasks completed vs. remaining), so that I get a sense of momentum without manual bookkeeping.
- **PRJ-9** — As a user, I want to archive a completed project while keeping its full history, so that I can declutter without losing the record.
- **PRJ-10** — As a user, I want to link a project to a higher-level goal or area, so that I can see how my day-to-day work ladders up to what matters.

## C. Tasks & Daily Planning

The "Now" horizon — where execution actually happens.

- **TSK-1** — As a user, I want to create a task with a title, optional notes, priority, and due date, so that I can track concrete actions.
- **TSK-2** — As a user, I want to distinguish a task's **scheduled date** (when I plan to do it) from its **due date** (when it must be done), so that I can plan realistically without false deadlines.
- **TSK-3** — As a user, I want a focused **Today** view that aggregates everything due or scheduled for today — tasks, due follow-ups, planned learning — so that I have one command center for the day.
- **TSK-4** — As a user, I want to mark a task's priority (e.g. importance/urgency), so that I can act on what matters, not just what's loudest.
- **TSK-5** — As a user, I want to set recurring tasks (daily, weekly, custom), so that routines don't require re-entry.
- **TSK-6** — As a user, I want to reorder and manually prioritize my tasks for the day, so that I control my plan rather than the app dictating it.
- **TSK-7** — As a user, I want to defer or reschedule a task quickly, so that an unfinished day rolls forward cleanly instead of piling up as "overdue."
- **TSK-8** — As a user, I want to attach a task to a project, follow-up, or learning item, so that standalone actions and contextual actions both have a home.
- **TSK-9** — As a user, I want an **Upcoming** view (this week / next), so that I can see the near horizon beyond today.
- **TSK-10** — As a user, I want to break a task into subtasks/checklist items, so that I can handle multi-step actions without spawning a full project.

## D. Follow-ups / Waiting For

The state that normal to-do apps lose. Distinct because the ball is in someone else's court.

- **FUP-1** — As a user, I want to create a follow-up that records *who* or *what* I'm waiting on and *since when*, so that nothing I've delegated or sent quietly disappears.
- **FUP-2** — As a user, I want to set a **nudge date** on a follow-up (when to chase it), so that the system reminds me to re-engage at the right time instead of me having to remember.
- **FUP-3** — As a user, I want overdue follow-ups (no response by the nudge date) to surface prominently, so that dropped balls become visible.
- **FUP-4** — As a user, I want to attach context to a follow-up — what I sent, the relevant thread, the person — so that when it resurfaces weeks later I instantly remember the situation.
- **FUP-5** — As a user, I want to link a follow-up to a project, so that waiting-for items appear in the project they belong to.
- **FUP-6** — As a user, I want to mark a follow-up as resolved (and optionally convert it into a task if action is now needed), so that the loop closes cleanly.
- **FUP-7** — As a user, I want to see all my open follow-ups in one list, sortable by age and nudge date, so that I can run a quick "what am I waiting on?" sweep.
- **FUP-8** — As a user, I want to optionally associate a follow-up with a person/contact, so that I can see everything pending with a given person.

## E. Learning

Courses, books, and topics — tracked by progress *and* reflection, not just completion.

- **LRN-1** — As a user, I want to add a learning item (course, book, topic, skill) with a type and source, so that all my learning lives in one library.
- **LRN-2** — As a user, I want to track progress in meaningful units (chapters, modules, %, or pages), so that I can see how far through something I am.
- **LRN-3** — As a user, I want to set a learning item's status (Queued, In Progress, Completed, Paused, Dropped), so that I can manage my pipeline honestly.
- **LRN-4** — As a user, I want to capture **reflections and takeaways** on a learning item, so that knowledge compounds instead of evaporating after I finish.
- **LRN-5** — As a user, I want to link a learning item to the project or goal motivating it, so that I remember *why* I'm learning it and can drop things that no longer serve a purpose.
- **LRN-6** — As a user, I want learning items to generate or hold tasks (e.g. "read chapter 3," "do exercise set"), so that learning becomes actionable in my daily plan.
- **LRN-7** — As a user, I want to schedule learning sessions that appear in my Today/Upcoming views, so that learning competes for my time like everything else rather than being perpetually "later."
- **LRN-8** — As a user, I want to see learning items that have stalled (no progress in N days/weeks), so that I can revive or consciously abandon them.
- **LRN-9** — As a user, I want to keep a record of completed learning, so that I have a personal log of what I've grown through.

## F. Connections & Relationships

The connective tissue — the reason this is one system and not four.

- **REL-1** — As a user, I want to link any item to any other (task↔project, follow-up↔project, learning↔goal), so that the system reflects how my life actually interconnects.
- **REL-2** — As a user, I want links to be bidirectional — opening either item shows the relationship — so that I can navigate the graph from any direction.
- **REL-3** — As a user, I want to open any item and see all its **related items** in one panel, so that I get full context without hunting.
- **REL-4** — As a user, I want to navigate from a daily task back to its parent project or goal in one click, so that I never lose sight of why I'm doing something.
- **REL-5** — As a user, I want to assign items to **areas of life** (Work, Health, Side Project, etc.), so that I can view and balance my life by domain.

## G. Goals & Horizons

The durable "why" that the rest of the system serves.

- **GOL-1** — As a user, I want to define longer-horizon goals, so that my projects and tasks have something to ladder up to.
- **GOL-2** — As a user, I want to link projects (and learning) to a goal, so that I can see which efforts actually advance what I care about.
- **GOL-3** — As a user, I want to see a goal's connected projects and their collective progress, so that I can tell whether a goal is genuinely moving or merely aspirational.
- **GOL-4** — As a user, I want to define **areas of life** as ongoing standards of responsibility (distinct from finite goals), so that maintenance domains are represented, not just achievements.

## H. Dashboard & Views

Multiple lenses on the same underlying graph.

- **VIEW-1** — As a user, I want a home dashboard that summarizes my day, open follow-ups, active projects, and learning in progress, so that I get one orienting glance at my whole life.
- **VIEW-2** — As a user, I want to filter and view items by area of life, so that I can focus on one domain at a time.
- **VIEW-3** — As a user, I want to switch a project's tasks between views (list, board/kanban, maybe timeline), so that I can see work in the format that fits the moment.
- **VIEW-4** — As a user, I want a calendar-style view of scheduled tasks, follow-up nudges, and learning sessions, so that I can see my commitments against time.
- **VIEW-5** — As a user, I want saved/custom filtered views, so that I can return to my own way of slicing things instantly.

## I. Reviews & Reflection

The system's active heartbeat — surfacing decay and prompting reflection.

- **REV-1** — As a user, I want a guided **weekly review** flow that walks me through inbox, stalled projects, overdue follow-ups, and stalled learning, so that nothing decays unnoticed.
- **REV-2** — As a user, I want the review to surface projects with no next action and items untouched for a while, so that I make conscious decisions about what to revive or drop.
- **REV-3** — As a user, I want an optional daily reflection prompt (what got done, what's blocking me, tomorrow's focus), so that I close each day deliberately.
- **REV-4** — As a user, I want to see a lightweight record of past reviews/reflections, so that I can notice patterns over time.

## J. Reminders & Notifications

Resurfacing the right thing at the right time.

- **NOT-1** — As a user, I want reminders for tasks with due/scheduled dates, so that time-sensitive items reach me.
- **NOT-2** — As a user, I want follow-up nudges to notify me on their nudge date, so that waiting-for items pull me back at the right moment.
- **NOT-3** — As a user, I want a gentle nudge when my inbox or weekly review is overdue, so that the system's core rituals don't lapse.
- **NOT-4** — As a user, I want control over notification channels and quiet hours, so that the system supports me without becoming noise.

## K. Search & Organization

Finding anything, fast.

- **ORG-1** — As a user, I want fast global search across all item types, so that I can find anything by a word I remember.
- **ORG-2** — As a user, I want to tag items freely and filter by tag, so that I can organize across the rigid type/area structure.
- **ORG-3** — As a user, I want a command palette (keyboard-driven) to jump to anything or trigger any action, so that power use stays at my fingertips.

## L. Account, Data & Personalization

Trust, ownership, and comfort.

- **ACC-1** — As a user, I want secure sign-in so that my entire life's data is protected.
- **ACC-2** — As a user, I want my data to sync reliably across my devices, so that I trust it as a single source of truth.
- **ACC-3** — As a user, I want to export all my data, so that I'm never locked in and own my information.
- **ACC-4** — As a user, I want light/dark themes and basic appearance control, so that the app is comfortable to live in all day.

---

## Deliberately Deferred (for later horizons)

Noting these so we're explicit about what's *not* in the foundational scope — to be confirmed in the PRD:

- Multi-user collaboration / sharing (this is a personal system first).
- Native mobile apps (web-first, responsive; native is a later phase).
- Deep third-party integrations (email, calendar two-way sync, Readwise, etc.) — valuable but post-MVP.
- AI-assisted features (auto-summarizing project logs, suggesting next actions) — promising, intentionally parked until the core graph is solid.

## Open Questions for Your Feedback

1. **Goals/Areas** (Section G) — do you want these as a full first-class horizon now, or kept lightweight initially?
2. **People/Contacts** — should follow-ups link to a real contacts entity (FUP-8), or is a plain text "who" enough for v1?
3. **Calendar integration** — is two-way calendar sync important enough to pull from "deferred" into core scope?
4. Anything in **Deliberately Deferred** you'd want promoted into the foundation?

---

*Next document in sequence: **PRD (Product Requirements Document)** — pending your approval of these user stories.*
