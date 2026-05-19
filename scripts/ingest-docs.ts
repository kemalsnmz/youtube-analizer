#!/usr/bin/env tsx
/**
 * Sadece STATIC_SOURCES (web makaleleri) ingest eden standalone script.
 * YouTube video arama döngüsü yok — sadece belgeler.
 *
 * Çalıştır: npx tsx scripts/ingest-docs.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually
try {
  const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
} catch { /* .env.local yoksa devam et */ }

import { STATIC_SOURCES } from "../src/features/knowledge-agent/agent/topics";
import { executeIngestUrl } from "../src/features/knowledge-agent/agent/agentTools";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const GRAY = "\x1b[90m";
const RESET = "\x1b[0m";

async function main() {
  console.log(`\n🔎 Doküman ingest başlıyor — ${STATIC_SOURCES.length} kaynak\n`);

  let ingested = 0;
  let cached = 0;
  let errors = 0;

  for (let i = 0; i < STATIC_SOURCES.length; i++) {
    const src = STATIC_SOURCES[i];
    const prefix = `[${String(i + 1).padStart(2, "0")}/${STATIC_SOURCES.length}]`;

    process.stdout.write(`${GRAY}${prefix}${RESET} ${src.url.slice(0, 70)}...`);

    try {
      const raw = await executeIngestUrl(src.url);
      const result = JSON.parse(raw) as {
        success: boolean;
        title?: string;
        wordCount?: number;
        cached?: boolean;
        error?: string;
      };

      if (result.success) {
        if (result.cached) {
          cached++;
          console.log(` ${YELLOW}CACHED${RESET}`);
        } else {
          ingested++;
          console.log(` ${GREEN}OK${RESET} — "${result.title?.slice(0, 50)}" (${result.wordCount} kelime)`);
        }
      } else {
        errors++;
        console.log(` ${RED}HATA${RESET} — ${result.error}`);
      }
    } catch (e) {
      errors++;
      console.log(` ${RED}HATA${RESET} — ${e instanceof Error ? e.message : "?"}`);
    }
  }

  console.log(`
╔══════════════════════════════════════╗
║  Doküman İngest Tamamlandı           ║
║  ✅ Yeni: ${String(ingested).padEnd(28)}║
║  🔄 Cached: ${String(cached).padEnd(25)}║
║  ❌ Hata: ${String(errors).padEnd(27)}║
╚══════════════════════════════════════╝
`);
}

main().catch((e) => {
  console.error("Script hatası:", e);
  process.exit(1);
});
