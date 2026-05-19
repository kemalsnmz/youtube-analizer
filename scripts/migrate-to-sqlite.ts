/**
 * One-time migration: data/knowledge/store.json → SQLite
 *
 * Usage:
 *   npx tsx --tsconfig tsconfig.json scripts/migrate-to-sqlite.ts
 *
 * Idempotent: sources already in DB (matched by URL) are skipped.
 */

import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import { initSchema } from "../src/features/knowledge-agent/db/schema";
import type { KnowledgeSource } from "../src/features/knowledge-agent/types";

const STORE_PATH = path.join(process.cwd(), "data", "knowledge", "store.json");
const DB_PATH    = path.join(process.cwd(), "data", "knowledge", "knowledge.db");

// ─── Load JSON store ──────────────────────────────────────────────────────────

if (!fs.existsSync(STORE_PATH)) {
  console.log("store.json bulunamadı — migrate edilecek veri yok.");
  process.exit(0);
}

interface OldStore {
  sources: KnowledgeSource[];
  lastResearchAt?: string | null;
}

const raw = fs.readFileSync(STORE_PATH, "utf-8");
const store: OldStore = JSON.parse(raw) as OldStore;
const sources: KnowledgeSource[] = store.sources ?? [];

console.log(`store.json okundu — ${sources.length} kaynak bulundu.`);

// ─── Open / init DB ───────────────────────────────────────────────────────────

const db = new Database(DB_PATH);
initSchema(db);

// ─── Prepared statements ──────────────────────────────────────────────────────

const existsStmt  = db.prepare<[string], { cnt: number }>(`SELECT COUNT(*) as cnt FROM sources WHERE url = ?`);
const insSource   = db.prepare(`
  INSERT OR IGNORE INTO sources
    (id, url, source_type, title, raw_text, summary, tags, status, error_msg, word_count, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
const insChunk    = db.prepare(`INSERT OR IGNORE INTO chunks (id, source_id, text, idx) VALUES (?, ?, ?, ?)`);
const insEmbed    = db.prepare(`INSERT OR IGNORE INTO embeddings (chunk_id, vector) VALUES (?, ?)`);
const insMeta     = db.prepare(`INSERT OR REPLACE INTO metadata (key, value) VALUES (?, ?)`);

// ─── Migrate ──────────────────────────────────────────────────────────────────

let skipped = 0;
let inserted = 0;

const migrate = db.transaction(() => {
  for (const src of sources) {
    const { cnt } = existsStmt.get(src.url)!;
    if (cnt > 0) {
      skipped++;
      continue;
    }

    insSource.run(
      src.id,
      src.url,
      src.sourceType,
      src.title,
      src.rawText ?? "",
      src.summary ?? "",
      JSON.stringify(src.tags ?? []),
      src.status,
      src.errorMessage ?? null,
      src.wordCount ?? 0,
      src.createdAt,
      src.updatedAt,
    );

    for (const chunk of src.chunks ?? []) {
      insChunk.run(chunk.id, chunk.sourceId, chunk.text, chunk.index);
      insEmbed.run(chunk.id, JSON.stringify(chunk.embedding ?? []));
    }

    inserted++;
  }

  if (store.lastResearchAt) {
    insMeta.run("lastResearchAt", store.lastResearchAt);
  }
});

migrate();

console.log(`Migration tamamlandı — ${inserted} eklendi, ${skipped} atlandı.`);
console.log(`DB: ${DB_PATH}`);
