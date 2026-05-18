import { randomUUID } from "crypto";
import type { KnowledgeSource, IngestRequest, SourceType } from "../types";
import { parseVideoId, collectYoutubeVideo } from "../collectors/youtubeCollector";
import { collectArticle } from "../collectors/articleCollector";
import { collectPdf } from "../collectors/pdfCollector";
import { writeToObsidian } from "../collectors/obsidianWriter";
import { cleanText, countWords } from "../processors/textCleaner";
import { chunkText } from "../processors/chunker";
import { summarizeText } from "../processors/summarizer";
import { embed } from "../embeddings/tfidf";
import { saveSource, getSourceByUrl } from "../embeddings/vectorStore";

function detectSourceType(url: string): SourceType {
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/\.pdf(\?|$)/i.test(url)) return "pdf";
  return "article";
}

export async function ingestUrl(
  request: IngestRequest
): Promise<{ source: KnowledgeSource; cached: boolean }> {
  const { url } = request;
  const sourceType = request.sourceType ?? detectSourceType(url);

  const existing = getSourceByUrl(url);
  if (existing?.status === "ready") return { source: existing, cached: true };

  let rawTitle = url;
  let rawText = "";
  let extraTags: string[] = [];

  if (sourceType === "youtube") {
    const videoId = parseVideoId(url);
    if (!videoId) throw new Error("Geçersiz YouTube URL'si.");
    const result = await collectYoutubeVideo(videoId);
    rawTitle = result.title;
    rawText = result.text;
    extraTags = result.tags;
  } else if (sourceType === "pdf") {
    const result = await collectPdf(url);
    rawTitle = result.title;
    rawText = result.text;
  } else {
    const result = await collectArticle(url);
    rawTitle = result.title;
    rawText = result.text;
  }

  const cleaned = cleanText(rawText);
  const wordCount = countWords(cleaned);
  const textChunks = chunkText(cleaned);
  const { summary, tags } = await summarizeText(cleaned);

  const allTags = Array.from(new Set([...tags, ...extraTags.slice(0, 3)]));

  const id = randomUUID();
  const now = new Date().toISOString();

  const source: KnowledgeSource = {
    id,
    url,
    sourceType,
    title: rawTitle,
    rawText: cleaned,
    summary,
    tags: allTags,
    chunks: textChunks.map((text, index) => ({
      id: `${id}-${index}`,
      sourceId: id,
      text,
      index,
      embedding: embed(text),
    })),
    status: "ready",
    wordCount,
    createdAt: now,
    updatedAt: now,
  };

  saveSource(source);
  writeToObsidian(source);
  return { source, cached: false };
}
