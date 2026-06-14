# UI/UX Design Direction

*Document 4 of 5 — Foundational Planning Series*
*Status: Draft for review*
*Builds on: 01-user-stories.md, 02-prd.md, 03-system-architecture.md*

---

## 0. The North Star

One sentence to govern every design decision:

> **A calm, fast, editorial-grade tool you trust with your whole life — quiet by default, powerful on demand.**

This app is not a dashboard. Dashboards shout — dense grids, colored widgets, charts competing for attention. This is the opposite: a focused, typographic, almost *literary* environment that recedes so your work comes forward. The feeling we're chasing is the one you get from the best-made tools — that someone cared about every pixel, every transition, every keystroke.

**The two feelings, held in tension and balanced:**
- **Calm** — generous space, restrained color, quiet surfaces. It should feel good to open at 7am.
- **Fast** — instant interactions, keyboard-first, zero friction. It should feel like an extension of your hands.

---

## 1. Design Inspirations (and exactly what to borrow)

We're not copying any one app; we're synthesizing the best instincts of several.

- **Linear** — *speed, restraint, keyboard-first.* Borrow: the command palette as the spine of navigation, instant optimistic interactions, the slide-over detail panel that lets you edit without losing your place, and the discipline of a tight neutral palette with one accent.
- **Things 3** — *warmth, typography, delight.* Borrow: the calm single-column "Today" focus, the satisfying check-off, the way hierarchy is expressed through type and space rather than boxes and borders.
- **Superhuman / Raycast** — *velocity and keyboard mastery.* Borrow: every action has a shortcut; the quick-capture and command palette feel like superpowers.
- **Notion Calendar (Cron)** — *quiet, premium time UI.* Borrow: the restrained treatment of dates and scheduling, the refined dark theme.
- **Craft** — *editorial typography and tactile feel.* Borrow: documents and notes that feel beautiful to read and write, motion that feels physical.

The synthesis: **Linear's speed and structure, wearing Things 3's warmth, with Craft's typographic care.**

---

## 2. Visual Language

### 2.1 Typography (the single biggest lever for "premium")

Type does most of the work of feeling crafted. We lead with it.

- **UI typeface:** **Inter** — impeccable at UI sizes, highly legible, neutral-but-warm. (A distinctive alternative for more character: a grotesk like *Geist* or *General Sans*.) Use one family with a full weight range rather than mixing many fonts.
- **Reading/notes typeface:** a refined **serif** (e.g. *Lora*, *Newsreader*, or *Source Serif*) for rich-text note bodies and reflections — this makes writing and reading in the app feel editorial, not form-like. A deliberate serif/sans contrast signals "this is a place for thought."
- **Numerals:** tabular figures for dates, counts, and progress so columns align cleanly.
- **Type scale:** a modular scale (roughly 12 / 14 / 16 / 20 / 24 / 32) with clear, restrained hierarchy. Most UI text sits at 14; headings earn their size.
- **Rhythm:** generous line-height (~1.5 for body), comfortable measure for notes (~65–75 characters). Let text breathe.

### 2.2 Color — restrained, sophisticated, dual-theme

Premium reads as *confident restraint*, not abundance.

- **Neutral-forward palette.** A warm-leaning grayscale carries ~90% of the UI. Warmth (a faint stone/sand undertone) reads more human and calm than cold blue-grays.
- **One confident accent.** A single, well-chosen accent (a deep indigo, a muted teal, or a warm amber — pick one with intent) for primary actions, active states, and focus. Resist a rainbow.
- **Semantic colors, used sparingly.** Muted, sophisticated tones for status — overdue, waiting, done — never loud reds/greens. Status is communicated as much by *type and icon* as by color.
- **Both themes first-class.** Light = warm paper. Dark = deep, soft charcoal (not pure black — easier on the eyes for an all-day tool). Design both from the start; neither is an afterthought.
- **Use OKLCH** for the color system so light/dark and hover/active variants stay perceptually consistent. Tailwind tokens encode the whole palette.

### 2.3 Space, Surfaces & Depth

- **Generous whitespace** is the default; density is earned only where scanning many items demands it (e.g. list views).
- **Consistent 4/8px spacing scale** — nothing is arbitrarily placed.
- **Quiet surfaces.** Layering via *hairline borders and very soft shadows*, not heavy cards. Elevation appears only for things that float (palette, popovers, slide-overs).
- **Restrained radius.** A single, consistent corner radius (e.g. 8px) — soft, not bubbly.
- **Iconography:** **Lucide** — one coherent, minimal icon set, consistent stroke weight, used purposefully (not decoratively).

---

## 3. Layout Philosophy

### 3.1 The three-zone frame

```
┌────────────┬───────────────────────────┬───────────────┐
│            │                           │               │
│  SIDEBAR   │      PRIMARY CONTENT      │  PEEK / DETAIL│
│  (nav)     │      (list / board)       │  (slide-over) │
│            │                           │   on demand   │
└────────────┴───────────────────────────┴───────────────┘
```

- **Left sidebar** — calm, collapsible navigation: *Inbox, Today, Upcoming, Projects, Follow-ups, Learning, Goals, Review*, plus saved views and areas. Quiet by default, with subtle counts (inbox badge, overdue follow-ups).
- **Primary content** — one focused view at a time. Single-column for focus (Today), list or board for collections, never a cluttered multi-widget grid.
- **Peek / detail slide-over** — clicking any item opens a slide-over panel on the right to view/edit it *without* leaving the current context (the Linear pattern). This is central to the connected-graph experience: from the peek you see and jump to **related items** (REL-3).

### 3.2 Today as the home

