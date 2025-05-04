import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@/db";
import { documentTable } from "@/db/schema";
import { getAuthUser } from "@/lib/kinde";
import { generateDocUUID } from "@/lib/helper";

const documentRoute = new Hono();

// ✅ THIS is what the tutorial calls when you click "Add Resume"
documentRoute.post("/create", async (c) => {
  const user = await getAuthUser(c);
  if (!user) {
    return c.json({ error: "unauthorized" }, 401);
  }

  const docId = generateDocUUID();

  const [newDoc] = await db
    .insert(documentTable)
    .values({
      id: docId,
      userId: user.id,
      title: "Untitled Resume",
    })
    .returning();

  return c.json({ document: newDoc });
});

// Add more routes below if needed
// documentRoute.get(...);
// documentRoute.put(...);

export default documentRoute;
