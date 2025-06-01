import { NextResponse } from "next/server";
import { generateResumeSummary } from "@/lib/openai-server";

export async function POST(req: Request) {
  try {
    const { jobTitle } = await req.json();

    if (!jobTitle) {
      return NextResponse.json(
        { error: "Missing jobTitle in request" },
        { status: 400 }
      );
    }

    const summary = await generateResumeSummary(jobTitle);
    return NextResponse.json({ summary });
  } catch (err) {
    console.error("OpenAI summary error:", err);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
