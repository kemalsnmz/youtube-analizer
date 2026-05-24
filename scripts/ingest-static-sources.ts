import { STATIC_SOURCES } from "../src/features/knowledge-agent/agent/topics";
import { ingestUrl } from "../src/features/knowledge-agent/pipeline/ingestPipeline";
import { getSourceByUrl } from "../src/features/knowledge-agent/embeddings/vectorStore";

const DELAY_MS = 1500;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const toIngest = STATIC_SOURCES.filter((s) => {
    const existing = getSourceByUrl(s.url);
    return !existing || existing.status !== "ready";
  });

  console.log(`Toplam: ${STATIC_SOURCES.length} kaynak — ${toIngest.length} eksik, ${STATIC_SOURCES.length - toIngest.length} zaten mevcut\n`);

  let ok = 0, cached = 0, failed = 0;

  for (const src of toIngest) {
    try {
      const result = await ingestUrl({ url: src.url });
      if (result.cached) {
        cached++;
        console.log(`[MEVCUT] ${result.source.title}`);
      } else {
        ok++;
        console.log(`[OK] ${result.source.title}`);
      }
    } catch (err) {
      failed++;
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`[HATA] ${src.url} — ${msg.slice(0, 80)}`);
    }
    await sleep(DELAY_MS);
  }

  console.log(`\nTamamlandı: ${ok} yeni, ${cached} mevcut, ${failed} hata`);
}

main().catch(console.error);
