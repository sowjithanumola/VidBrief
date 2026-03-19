import express from "express";
import * as YoutubeTranscript from "youtube-transcript";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set in the environment.");
}
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

app.get("/api/transcript", async (req, res) => {
  const { url } = req.query;
  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Missing YouTube URL" });
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    res.json({ transcript });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    res.status(500).json({ error: "Failed to fetch transcript" });
  }
});

app.post("/api/summarize", async (req, res) => {
  const { transcript } = req.body;
  if (!transcript) {
    return res.status(400).json({ error: "Missing transcript" });
  }

  if (!apiKey) {
    return res.status(500).json({ error: "Gemini API key is not configured." });
  }

  try {
    const prompt = `Summarize the following YouTube video transcript:
    ${transcript}
    
    Please provide:
    1) A short paragraph summary.
    2) Bullet points explaining the main ideas.
    3) Key takeaways.
    4) Structured notes for studying.
    
    IMPORTANT: Provide ONLY the summary content. Do not include any introductory or concluding remarks, branding, or phrases like "Powered by Gemini".`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    res.json({ summary: response.text });
  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ error: "Failed to generate summary. Please check your API key and try again." });
  }
});

// Vite middleware setup
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
