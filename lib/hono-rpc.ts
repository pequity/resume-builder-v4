// import { hc } from "hono/client";
// import { AppType } from "@/app/api/[[...route]]/route";

// export const client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);

// export const api = client.api;

// lib/hono-rpc.ts

"use client";

import { hc } from "hono/client";

// No AppType anymore, so hc() returns unknown
export const client = hc(process.env.NEXT_PUBLIC_APP_URL!);

// ✅ Unsafe cast to make TS shut up, needed if you’re not typing hc()
export const api = (client as any).api;
