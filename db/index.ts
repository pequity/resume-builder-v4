import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as schema from "./schema";
import { sql } from "drizzle-orm";

export const db = drizzle(sql, { schema });
export type DB = typeof db;
