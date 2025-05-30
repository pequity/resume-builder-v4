import {
  DocumentSchema,
  UpdateDocumentSchema,
  createDocumentTableSchema,
  documentTable,
  updateCombinedSchema,
} from "@/db/schema/document";
import { zValidator } from "@hono/zod-validator";
import { getAuthUser } from "@/lib/kinde";
import { Hono } from "hono";
import { generateDocUUID } from "@/lib/helper";
import { db } from "@/db";
import { and, desc, eq, ne } from "drizzle-orm";
import { z } from "zod"; // wasn't imported before, check if this gonna work on vercel
import {
  educationTable,
  experienceTable,
  personalInfoTable,
  skillsTable,
} from "@/db/schema";

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

  // below the original tutorial's patch endpoint

  // .patch(
  //   "/update/:documentId",
  //   zValidator("param", z.object({ documentId: z.string() })),
  //   zValidator("json", updateCombinedSchema),
  //   getAuthUser,
  //   async (c) => {
  //     try {
  //       const user = c.get("user");
  //       const { documentId } = c.req.valid("param");

  //       const {
  //         title,
  //         status,
  //         summary,
  //         thumbnail,
  //         themeColor,
  //         currentPosition,
  //         personalInfo,
  //         experience,
  //         education,
  //         skills,
  //       } = c.req.valid("json");
  //       const userId = user.id;

  //       if (!documentId) {
  //         return c.json({ error: "DocumentId is required" }, 400);
  //       }
  //       await db.transaction(async (trx) => {
  //         const [existingDocument] = await trx
  //           .select()
  //           .from(documentTable)
  //           .where(
  //             and(
  //               eq(documentTable.documentId, documentId),
  //               eq(documentTable.userId, userId)
  //             )
  //           );

  //         if (!existingDocument) {
  //           return c.json({ error: "Document not found" }, 404);
  //         }

  //         const resumeUpdate = {} as UpdateDocumentSchema;
  //         if (title) resumeUpdate.title = title;
  //         if (thumbnail) resumeUpdate.thumbnail = thumbnail;
  //         if (summary) resumeUpdate.summary = summary;
  //         if (themeColor) resumeUpdate.themeColor = themeColor;
  //         if (status) resumeUpdate.status = status;
  //         if (currentPosition)
  //           resumeUpdate.currentPosition = currentPosition || 1;

  //         if (Object.keys(resumeUpdate)?.length > 0) {
  //           await trx
  //             .update(documentTable)
  //             .set(resumeUpdate)
  //             .where(
  //               and(
  //                 eq(documentTable.documentId, documentId),
  //                 eq(documentTable.userId, userId)
  //               )
  //             )
  //             .returning();
  //         }

  //         if (personalInfo) {
  //           if (!personalInfo?.firstName && !personalInfo?.lastName) {
  //             return;
  //           }
  //           const exists = await trx
  //             .select()
  //             .from(personalInfoTable)
  //             .where(eq(personalInfoTable.docId, existingDocument.id))
  //             .limit(1);
  //           if (exists.length > 0) {
  //             await trx
  //               .update(personalInfoTable)
  //               .set(personalInfo)
  //               .where(eq(personalInfoTable.docId, existingDocument.id));
  //           } else {
  //             await trx
  //               .insert(personalInfoTable)
  //               .values({ docId: existingDocument.id, ...personalInfo });
  //           }
  //         }

  //         if (experience && Array.isArray(experience)) {
  //           const existingExperience = await trx
  //             .select()
  //             .from(experienceTable)
  //             .where(eq(experienceTable.docId, existingDocument.id));
  //           const existingExperienceMap = new Set(
  //             existingExperience.map((exp) => exp.id)
  //           );
  //           for (const exp of experience) {
  //             if (exp.id) {
  //               if (existingExperienceMap.has(exp.id)) {
  //                 const { id, ...updateData } = exp;
  //                 await trx
  //                   .update(experienceTable)
  //                   .set(updateData)
  //                   .where(
  //                     and(
  //                       eq(experienceTable.docId, existingDocument.id),
  //                       eq(experienceTable.id, id)
  //                     )
  //                   );
  //               } else {
  //                 const { id, ...insertData } = exp;
  //                 await trx
  //                   .insert(experienceTable)
  //                   .values({ docId: existingDocument.id, ...insertData });
  //               }
  //             }
  //           }
  //         }

  //         if (education && Array.isArray(education)) {
  //           const existingEducation = await trx
  //             .select()
  //             .from(educationTable)
  //             .where(eq(educationTable.docId, existingDocument.id));

  //           const existingEducationMap = new Set(
  //             existingEducation.map((edu) => edu.id)
  //           );

  //           for (const edu of education) {
  //             if (edu.id) {
  //               if (existingEducationMap.has(edu.id)) {
  //                 const { id, ...updateData } = edu;
  //                 await trx
  //                   .update(educationTable)
  //                   .set(updateData)
  //                   .where(
  //                     and(
  //                       eq(educationTable.docId, existingDocument.id),
  //                       eq(educationTable.id, id)
  //                     )
  //                   );
  //               } else {
  //                 const { id, ...insertData } = edu;
  //                 await trx
  //                   .insert(educationTable)
  //                   .values({ docId: existingDocument.id, ...insertData });
  //               }
  //             }
  //           }
  //         }

  //         if (skills && Array.isArray(skills)) {
  //           const existingSkills = await trx
  //             .select()
  //             .from(skillsTable)
  //             .where(eq(skillsTable.docId, existingDocument.id));

  //           const existingSkillsMap = new Set(
  //             existingSkills.map((skill) => skill.id)
  //           );

  //           for (const skill of skills) {
  //             if (skill.id) {
  //               if (existingSkillsMap.has(skill.id)) {
  //                 const { id, ...updateData } = skill;
  //                 await trx
  //                   .update(skillsTable)
  //                   .set(updateData)
  //                   .where(
  //                     and(
  //                       eq(skillsTable.docId, existingDocument.id),
  //                       eq(skillsTable.id, id)
  //                     )
  //                   );
  //               } else {
  //                 const { id, ...insertData } = skill;
  //                 await trx
  //                   .insert(skillsTable)
  //                   .values({ docId: existingDocument.id, ...insertData });
  //               }
  //             }
  //           }
  //         }
  //       });

  //       return c.json(
  //         { success: "ok", message: "Updated successfully" },
  //         { status: 200 }
  //       );
  //     } catch (error) {
  //       return c.json({
  //         success: false,
  //         message: "Failed to update document",
  //         error: error,
  //       });
  //     }
  //   }
  // )

  // below the first suggestion of hte patch endpoin by chatgpt
  // from await db.transaction(async (trx) [...] to console.log("⚠️ No personalInfo in payload");
  //   } was commented out in the second suggestion and it personal_info went through
  // but changes in the http structure were only applied to the personal INFO
  // the full updated patch endpoint is uncommented down there

  //   .patch(
  //     "/update/:documentId",
  //     zValidator("param", z.object({ documentId: z.string() })),
  //     zValidator("json", updateCombinedSchema),
  //     getAuthUser,
  //     async (c) => {
  //       try {
  //         const user = c.get("user");
  //         const { documentId } = c.req.valid("param");

  //         const {
  //           title,
  //           status,
  //           summary,
  //           thumbnail,
  //           themeColor,
  //           currentPosition,
  //           personalInfo,
  //           experience,
  //           education,
  //           skills,
  //         } = c.req.valid("json");
  //         const userId = user.id;

  //         if (!documentId) {
  //           console.log("❌ Missing documentId");
  //           return c.json({ error: "DocumentId is required" }, 400);
  //         }

  //         // await db.transaction(async (trx) => {
  //         //   const [existingDocument] = await trx
  //         //     .select()
  //         //     .from(documentTable)
  //         //     .where(
  //         //       and(
  //         //         eq(documentTable.documentId, documentId),
  //         //         eq(documentTable.userId, userId)
  //         //       )
  //         //     );

  //         //   if (!existingDocument) {
  //         //     console.log("❌ Document not found");
  //         //     return c.json({ error: "Document not found" }, 404);
  //         //   }

  //         //   const resumeUpdate = {} as UpdateDocumentSchema;
  //         //   if (title) resumeUpdate.title = title;
  //         //   if (thumbnail) resumeUpdate.thumbnail = thumbnail;
  //         //   if (summary) resumeUpdate.summary = summary;
  //         //   if (themeColor) resumeUpdate.themeColor = themeColor;
  //         //   if (status) resumeUpdate.status = status;
  //         //   if (currentPosition)
  //         //     resumeUpdate.currentPosition = currentPosition || 1;

  //         //   if (Object.keys(resumeUpdate)?.length > 0) {
  //         //     console.log("🔧 Updating document table with:", resumeUpdate);
  //         //     await trx
  //         //       .update(documentTable)
  //         //       .set(resumeUpdate)
  //         //       .where(
  //         //         and(
  //         //           eq(documentTable.documentId, documentId),
  //         //           eq(documentTable.userId, userId)
  //         //         )
  //         //       )
  //         //       .returning();
  //         //   }

  //         //   // 👇 DEBUG: PERSONAL INFO BLOCK
  //         //   if (personalInfo) {
  //         //     console.log("📦 Received personalInfo payload:", personalInfo);

  //         //     if (!personalInfo?.firstName && !personalInfo?.lastName) {
  //         //       console.log("⚠️ Skipping personalInfo: no name fields present");
  //         //       return;
  //         //     }

  //         //     const exists = await trx
  //         //       .select()
  //         //       .from(personalInfoTable)
  //         //       .where(eq(personalInfoTable.docId, existingDocument.id))
  //         //       .limit(1);

  //         //     console.log("🧐 PersonalInfo already exists?", exists.length > 0);

  //         //     if (exists.length > 0) {
  //         //       console.log(
  //         //         "🔁 Updating personalInfo for docId:",
  //         //         existingDocument.id
  //         //       );
  //         //       await trx
  //         //         .update(personalInfoTable)
  //         //         .set(personalInfo)
  //         //         .where(eq(personalInfoTable.docId, existingDocument.id));
  //         //     } else {
  //         //       console.log(
  //         //         "🆕 Inserting personalInfo for docId:",
  //         //         existingDocument.id
  //         //       );
  //         //       await trx
  //         //         .insert(personalInfoTable)
  //         //         .values({ docId: existingDocument.id, ...personalInfo });
  //         //     }
  //         //   } else {
  //         //     console.log("⚠️ No personalInfo in payload");
  //         //   }

  //         //   // 💡 You can also add logs for experience, education, skills if needed later
  //         // });

  //         const [existingDocument] = await db
  //   .select()
  //   .from(documentTable)
  //   .where(
  //     and(
  //       eq(documentTable.documentId, documentId),
  //       eq(documentTable.userId, userId)
  //     )
  //   );

  // if (!existingDocument) {
  //   console.log("❌ Document not found");
  //   return c.json({ error: "Document not found" }, 404);
  // }

  // const resumeUpdate = {} as UpdateDocumentSchema;
  // if (title) resumeUpdate.title = title;
  // if (thumbnail) resumeUpdate.thumbnail = thumbnail;
  // if (summary) resumeUpdate.summary = summary;
  // if (themeColor) resumeUpdate.themeColor = themeColor;
  // if (status) resumeUpdate.status = status;
  // if (currentPosition)
  //   resumeUpdate.currentPosition = currentPosition || 1;

  // if (Object.keys(resumeUpdate)?.length > 0) {
  //   console.log("🔧 Updating document table with:", resumeUpdate);
  //   await db
  //     .update(documentTable)
  //     .set(resumeUpdate)
  //     .where(
  //       and(
  //         eq(documentTable.documentId, documentId),
  //         eq(documentTable.userId, userId)
  //       )
  //     );
  // }

  // // 💾 PERSONAL INFO
  // if (personalInfo) {
  //   console.log("📦 Received personalInfo payload:", personalInfo);

  //   if (!personalInfo?.firstName && !personalInfo?.lastName) {
  //     console.log("⚠️ Skipping personalInfo: no name fields present");
  //     return;
  //   }

  //   const exists = await db
  //     .select()
  //     .from(personalInfoTable)
  //     .where(eq(personalInfoTable.docId, existingDocument.id))
  //     .limit(1);

  //   console.log("🧐 PersonalInfo already exists?", exists.length > 0);

  //   if (exists.length > 0) {
  //     console.log("🔁 Updating personalInfo for docId:", existingDocument.id);
  //     await db
  //       .update(personalInfoTable)
  //       .set(personalInfo)
  //       .where(eq(personalInfoTable.docId, existingDocument.id));
  //   } else {
  //     console.log("🆕 Inserting personalInfo for docId:", existingDocument.id);
  //     await db
  //       .insert(personalInfoTable)
  //       .values({ docId: existingDocument.id, ...personalInfo });
  //   }
  // }

  // // ❌ Skip rewriting experience/education/skills for now to test insert

  //         console.log("✅ PATCH /update complete");
  //         return c.json(
  //           { success: "ok", message: "Updated successfully" },
  //           { status: 200 }
  //         );
  //       } catch (error) {
  //         console.log("🔥 Error in PATCH /update:", error);
  //         return c.json({
  //           success: false,
  //           message: "Failed to update document",
  //           error: error,
  //         });
  //       }
  //     }
  //   )

  .patch(
    "/update/:documentId",
    zValidator("param", z.object({ documentId: z.string() })),
    zValidator("json", updateCombinedSchema),
    getAuthUser,
    async (c) => {
      try {
        const user = c.get("user");
        const { documentId } = c.req.valid("param");

        const {
          title,
          status,
          summary,
          thumbnail,
          themeColor,
          currentPosition,
          personalInfo,
          experience,
          education,
          skills,
        } = c.req.valid("json");
        const userId = user.id;

        if (!documentId) {
          console.log("❌ Missing documentId");
          return c.json({ error: "DocumentId is required" }, 400);
        }

        const [existingDocument] = await db
          .select()
          .from(documentTable)
          .where(
            and(
              eq(documentTable.documentId, documentId),
              eq(documentTable.userId, userId)
            )
          );

        if (!existingDocument) {
          console.log("❌ Document not found");
          return c.json({ error: "Document not found" }, 404);
        }

        const resumeUpdate = {} as UpdateDocumentSchema;
        if (title) resumeUpdate.title = title;
        if (thumbnail) resumeUpdate.thumbnail = thumbnail;
        if (summary) resumeUpdate.summary = summary;
        if (themeColor) resumeUpdate.themeColor = themeColor;
        if (status) resumeUpdate.status = status;
        if (currentPosition)
          resumeUpdate.currentPosition = currentPosition || 1;

        if (Object.keys(resumeUpdate)?.length > 0) {
          console.log("🔧 Updating document table with:", resumeUpdate);
          await db
            .update(documentTable)
            .set(resumeUpdate)
            .where(
              and(
                eq(documentTable.documentId, documentId),
                eq(documentTable.userId, userId)
              )
            );
        }

        // 💾 PERSONAL INFO
        if (personalInfo) {
          console.log("📦 Received personalInfo payload:", personalInfo);

          if (!personalInfo?.firstName && !personalInfo?.lastName) {
            console.log("⚠️ Skipping personalInfo: no name fields present");
          } else {
            const exists = await db
              .select()
              .from(personalInfoTable)
              .where(eq(personalInfoTable.docId, existingDocument.id))
              .limit(1);

            if (exists.length > 0) {
              console.log(
                "🔁 Updating personalInfo for docId:",
                existingDocument.id
              );
              await db
                .update(personalInfoTable)
                .set(personalInfo)
                .where(eq(personalInfoTable.docId, existingDocument.id));
            } else {
              console.log(
                "🆕 Inserting personalInfo for docId:",
                existingDocument.id
              );
              await db
                .insert(personalInfoTable)
                .values({ docId: existingDocument.id, ...personalInfo });
            }
          }
        }

        // 💼 EXPERIENCE
        if (experience && Array.isArray(experience)) {
          const existingExperience = await db
            .select()
            .from(experienceTable)
            .where(eq(experienceTable.docId, existingDocument.id));

          const existingExperienceMap = new Set(
            existingExperience.map((exp) => exp.id)
          );

          for (const exp of experience) {
            if (exp.id) {
              if (existingExperienceMap.has(exp.id)) {
                const { id, ...updateData } = exp;
                await db
                  .update(experienceTable)
                  .set(updateData)
                  .where(
                    and(
                      eq(experienceTable.docId, existingDocument.id),
                      eq(experienceTable.id, id)
                    )
                  );
              } else {
                const { id, ...insertData } = exp;
                await db
                  .insert(experienceTable)
                  .values({ docId: existingDocument.id, ...insertData });
              }
            }
          }
        }

        // 🎓 EDUCATION
        if (education && Array.isArray(education)) {
          const existingEducation = await db
            .select()
            .from(educationTable)
            .where(eq(educationTable.docId, existingDocument.id));

          const existingEducationMap = new Set(
            existingEducation.map((edu) => edu.id)
          );

          for (const edu of education) {
            if (edu.id) {
              if (existingEducationMap.has(edu.id)) {
                const { id, ...updateData } = edu;
                await db
                  .update(educationTable)
                  .set(updateData)
                  .where(
                    and(
                      eq(educationTable.docId, existingDocument.id),
                      eq(educationTable.id, id)
                    )
                  );
              } else {
                const { id, ...insertData } = edu;
                await db
                  .insert(educationTable)
                  .values({ docId: existingDocument.id, ...insertData });
              }
            }
          }
        }

        // 🧠 SKILLS
        if (skills && Array.isArray(skills)) {
          const existingSkills = await db
            .select()
            .from(skillsTable)
            .where(eq(skillsTable.docId, existingDocument.id));

          const existingSkillsMap = new Set(
            existingSkills.map((skill) => skill.id)
          );

          for (const skill of skills) {
            if (skill.id) {
              if (existingSkillsMap.has(skill.id)) {
                const { id, ...updateData } = skill;
                await db
                  .update(skillsTable)
                  .set(updateData)
                  .where(
                    and(
                      eq(skillsTable.docId, existingDocument.id),
                      eq(skillsTable.id, id)
                    )
                  );
              } else {
                const { id, ...insertData } = skill;
                await db
                  .insert(skillsTable)
                  .values({ docId: existingDocument.id, ...insertData });
              }
            }
          }
        }

        console.log("✅ PATCH /update complete");
        return c.json(
          { success: "ok", message: "Updated successfully" },
          { status: 200 }
        );
      } catch (error) {
        console.log("🔥 Error in PATCH /update:", error);
        return c.json({
          success: false,
          message: "Failed to update document",
          error: error,
        });
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
  })
  .get(
    //new, gotta check if this "z" stuff is gonna work
    "/:documentId",
    zValidator("param", z.object({ documentId: z.string() })),
    getAuthUser,
    async (c) => {
      try {
        const user = c.get("user");
        const { documentId } = c.req.valid("param");

        const userId = user?.id;
        const documentData = await db.query.documentTable.findFirst({
          where: and(
            eq(documentTable.userId, userId),
            eq(documentTable.documentId, documentId)
          ),
          with: {
            personalInfo: true,
            experiences: true,
            educations: true,
            skills: true,
          },
        });
        return c.json({
          success: true,
          data: documentData,
        });
      } catch (error) {
        return c.json({
          success: false,
          message: "Failed to fetch documents",
          error: error,
        });
      }
    }
  );

export default documentRoute;
