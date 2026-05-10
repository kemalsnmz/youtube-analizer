import type { CompetitorReport } from "../types";

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry {
  report: CompetitorReport;
  expiresAt: number;
}

// Module-level in-memory cache (survives across requests in same process)
const store = new Map<string, CacheEntry>();

export function getCachedReport(channelId: string): CompetitorReport | null {
  const entry = store.get(channelId);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(channelId);
    return null;
  }
  return entry.report;
}

export function setCachedReport(channelId: string, report: CompetitorReport): void {
  store.set(channelId, {
    report,
    expiresAt: Date.now() + TTL_MS,
  });
}

export function clearCache(): void {
  store.clear();
}
