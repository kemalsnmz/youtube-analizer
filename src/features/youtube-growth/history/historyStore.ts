import fs from "fs";
import path from "path";
import type {
  AnalysisHistoryEntry,
  AnalysisHistoryStore,
  GrowthAnalysisReport,
} from "../types";

const HISTORY_DIR = path.join(process.cwd(), "data", "history");
const STORE_PATH = path.join(HISTORY_DIR, "analyses.json");
const REPORTS_DIR = path.join(HISTORY_DIR, "reports");
const MAX_ENTRIES = 50;

let writeQueue: Promise<void> = Promise.resolve();

function ensureDirs(): void {
  if (!fs.existsSync(HISTORY_DIR)) fs.mkdirSync(HISTORY_DIR, { recursive: true });
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function readStore(): AnalysisHistoryStore {
  ensureDirs();
  if (!fs.existsSync(STORE_PATH)) {
    return { entries: [], updatedAt: new Date().toISOString() };
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf-8");
    return JSON.parse(raw) as AnalysisHistoryStore;
  } catch {
    return { entries: [], updatedAt: new Date().toISOString() };
  }
}

function writeStore(store: AnalysisHistoryStore): void {
  ensureDirs();
  store.updatedAt = new Date().toISOString();
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
}

function queueWrite(fn: () => void): void {
  writeQueue = writeQueue.then(() => { fn(); }).catch(() => { fn(); });
}

export function saveAnalysis(report: GrowthAnalysisReport): AnalysisHistoryEntry {
  const id = `${report.channel.id}_${Date.now()}`;
  const reportFile = path.join(REPORTS_DIR, `${id}.json`);

  ensureDirs();
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2), "utf-8");

  const entry: AnalysisHistoryEntry = {
    id,
    channelId: report.channel.id,
    channelTitle: report.channel.title,
    channelThumbnailUrl: report.channel.thumbnailUrl ?? "",
    channelCustomUrl: report.channel.customUrl,
    analyzedAt: new Date().toISOString(),
    subscriberCount: report.channel.subscriberCount,
    totalViewCount: report.channel.totalViewCount,
    averageViews: report.metrics.averageViews,
    channelHealthScore: report.channelHealth.score,
    channelHealthLabel: report.channelHealth.label,
    growthDiagnosisStatus: report.growthDiagnosis.status,
    uploadsPerWeek: report.uploadFrequency.perWeek,
    totalVideosAnalyzed: report.metrics.totalVideosAnalyzed,
    reportFile,
  };

  queueWrite(() => {
    const store = readStore();
    store.entries.unshift(entry);
    if (store.entries.length > MAX_ENTRIES) {
      const removed = store.entries.splice(MAX_ENTRIES);
      for (const old of removed) {
        try { if (fs.existsSync(old.reportFile)) fs.unlinkSync(old.reportFile); } catch { /* ignore */ }
      }
    }
    writeStore(store);
  });

  return entry;
}

export function getAllEntries(): AnalysisHistoryEntry[] {
  return readStore().entries;
}

export function getEntriesByChannelId(channelId: string): AnalysisHistoryEntry[] {
  return readStore().entries.filter((e) => e.channelId === channelId);
}

export function loadFullReport(reportFile: string): GrowthAnalysisReport | null {
  try {
    if (!fs.existsSync(reportFile)) return null;
    const raw = fs.readFileSync(reportFile, "utf-8");
    return JSON.parse(raw) as GrowthAnalysisReport;
  } catch {
    return null;
  }
}
