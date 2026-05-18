export async function collectPdf(url: string): Promise<{ title: string; text: string }> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; KnowledgeAgent/1.0)" },
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) throw new Error(`PDF fetch failed: ${res.status}`);

  const buffer = Buffer.from(await res.arrayBuffer());

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string; info?: { Title?: string } }>;
  const data = await pdfParse(buffer);

  const title =
    data.info?.Title?.trim() ||
    url.split("/").pop()?.replace(/\.pdf$/i, "").replace(/[-_]/g, " ") ||
    "PDF Belgesi";

  const text = data.text.replace(/\s+/g, " ").trim();

  return { title, text };
}
