import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/utils/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL || "postgresql://mock-test_owner:eUKs0nAT6kqN@ep-damp-river-a5y4sn8v.us-east-2.aws.neon.tech/mock-test?sslmode=require",
  },
});
