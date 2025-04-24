import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  // Update the path to where your schema definitions are
  schema: "./db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.POSTGRES_URL!, // using non-null assertion
  },
  verbose: true,
  strict: true,
});
