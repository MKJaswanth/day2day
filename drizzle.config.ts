import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  // Supabase ships system schemas; keep migrations scoped to our app tables.
  schemaFilter: ["public"],
  verbose: true,
  strict: true,
})
