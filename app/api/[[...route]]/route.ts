import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import authors from "./authors";
import books from "./books";
import { HTTPException } from "hono/http-exception";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use("*", logger());

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ error: "internal error" });
});

// ❌ Original problematic code (commented out)
// const routes = app.route("/authors", authors).route("/books", books);

// ✅ Fixed version: directly modifying `app`
app.route("/authors", authors).route("/books", books);

app.get("/", (c) => {
  return c.json({
    message: "Hello from AI Resume!",
  });
});

// ❌ Original issue (commented out)
// export type AppType = typeof routes;

// ✅ Fixed: Using app directly as the type
export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
