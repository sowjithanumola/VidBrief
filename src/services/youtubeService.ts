export async function getTranscript(url: string) {
  const response = await fetch(`/api/transcript?url=${encodeURIComponent(url)}`);
  if (!response.ok) {
    throw new Error("Failed to fetch transcript");
  }
  const data = await response.json();
  return data.transcript;
}
