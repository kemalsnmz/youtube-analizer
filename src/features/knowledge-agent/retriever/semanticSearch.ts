import { embed, cosineSimilarity } from "../embeddings/tfidf";
import { getAllSources } from "../embeddings/vectorStore";
import type { SearchQuery, SearchResult, KnowledgeSourcePreview } from "../types";

function toPreview(source: import("../types").KnowledgeSource): KnowledgeSourcePreview {
  return {
    id: source.id,
    url: source.url,
    sourceType: source.sourceType,
    title: source.title,
    summary: source.summary,
    tags: source.tags,
    status: source.status,
    errorMessage: source.errorMessage,
    wordCount: source.wordCount,
    chunkCount: source.chunks.length,
    rawText: source.rawText.slice(0, 200),
    createdAt: source.createdAt,
    updatedAt: source.updatedAt,
  };
}

export function semanticSearch(query: SearchQuery): SearchResult[] {
  const { query: q, limit = 5, minScore = 0.05 } = query;
  const qVec = embed(q);
  const sources = getAllSources();
  const results: SearchResult[] = [];

  for (const source of sources) {
    if (source.status !== "ready") continue;
    for (const chunk of source.chunks) {
      const score = cosineSimilarity(qVec, chunk.embedding);
      if (score >= minScore) {
        results.push({ chunk, source: toPreview(source), score });
      }
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
