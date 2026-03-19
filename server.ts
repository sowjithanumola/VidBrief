import express from "express";
import { YoutubeTranscript } from "youtube-transcript";

const app = express();
const PORT = 3000;

app.use(express.json());

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
