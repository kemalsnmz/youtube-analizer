import { embed, cosineSimilarity } from "../embeddings/tfidf";
import { getDb } from "../db/client";
import type { SearchQuery, SearchResult, KnowledgeSourcePreview } from "../types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildFtsQuery(q: string): string {
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .map((w) => `"${w.replace(/"/g, "")}"`)
    .join(" OR ");
}

const CHUNK_JOIN_SQL = `
  SELECT c.id, c.source_id, c.text, c.idx, e.vector,
         s.url, s.source_type, s.title, s.summary, s.tags,
         s.status, s.error_msg, s.word_count, s.created_at, s.updated_at,
         (SELECT COUNT(*) FROM chunks WHERE source_id = c.source_id) AS chunk_count
  FROM chunks c
  JOIN embeddings e ON e.chunk_id = c.id
  JOIN sources s    ON s.id = c.source_id
  WHERE s.status = 'ready'
`;

function rowsToResults(rows: Record<string, unknown>[], qVec: number[], minScore: number): SearchResult[] {
  const results: SearchResult[] = [];
  for (const row of rows) {
    const embedding = JSON.parse((row.vector as string) ?? "[]") as number[];
    const score = cosineSimilarity(qVec, embedding);
    if (score < minScore) continue;

    const source: KnowledgeSourcePreview = {
      id:           row.source_id as string,
      url:          row.url as string,
      sourceType:   row.source_type as KnowledgeSourcePreview["sourceType"],
      title:        row.title as string,
      summary:      row.summary as string,
      tags:         JSON.parse((row.tags as string) ?? "[]") as string[],
      status:       row.status as KnowledgeSourcePreview["status"],
      errorMessage: (row.error_msg as string | null) ?? undefined,
      wordCount:    row.word_count as number,
      chunkCount:   row.chunk_count as number,
      rawText:      "",
      createdAt:    row.created_at as string,
      updatedAt:    row.updated_at as string,
    };

    results.push({
      chunk: {
        id:        row.id as string,
        sourceId:  row.source_id as string,
        text:      row.text as string,
        index:     row.idx as number,
        embedding,
      },
      source,
      score,
    });
  }
  return results.sort((a, b) => b.score - a.score);
}

// ─── Public ───────────────────────────────────────────────────────────────────

export function semanticSearch(query: SearchQuery): SearchResult[] {
  const { query: q, limit = 5, minScore = 0.05 } = query;
  const qVec = embed(q);
  const db = getDb();

  // FTS5 ön-filtre — ilgili chunk rowid'lerini bul
  let rows: Record<string, unknown>[];
  try {
    const ftsQ = buildFtsQuery(q);
    const ftsHits = db
      .prepare(`SELECT rowid FROM chunks_fts WHERE text MATCH ? LIMIT 1000`)
      .all(ftsQ) as { rowid: number }[];

    if (ftsHits.length > 0) {
      const placeholders = ftsHits.map(() => "?").join(",");
      rows = db
        .prepare(`${CHUNK_JOIN_SQL} AND c.rowid IN (${placeholders})`)
        .all(...ftsHits.map((r) => r.rowid)) as Record<string, unknown>[];
    } else {
      // FTS eşleşmesi yoksa tam tarama
      rows = db.prepare(CHUNK_JOIN_SQL).all() as Record<string, unknown>[];
    }
  } catch {
    // FTS hatası → tam tarama
    rows = db.prepare(CHUNK_JOIN_SQL).all() as Record<string, unknown>[];
  }

  return rowsToResults(rows, qVec, minScore).slice(0, limit);
}
