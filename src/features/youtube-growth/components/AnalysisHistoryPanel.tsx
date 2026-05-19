"use client";

import { useState, useEffect } from "react";
import { History, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import type { AnalysisHistoryEntry, GrowthAnalysisReport } from "../types";

interface Props {
  onLoadReport: (report: GrowthAnalysisReport) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function DeltaBadge({ delta, label }: { delta: number; label: string }) {
  if (delta === 0) return <span className="text-xs text-gray-400">{label} —</span>;
  const positive = delta > 0;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${positive ? "text-green-600" : "text-red-500"}`}>
      {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {positive ? "+" : ""}{formatNum(delta)} {label}
    </span>
  );
}

function ComparisonView({ entries }: { entries: AnalysisHistoryEntry[] }) {
  const sorted = [...entries].sort((a, b) => new Date(a.analyzedAt).getTime() - new Date(b.analyzedAt).getTime());
  const oldest = sorted[0];
  const newest = sorted[sorted.length - 1];
  if (oldest.id === newest.id) return null;

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
      <p className="text-xs font-semibold text-gray-600 mb-2">
        Karşılaştırma: {formatDate(oldest.analyzedAt)} → {formatDate(newest.analyzedAt)}
      </p>
      <div className="flex flex-wrap gap-3">
        <DeltaBadge delta={newest.subscriberCount - oldest.subscriberCount} label="abone" />
        <DeltaBadge delta={newest.averageViews - oldest.averageViews} label="ort. izlenme" />
        <DeltaBadge delta={newest.channelHealthScore - oldest.channelHealthScore} label="sağlık puanı" />
        <DeltaBadge delta={newest.uploadsPerWeek - oldest.uploadsPerWeek} label="upload/hafta" />
      </div>
    </div>
  );
}

function EntryRow({
  entry,
  onLoad,
  loading,
}: {
  entry: AnalysisHistoryEntry;
  onLoad: () => void;
  loading: boolean;
}) {
  const statusColor = {
    growing: "bg-green-100 text-green-700",
    stable: "bg-gray-100 text-gray-600",
    declining: "bg-red-100 text-red-600",
  }[entry.growthDiagnosisStatus];

  const StatusIcon = entry.growthDiagnosisStatus === "growing"
    ? TrendingUp
    : entry.growthDiagnosisStatus === "declining"
    ? TrendingDown
    : Minus;

  return (
    <button
      onClick={onLoad}
      disabled={loading}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-left disabled:opacity-60"
    >
      {entry.channelThumbnailUrl && (
        <img src={entry.channelThumbnailUrl} alt="" className="w-9 h-9 rounded-full shrink-0 object-cover" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{entry.channelTitle}</p>
        <p className="text-xs text-gray-400">{formatDate(entry.analyzedAt)}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-gray-500">{formatNum(entry.subscriberCount)} abone</span>
        <span className={`flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full font-medium ${statusColor}`}>
          <StatusIcon className="w-3 h-3" />
        </span>
        {loading && <Loader2 className="w-3.5 h-3.5 text-gray-400 animate-spin" />}
      </div>
    </button>
  );
}

export function AnalysisHistoryPanel({ onLoadReport }: Props) {
  const [entries, setEntries] = useState<AnalysisHistoryEntry[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/youtube-growth/history")
      .then((r) => r.json())
      .then((d: { entries: AnalysisHistoryEntry[] }) => setEntries(d.entries ?? []))
      .catch(() => {});
  }, []);

  if (entries.length === 0) return null;

  // Kanal bazında grupla
  const byChannel: Record<string, AnalysisHistoryEntry[]> = {};
  for (const e of entries) {
    if (!byChannel[e.channelId]) byChannel[e.channelId] = [];
    byChannel[e.channelId].push(e);
  }

  async function handleLoad(entry: AnalysisHistoryEntry) {
    setLoadingId(entry.id);
    try {
      const res = await fetch(`/api/youtube-growth/history/${entry.id}`);
      const data = (await res.json()) as { report?: GrowthAnalysisReport };
      if (data.report) onLoadReport(data.report);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Geçmiş Analizler</span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{entries.length}</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-2 py-2 max-h-80 overflow-y-auto">
          {Object.entries(byChannel).map(([channelId, channelEntries]) => (
            <div key={channelId} className="mb-1">
              {channelEntries.map((entry) => (
                <EntryRow
                  key={entry.id}
                  entry={entry}
                  onLoad={() => handleLoad(entry)}
                  loading={loadingId === entry.id}
                />
              ))}
              {channelEntries.length > 1 && <ComparisonView entries={channelEntries} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
