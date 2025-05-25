// // db/index.ts
// import { drizzle } from "drizzle-orm/neon-http";
// import { neon } from "@neondatabase/serverless";
// import * as schema from "./schema";

// const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle(sql, { schema });

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("❌ DATABASE_URL is not set in environment variables.");
}

if (process.env.NODE_ENV === "development") {
  console.log("✅ DATABASE_URL:", databaseUrl);
}

// Only evaluate the client at runtime
const sql = neon(databaseUrl);
export const db = drizzle(sql, { schema });
