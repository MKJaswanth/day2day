-- Custom SQL migration file, put your code below! --

-- Row-Level Security: lock every row to its owner (auth.uid()).
-- owner_id defaults to the authenticated user so Supabase-client inserts auto-fill it.
-- A single FOR ALL policy covers select/insert/update/delete for the `authenticated` role.

-- Remove the anonymous spine-test row (owner_id = all zeros) now that RLS lands.
DELETE FROM "pings" WHERE "owner_id" = '00000000-0000-0000-0000-000000000000';

-- areas
ALTER TABLE "areas" ALTER COLUMN "owner_id" SET DEFAULT auth.uid();
ALTER TABLE "areas" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "areas_owner" ON "areas" FOR ALL TO authenticated
  USING ("owner_id" = auth.uid()) WITH CHECK ("owner_id" = auth.uid());

-- follow_ups
ALTER TABLE "follow_ups" ALTER COLUMN "owner_id" SET DEFAULT auth.uid();
ALTER TABLE "follow_ups" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follow_ups_owner" ON "follow_ups" FOR ALL TO authenticated
  USING ("owner_id" = auth.uid()) WITH CHECK ("owner_id" = auth.uid());

-- goals
ALTER TABLE "goals" ALTER COLUMN "owner_id" SET DEFAULT auth.uid();
ALTER TABLE "goals" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "goals_owner" ON "goals" FOR ALL TO authenticated
  USING ("owner_id" = auth.uid()) WITH CHECK ("owner_id" = auth.uid());

-- inbox_items
ALTER TABLE "inbox_items" ALTER COLUMN "owner_id" SET DEFAULT auth.uid();
ALTER TABLE "inbox_items" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inbox_items_owner" ON "inbox_items" FOR ALL TO authenticated
  USING ("owner_id" = auth.uid()) WITH CHECK ("owner_id" = auth.uid());

-- item_tags
ALTER TABLE "item_tags" ALTER COLUMN "owner_id" SET DEFAULT auth.uid();
ALTER TABLE "item_tags" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "item_tags_owner" ON "item_tags" FOR ALL TO authenticated
  USING ("owner_id" = auth.uid()) WITH CHECK ("owner_id" = auth.uid());

-- learning_items
ALTER TABLE "learning_items" ALTER COLUMN "owner_id" SET DEFAULT auth.uid();
ALTER TABLE "learning_items" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "learning_items_owner" ON "learning_items" FOR ALL TO authenticated
  USING ("owner_id" = auth.uid()) WITH CHECK ("owner_id" = auth.uid());

-- links
ALTER TABLE "links" ALTER COLUMN "owner_id" SET DEFAULT auth.uid();
ALTER TABLE "links" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "links_owner" ON "links" FOR ALL TO authenticated
  USING ("owner_id" = auth.uid()) WITH CHECK ("owner_id" = auth.uid());

-- pings
ALTER TABLE "pings" ALTER COLUMN "owner_id" SET DEFAULT auth.uid();
ALTER TABLE "pings" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pings_owner" ON "pings" FOR ALL TO authenticated
  USING ("owner_id" = auth.uid()) WITH CHECK ("owner_id" = auth.uid());

-- projects
ALTER TABLE "projects" ALTER COLUMN "owner_id" SET DEFAULT auth.uid();
ALTER TABLE "projects" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_owner" ON "projects" FOR ALL TO authenticated
  USING ("owner_id" = auth.uid()) WITH CHECK ("owner_id" = auth.uid());

-- reviews
ALTER TABLE "reviews" ALTER COLUMN "owner_id" SET DEFAULT auth.uid();
ALTER TABLE "reviews" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_owner" ON "reviews" FOR ALL TO authenticated
  USING ("owner_id" = auth.uid()) WITH CHECK ("owner_id" = auth.uid());

-- tags
ALTER TABLE "tags" ALTER COLUMN "owner_id" SET DEFAULT auth.uid();
ALTER TABLE "tags" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tags_owner" ON "tags" FOR ALL TO authenticated
  USING ("owner_id" = auth.uid()) WITH CHECK ("owner_id" = auth.uid());

-- tasks
ALTER TABLE "tasks" ALTER COLUMN "owner_id" SET DEFAULT auth.uid();
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks_owner" ON "tasks" FOR ALL TO authenticated
  USING ("owner_id" = auth.uid()) WITH CHECK ("owner_id" = auth.uid());