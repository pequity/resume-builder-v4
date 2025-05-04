import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import documentRoute from "./document";

export const runtime = "edge";

const app = new Hono();

app.use("*", logger());

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ error: "internal error" });
});

// ✅ This mounts /api/document/*
const routes = app.basePath("/api").route("/document", documentRoute);

// ✅ This allows the client to infer routes properly
export type AppType = typeof routes;
export default routes; // ✅ must export routes, not app

// export default app; // ❌ old — broke AppType inference