Opening the app lands on **Today** — the command center (TSK-3). It is deliberately calm: today's tasks, due follow-up nudges, and scheduled learning, in one focused single-column plan. Not a wall of stats — a clear answer to "what am I doing today?"

### 3.3 The Weekly Review as a guided, full-screen flow

The review (REV-1) breaks the three-zone frame on purpose: a **distraction-free, full-screen, step-by-step** flow (inbox → stalled projects → projects missing a next action → overdue follow-ups → stalled learning), one decision at a time. It should feel like a calm ritual, not a chore — progress indicated, momentum encouraged.

---

## 4. Interaction Patterns

This is where "fast" gets earned.

### 4.1 Keyboard-first, everywhere
- **Command palette (⌘K)** — the spine of navigation and actions: jump anywhere, create anything, run any command (ORG-3). Powered by `cmdk`.
- **Global quick-capture (e.g. ⌘N)** — a minimal modal that opens over anything, accepts natural language ("call dentist friday"), and disappears (CAP-1/2/6). Capturing must feel *instant*.
- **Shortcuts for every common action** — complete, schedule, defer, link, navigate. Discoverable via a shortcuts overlay (?).

### 4.2 Instant & optimistic
- No spinners for common actions. Completing a task, reordering, editing a field — all reflect **immediately** (optimistic updates), reconciling in the background. The app should never make you wait to feel responsive.

### 4.3 Tactile micro-interactions (Motion)
- A **satisfying check-off** (a brief, physical animation — never gratuitous).
- **Smooth reordering** for prioritization and kanban (`dnd-kit` + Motion).
- **Soft view transitions** and slide-over easing that feel physical, not snappy-jarring.
- Motion is **purposeful and quick** (≈150–250ms, natural easing). If an animation doesn't aid understanding or delight, it's cut.

### 4.4 Editing & context
- **Inline editing** wherever possible — click a title, type, done.
- **Rich-text notes** (Tiptap) that feel like writing in a beautiful document: slash-commands for blocks, clean formatting, checklists inside notes.
- **Hover affordances** and **right-click context menus** for power without clutter.
- **Linking** items feels light — a quick picker (⌘-driven) to connect a task to a project or a follow-up to a goal, surfaced in the peek panel.

### 4.5 Empty & first-run states
- Empty states **guide and reassure** rather than apologize — a clear, warm prompt and a single suggested action. (An empty Inbox should feel like an accomplishment, beautifully so.)

---

## 5. Per-Surface Treatment (quick sketches)

- **Inbox** — a clean stack of untriaged thoughts; triage with one keystroke (turn into task/project/follow-up/learning). Reaching zero is celebrated quietly.
- **Today** — calm single column; the day's plan; gentle separation of tasks vs. due follow-ups vs. learning sessions.
- **Project detail** — header (title, status, area, next action prominently), a tabbed/segmented body for tasks, the rich-text log, and related follow-ups/learning. The **next action is visually front and center**; a project missing one shows a gentle flag.
- **Follow-ups** — an age-and-nudge-sortable list; overdue items surface with quiet urgency (type/weight/muted color, not alarm-red); each shows who/what and since-when at a glance.
- **Learning library** — a calm shelf of items with status and a clear progress indicator; opening one reveals progress, reflections, linked project/goal, and its tasks.
- **Goals (minimal)** — a light view of goals with their connected projects rolling up — restrained, per the agreed minimal scope.

---

## 6. Accessibility & Craft Standards (non-negotiable)

Premium *is* accessible — they're the same thing done well.
- **Full keyboard operability** and visible, beautiful **focus states** (Radix gives us correct focus behavior for free).
- **Sufficient contrast** in both themes (verified, not assumed).
- **Reduced-motion** respected (`prefers-reduced-motion`).
- **Consistent, predictable interaction** — the same gesture does the same thing everywhere.

---

## 7. The Feel, Summarized

If a future build decision is ever in doubt, resolve it toward these:

1. **Quiet over loud.** Remove before you add.
2. **Type and space over boxes and color.** Hierarchy comes from rhythm, not borders.
3. **Instant over animated-but-slow.** Speed is a feature; motion serves it.
4. **Keyboard over mouse** for anyone who wants it; mouse fully supported for everyone else.
5. **One accent, warm neutrals, two real themes.**
6. **It should feel like a calm, beautiful place to think — that also happens to be extremely fast.**

---

## 8. Open Questions for Your Feedback

1. **Accent color** — any pull toward a specific direction (deep indigo / muted teal / warm amber / something else)? Or shall I pick and show options when we build?
2. **Typeface character** — safe-and-excellent (Inter) or something with more personality (Geist / General Sans)? And are you on board with a **serif for notes/reading** to get that editorial feel?
3. **Light or dark as the *primary*** design target (we build both, but which leads)?
4. **Overall temperature** — does "calm, editorial, warm" resonate, or do you want something with more energy/contrast?

---

## Confirmed Decisions (locked)

1. **Direction: calm, editorial, warm** — approved. ✅
2. **Accent color:** warm stone/sand neutral foundation + a single confident accent that is **deliberately not the generic AI violet/indigo-gradient**. Leaning **deep muted teal**, with **clay/terracotta** as the warm alternate — finalized against real screens during the build. ✅
3. **Light is the primary** design target; **dark is first-class** and built alongside. ✅
4. **Typography:** Inter for UI, **serif for notes/reflections** (editorial feel) — my call, approved. ✅
5. **Overall temperature/character:** designer's discretion toward "calm, editorial, warm." ✅

---

*Next document in sequence: **Development Roadmap** — the final foundational document.*
