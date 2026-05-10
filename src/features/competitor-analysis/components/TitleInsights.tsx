import type { TitlePatternStat } from "../types";
import { formatNumber } from "../utils/formatters";

const PATTERN_LABELS: Record<string, string> = {
  number: "Sayı İçeren",
  vs: "VS / Karşılaştırma",
  question: "Soru Başlığı",
  topBestWorst: "Top / En İyi / En Kötü",
  year: "Yıl İçeren",
  clickbait: "Clickbait",
  none: "Nötr",
};

interface Props {
  patterns: TitlePatternStat[];
  channelAvgViews: number;
}

export function TitleInsights({ patterns, channelAvgViews }: Props) {
  const filtered = patterns.filter((p) => p.pattern !== "none");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Başlık Pattern Analizi</h3>
      <div className="space-y-3">
        {filtered.map((p) => {
          const ratio = channelAvgViews > 0 ? p.averageViews / channelAvgViews : 1;
          const isWinning = ratio >= 1.3;
          return (
            <div key={p.pattern} className="flex items-center gap-4">
              <div className="w-40 flex-shrink-0">
                <span className={`text-sm font-medium ${isWinning ? "text-green-700" : "text-gray-600"}`}>
                  {PATTERN_LABELS[p.pattern] ?? p.pattern}
                </span>
              </div>
              <div className="flex-1">
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full rounded-full ${isWinning ? "bg-green-500" : "bg-gray-400"}`}
                    style={{ width: `${Math.min(100, ratio * 33)}%` }}
                  />
                </div>
              </div>
              <div className="w-28 text-right flex-shrink-0">
                <span className="text-sm font-semibold text-gray-800">{formatNumber(p.averageViews)}</span>
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded font-medium ${isWinning ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {ratio.toFixed(1)}x
                </span>
              </div>
              <div className="w-12 text-right text-xs text-gray-400">{p.count} video</div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400">Pattern verisi bulunamadı.</p>
        )}
      </div>
    </div>
  );
}
