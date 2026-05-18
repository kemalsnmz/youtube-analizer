import { readStore } from "../embeddings/vectorStore";
import { runResearchAgent } from "./researchAgent";

const INTERVAL_MS = 24 * 60 * 60 * 1000;
const STALE_THRESHOLD_DAYS = Number(process.env.RESEARCH_STALE_DAYS ?? 7);

let isRunning = false;

function isResearchNeeded(): boolean {
  try {
    const store = readStore();
    if (store.sources.length === 0) return true;
    if (!store.lastResearchAt) return true;
    const days =
      (Date.now() - new Date(store.lastResearchAt).getTime()) /
      (1000 * 60 * 60 * 24);
    return days >= STALE_THRESHOLD_DAYS;
  } catch {
    return false;
  }
}

async function runIfNeeded(): Promise<void> {
  if (isRunning) return;
  if (!isResearchNeeded()) return;

  isRunning = true;
  console.log("[Research Agent] Arka plan araştırması başlatıldı.");

  try {
    await runResearchAgent((event) => {
      if (event.type === "search")
        console.log(`[Research Agent] Aranıyor: ${event.query}`);
      if (event.type === "ingest" && event.status === "ok")
        console.log(`[Research Agent] Eklendi: ${event.title}`);
      if (event.type === "done")
        console.log(`[Research Agent] Tamamlandı: ${event.summary}`);
      if (event.type === "error")
        console.error(`[Research Agent] Hata: ${event.message}`);
    });
  } catch (err) {
    console.error("[Research Agent] Beklenmeyen hata:", err);
  } finally {
    isRunning = false;
  }
}

// Global guard — hot-reload'da çift interval açılmasını önler
const g = globalThis as typeof globalThis & { __researchScheduled?: boolean };

export function scheduleBackgroundResearch(): void {
  if (g.__researchScheduled) return;
  g.__researchScheduled = true;

  void runIfNeeded();

  const handle = setInterval(() => void runIfNeeded(), INTERVAL_MS);
  // Node.js process'i sadece bu interval için canlı tutma
  if (typeof handle.unref === "function") handle.unref();
}
