import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateResumeSummary = async (jobTitle: string) => {
  const prompt = `Job Title: ${jobTitle}.
 Based on the job title, generate concise and complete summaries for a resume in JSON format for fresher, mid and experienced levels.
 Each summary should be limited to 3 to 4 lines, reflecting a personal tone and showcasing specific relevant aspects of the user's job title.
 Ensure that the summaries are engaging and tailored to highlight unique strengths, aspirations, and contributions to collaborative projects, demonstrating a clear understanding of the role and industry standards.
 JSON format must follow this fashion (you're a model inside an application, always bring only JSON, no titles, no nothing... just plain JSON):
 {
   "fresher": {
     "summary": ""
   },
   "mid": {
     "summary": ""
   },
   "experienced": {
     "summary": ""
   }
 }`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 1,
    max_tokens: 600,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("No content returned from OpenAI");

  const parsed = JSON.parse(raw);
  return parsed;
};
