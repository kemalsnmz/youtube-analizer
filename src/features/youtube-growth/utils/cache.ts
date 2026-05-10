import type { GrowthAnalysisReport } from "../types";

const TTL = 24 * 60 * 60 * 1000;
const store = new Map<string, { report: GrowthAnalysisReport; expiresAt: number }>();

export function getCachedReport(channelId: string): GrowthAnalysisReport | null {
  const entry = store.get(channelId);
  if (!entry || Date.now() > entry.expiresAt) {
    store.delete(channelId);
    return null;
  }
  return entry.report;
}

export function setCachedReport(channelId: string, report: GrowthAnalysisReport): void {
  store.set(channelId, { report, expiresAt: Date.now() + TTL });
}
