import fs from "fs";
import path from "path";
import type { KnowledgeSource, KnowledgeStore } from "../types";

const STORE_PATH = path.join(process.cwd(), "data", "knowledge", "store.json");

function ensureDir(): void {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function readStore(): KnowledgeStore {
  ensureDir();
  if (!fs.existsSync(STORE_PATH)) {
    return { sources: [], updatedAt: new Date().toISOString(), lastResearchAt: null };
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    const store = JSON.parse(raw) as KnowledgeStore;
    return { ...store, lastResearchAt: store.lastResearchAt ?? null };
  } catch {
    return { sources: [], updatedAt: new Date().toISOString(), lastResearchAt: null };
  }
}

function writeStore(store: KnowledgeStore): void {
  ensureDir();
  store.updatedAt = new Date().toISOString();
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

export function saveSource(source: KnowledgeSource): void {
  const store = readStore();
  const idx = store.sources.findIndex((s) => s.id === source.id);
  if (idx >= 0) {
    store.sources[idx] = source;
  } else {
    store.sources.push(source);
  }
  writeStore(store);
}

export function deleteSource(id: string): boolean {
  const store = readStore();
  const before = store.sources.length;
  store.sources = store.sources.filter((s) => s.id !== id);
  if (store.sources.length === before) return false;
  writeStore(store);
  return true;
}

export function getSourceByUrl(url: string): KnowledgeSource | undefined {
  return readStore().sources.find((s) => s.url === url);
}

export function getAllSources(): KnowledgeSource[] {
  return readStore().sources;
}

export function markResearchCompleted(): void {
  const store = readStore();
  store.lastResearchAt = new Date().toISOString();
  writeStore(store);
}
