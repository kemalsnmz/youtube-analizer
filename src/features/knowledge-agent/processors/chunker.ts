const CHUNK_SIZE = 400;
const OVERLAP = 50;

export function chunkText(text: string): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= CHUNK_SIZE) return [text];

  const chunks: string[] = [];
  let start = 0;

  while (start < words.length) {
    const end = Math.min(start + CHUNK_SIZE, words.length);
    chunks.push(words.slice(start, end).join(" "));
    if (end >= words.length) break;
    start = end - OVERLAP;
  }

  return chunks;
}
