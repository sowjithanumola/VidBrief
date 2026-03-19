export async function generateSummary(transcript: string) {
  const response = await fetch("/api/summarize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transcript }),
  });
  if (!response.ok) {
    throw new Error("Failed to generate summary");
  }
  const data = await response.json();
  return data.summary;
}
