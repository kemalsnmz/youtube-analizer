import type { KnowledgeSource, KnowledgeStore } from "../types";
import { getDb } from "../db/client";

// ─── Row types ────────────────────────────────────────────────────────────────

interface SourceRow {
  id: string; url: string; source_type: string; title: string;
  raw_text: string; summary: string; tags: string; status: string;
  error_msg: string | null; word_count: number;
  created_at: string; updated_at: string;
}

interface ChunkRow {
  id: string; source_id: string; text: string; idx: number; vector: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function rowToSource(row: SourceRow, chunkRows: ChunkRow[]): KnowledgeSource {
  return {
    id: row.id,
    url: row.url,
    sourceType: row.source_type as KnowledgeSource["sourceType"],
    title: row.title,
    rawText: row.raw_text,
    summary: row.summary,
    tags: JSON.parse(row.tags) as string[],
    chunks: chunkRows.map((c) => ({
      id: c.id,
      sourceId: c.source_id,
      text: c.text,
      index: c.idx,
      embedding: JSON.parse(c.vector ?? "[]") as number[],
    })),
    status: row.status as KnowledgeSource["status"],
    errorMessage: row.error_msg ?? undefined,
    wordCount: row.word_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const SELECT_CHUNKS = `
  SELECT c.id, c.source_id, c.text, c.idx, e.vector
  FROM chunks c
  LEFT JOIN embeddings e ON e.chunk_id = c.id
  WHERE c.source_id = ?
  ORDER BY c.idx
`;

// ─── Public API ───────────────────────────────────────────────────────────────

export function readStore(): KnowledgeStore {
  const db = getDb();
  const rows = db.prepare(
    `SELECT id, url, source_type, title, '' as raw_text, summary, tags,
            status, error_msg, word_count, created_at, updated_at
     FROM sources`
  ).all() as SourceRow[];

  const meta = db.prepare(
    `SELECT value FROM metadata WHERE key = 'lastResearchAt'`
  ).get() as { value: string } | undefined;

  return {
    sources: rows.map((r) => rowToSource(r, [])),
    updatedAt: new Date().toISOString(),
    lastResearchAt: meta?.value ?? null,
  };
}

export function saveSource(source: KnowledgeSource): void {
  const db = getDb();
  const now = new Date().toISOString();

  db.transaction(() => {
    db.prepare(`
      INSERT OR REPLACE INTO sources
        (id, url, source_type, title, raw_text, summary, tags, status, error_msg, word_count, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      source.id, source.url, source.sourceType, source.title,
      source.rawText, source.summary, JSON.stringify(source.tags),
      source.status, source.errorMessage ?? null, source.wordCount,
      source.createdAt, now,
    );

    // Cascade siler: chunks → embeddings + FTS trigger
    db.prepare(`DELETE FROM chunks WHERE source_id = ?`).run(source.id);

    const insChunk = db.prepare(
      `INSERT INTO chunks (id, source_id, text, idx) VALUES (?, ?, ?, ?)`
    );
    const insEmbed = db.prepare(
      `INSERT INTO embeddings (chunk_id, vector) VALUES (?, ?)`
    );

    for (const chunk of source.chunks) {
      insChunk.run(chunk.id, chunk.sourceId, chunk.text, chunk.index);
      insEmbed.run(chunk.id, JSON.stringify(chunk.embedding));
    }
  })();
}

export function deleteSource(id: string): boolean {
  const db = getDb();
  const res = db.prepare(`DELETE FROM sources WHERE id = ?`).run(id);
  return res.changes > 0;
}

export function getSourceByUrl(url: string): KnowledgeSource | undefined {
  const db = getDb();
  const row = db.prepare(`SELECT * FROM sources WHERE url = ?`).get(url) as SourceRow | undefined;
  if (!row) return undefined;
  const chunks = db.prepare(SELECT_CHUNKS).all(row.id) as ChunkRow[];
  return rowToSource(row, chunks);
}

export function getAllSources(): KnowledgeSource[] {
  const db = getDb();
  const rows = db.prepare(
    `SELECT * FROM sources WHERE status = 'ready'`
  ).all() as SourceRow[];

  const getChunks = db.prepare(SELECT_CHUNKS);
  return rows.map((row) => {
    const chunks = getChunks.all(row.id) as ChunkRow[];
    return rowToSource(row, chunks);
  });
}

export function markResearchCompleted(): void {
  getDb()
    .prepare(`INSERT OR REPLACE INTO metadata (key, value) VALUES ('lastResearchAt', ?)`)
    .run(new Date().toISOString());
}
