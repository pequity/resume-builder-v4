import { hc } from "hono/client";
import type { AppType } from "@/app/api/[[...route]]/route";

// ✅ Use explicit typing with fallback cast to fix 'unknown' issue
export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
export const api = (client as { api: AppType }).api;

// ❌ Old version - caused TS error: unknown
// const client = hc(process.env.NEXT_PUBLIC_APP_URL!);
// export const api = client.api;
