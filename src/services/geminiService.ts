import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function generateSummary(transcript: string) {
  const prompt = `Summarize the following YouTube video transcript:
  ${transcript}
  
  Please provide:
  1) A short paragraph summary.
  2) Bullet points explaining the main ideas.
  3) Key takeaways.
  4) Structured notes for studying.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });

  return response.text;
}
