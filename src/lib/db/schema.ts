import {
  boolean,
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

/*
 * The connected-graph data model (architecture doc §2.7).
 * Every row is owned by a user (RLS-enforced). Rich text is stored as JSONB.
 * A single generic `links` table models any-to-any bidirectional relationships.
 */

// --- Enums ------------------------------------------------------------------
export const projectStatus = pgEnum("project_status", [
  "active",
  "on_hold",
  "someday",
  "completed",
  "archived",
])

export const taskPriority = pgEnum("task_priority", ["none", "low", "medium", "high"])

export const followUpStatus = pgEnum("follow_up_status", ["open", "resolved", "dropped"])

export const learningType = pgEnum("learning_type", ["course", "book", "topic", "skill"])

export const learningStatus = pgEnum("learning_status", [
  "queued",
  "in_progress",
  "completed",
  "paused",
  "dropped",
])

export const itemType = pgEnum("item_type", [
  "task",
  "project",
  "follow_up",
  "learning_item",
  "goal",
  "inbox_item",
])

// --- Shared column helpers --------------------------------------------------
const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}

const ownerId = uuid("owner_id").notNull() // references auth.users(id); enforced via RLS

// --- Areas of life (lightweight cross-cutting tag) --------------------------
export const areas = pgTable("areas", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId,
  name: text("name").notNull(),
  color: text("color"),
  ...timestamps,
})

// --- Goals (minimal) --------------------------------------------------------
export const goals = pgTable("goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId,
  title: text("title").notNull(),
  notes: jsonb("notes"),
  areaId: uuid("area_id").references(() => areas.id, { onDelete: "set null" }),
  ...timestamps,
})

// --- Projects ---------------------------------------------------------------
export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId,
  title: text("title").notNull(),
  description: text("description"),
  status: projectStatus("status").default("active").notNull(),
  areaId: uuid("area_id").references(() => areas.id, { onDelete: "set null" }),
  goalId: uuid("goal_id").references(() => goals.id, { onDelete: "set null" }),
  nextActionTaskId: uuid("next_action_task_id"),
  log: jsonb("log"),
  targetDate: date("target_date"),
  ...timestamps,
})

// --- Tasks ------------------------------------------------------------------
export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId,
  title: text("title").notNull(),
  notes: jsonb("notes"),
  priority: taskPriority("priority").default("none").notNull(),
  scheduledDate: date("scheduled_date"),
  dueDate: date("due_date"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  parentTaskId: uuid("parent_task_id"),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  sortOrder: integer("sort_order").default(0).notNull(),
  recurrenceRule: text("recurrence_rule"),
  ...timestamps,
})

// --- Follow-ups / Waiting For ----------------------------------------------
export const followUps = pgTable("follow_ups", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId,
  who: text("who").notNull(),
  context: jsonb("context"),
  sinceDate: date("since_date").notNull(),
  nudgeDate: date("nudge_date"),
  status: followUpStatus("status").default("open").notNull(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  ...timestamps,
})

// --- Learning ---------------------------------------------------------------
export const learningItems = pgTable("learning_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId,
  title: text("title").notNull(),
  type: learningType("type").default("topic").notNull(),
  source: text("source"),
  status: learningStatus("status").default("queued").notNull(),
  progressCurrent: integer("progress_current").default(0).notNull(),
  progressTotal: integer("progress_total"),
  progressUnit: text("progress_unit"), // %, chapters, modules, pages
  reflections: jsonb("reflections"),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "set null" }),
  goalId: uuid("goal_id").references(() => goals.id, { onDelete: "set null" }),
  lastProgressAt: timestamp("last_progress_at", { withTimezone: true }),
  ...timestamps,
})

// --- Inbox (untriaged capture) ---------------------------------------------
export const inboxItems = pgTable("inbox_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId,
  content: text("content").notNull(),
  parsedDate: date("parsed_date"),
  ...timestamps,
})

// --- Tags + join -----------------------------------------------------------
export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId,
  name: text("name").notNull(),
  ...timestamps,
})

export const itemTags = pgTable("item_tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId,
  tagId: uuid("tag_id")
    .references(() => tags.id, { onDelete: "cascade" })
    .notNull(),
  itemType: itemType("item_type").notNull(),
  itemId: uuid("item_id").notNull(),
})

// --- The generic links table (the heart: any-to-any, bidirectional) --------
export const links = pgTable("links", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId,
  fromType: itemType("from_type").notNull(),
  fromId: uuid("from_id").notNull(),
  toType: itemType("to_type").notNull(),
  toId: uuid("to_id").notNull(),
  relation: text("relation").default("related").notNull(),
  ...timestamps,
})

// --- Reviews / reflections --------------------------------------------------
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId,
  kind: text("kind").default("weekly").notNull(), // weekly | daily
  completedAt: timestamp("completed_at", { withTimezone: true }),
  notes: jsonb("notes"),
  ...timestamps,
})

// --- Spine smoke-test table (Phase 0 DoD: prove auth→DB→deploy) ------------
export const pings = pgTable("pings", {
  id: uuid("id").defaultRandom().primaryKey(),
  ownerId,
  message: text("message").notNull(),
  ok: boolean("ok").default(true).notNull(),
  ...timestamps,
})
