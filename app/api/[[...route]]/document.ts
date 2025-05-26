import {
  DocumentSchema,
  createDocumentTableSchema,
  documentTable,
} from "@/db/schema/document";
import { zValidator } from "@hono/zod-validator";
import { getAuthUser } from "@/lib/kinde";
import { Hono } from "hono";
import { generateDocUUID } from "@/lib/helper";
import { db } from "@/db";
import { and, desc, eq, ne } from "drizzle-orm";

const documentRoute = new Hono()
  .post(
    "/create",
    zValidator("json", createDocumentTableSchema),
    getAuthUser,
    async (c) => {
      try {
        const user = c.get("user");
        const { title } = c.req.valid("json") as DocumentSchema;
        const userId = user.id;
        const authorName = `${user.given_name} ${user?.family_name}`;
        const authorEmail = user.email as string;
        const documentId = generateDocUUID();

        const newDoc = {
          title: title,
          userId: userId,
          documentId: documentId,
          authorName: authorName,
          authorEmail: authorEmail,
        };

        const [data] = await db
          .insert(documentTable)
          .values(newDoc)
          .returning();
        return c.json(
          {
            success: "ok",
            data,
          },
          { status: 200 }
        );
      } catch (error) {
        return c.json(
          {
            success: false,
            message: "Failed to create document",
            error: error,
          },
          500
        );
      }
    }
  )
  .get("all", getAuthUser, async (c) => {
    try {
      const user = c.get("user");
      const userId = user.id;
      const documents = await db
        .select()
        .from(documentTable)
        .orderBy(desc(documentTable.updatedAt))
        .where(
          and(
            eq(documentTable.userId, userId),
            ne(documentTable.status, "archived")
          )
        );
      return c.json({
        success: true,
        data: documents,
      });
    } catch (error) {
      return c.json({
        success: false,
        message: "Failed to fetch documents",
        error: error,
      });
    }
  });

export default documentRoute;
