// Working version without prompt

// import { NextResponse } from "next/server";
// import { generateResumeSummary } from "@/lib/openai-server";

// export async function POST(req: Request) {
//   try {
//     const { jobTitle } = await req.json();

//     if (!jobTitle) {
//       return NextResponse.json(
//         { error: "Missing jobTitle in request" },
//         { status: 400 }
//       );
//     }

//     const summary = await generateResumeSummary(jobTitle);
//     return NextResponse.json({ summary });
//   } catch (err) {
//     console.error("OpenAI summary error:", err);
//     return NextResponse.json(
//       { error: "Failed to generate summary" },
//       { status: 500 }
//     );
//   }
// }

import { OpenAI } from "openai";
import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = new Hono().basePath("/api/openai/summary");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/", async (c) => {
  try {
    const { jobTitle, prompt: rawPrompt, aiType } = await c.req.json();

    if (!jobTitle || !rawPrompt || !aiType) {
      return c.json({ error: "Missing jobTitle, prompt, or aiType" }, 400);
    }

    const prompt = rawPrompt.replace("{jobTitle}", jobTitle);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const result = response.choices[0].message.content;

    console.log("Raw OpenAI response:", result);

    if (aiType === "summary") {
      // Expect valid JSON object for SummaryForm
      return c.json({ summary: JSON.parse(result!) });
    } else {
      // For experience (HTML), just return raw string
      return c.json({ summary: result });
    }
  } catch (error: any) {
    console.error("OpenAI error:", error);
    return c.json({ error: "Failed to generate summary" }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
