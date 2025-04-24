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

const routes = app.basePath("/api").route("/document", documentRoute);

app.get("/", (c) => {
  return c.json({
    message: "Hello from AI Resume!",
  });
});

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
