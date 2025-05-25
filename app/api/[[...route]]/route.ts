// import { Hono } from "hono";
// import { handle } from "hono/vercel";
// import { logger } from "hono/logger";
// import { HTTPException } from "hono/http-exception";
// import documentRoute from "./document";

// export const runtime = "edge";

// const app = new Hono();

// app.use("*", logger());

// app.onError((err, c) => {
//   if (err instanceof HTTPException) {
//     return err.getResponse();
//   }
//   return c.json({ error: "internal error" });
// });

// const routes = app.basePath("/api").route("/document", documentRoute);

// app.get("/", (c) => {
//   return c.json({
//     message: "Hello from Ai Resume!",
//   });
// });

// export type AppType = typeof routes;

// export const GET = handle(app);
// export const POST = handle(app);
// export const PATCH = handle(app);

import { Hono } from "hono";
import { handle } from "hono/vercel";
import { logger } from "hono/logger";
import { HTTPException } from "hono/http-exception";
import documentRoute from "./document";

export const runtime = "edge";

// ✅ Create and configure Hono app
const app = new Hono();

app.use("*", logger());

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ error: "internal error" });
});

// ✅ Register routes inline (avoids unused type warnings)
app.basePath("/api").route("/document", documentRoute);

// ✅ Export this AFTER routes so types are accurate
export type AppType = typeof app;

// ✅ Test route
app.get("/", (c) => {
  return c.json({
    message: "Hello from Ai Resume!",
  });
});

// ✅ Export edge runtime handlers
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
