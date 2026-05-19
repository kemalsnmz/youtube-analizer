import type { TitlePatternStat } from "../types";
import { formatNumber } from "../utils/formatters";

const PATTERN_LABELS: Record<string, string> = {
  number:      "Sayı İçeren",
  vs:          "VS / Karşılaştırma",
  question:    "Soru Başlığı",
  topBestWorst:"Top / En İyi / En Kötü",
  year:        "Yıl İçeren",
  clickbait:   "Clickbait",
  none:        "Nötr",
};

function ratioColor(ratio: number): { bar: string; badge: string; text: string } {
  if (ratio >= 2)   return { bar: "from-emerald-400 to-emerald-500", badge: "bg-emerald-100 text-emerald-700", text: "text-emerald-700" };
  if (ratio >= 1.3) return { bar: "from-green-400 to-green-500",     badge: "bg-green-100 text-green-700",    text: "text-green-700" };
  if (ratio >= 0.8) return { bar: "from-blue-300 to-blue-400",       badge: "bg-blue-100 text-blue-600",      text: "text-blue-600" };
  return               { bar: "from-gray-300 to-gray-400",           badge: "bg-gray-100 text-gray-500",      text: "text-gray-500" };
}

interface Props {
  patterns: TitlePatternStat[];
  channelAvgViews: number;
}

export function TitleInsights({ patterns, channelAvgViews }: Props) {
  const filtered = patterns
    .filter((p) => p.pattern !== "none" && p.count > 0)
    .sort((a, b) => b.averageViews - a.averageViews);

  const maxViews = Math.max(...filtered.map((p) => p.averageViews), 1);

  if (filtered.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-900">Başlık Pattern Analizi</h3>
          <p className="text-xs text-gray-400 mt-0.5">Kanal ortalamasına göre performans</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Kanal ort.</p>
          <p className="text-sm font-bold text-gray-700">{formatNumber(channelAvgViews)}</p>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((p) => {
          const ratio = channelAvgViews > 0 ? p.averageViews / channelAvgViews : 1;
          const widthPct = Math.min(100, (p.averageViews / maxViews) * 100);
          const c = ratioColor(ratio);

          return (
            <div key={p.pattern}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {PATTERN_LABELS[p.pattern] ?? p.pattern}
                  </span>
                  <span className="text-xs text-gray-400">{p.count} video</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">{formatNumber(p.averageViews)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${c.badge}`}>
                    {ratio >= 1 ? "+" : ""}{((ratio - 1) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${c.bar} transition-all duration-700`}
                  style={{ width: `${widthPct}%` }}
                />
                {/* Channel average marker */}
                <div
                  className="absolute inset-y-0 w-0.5 bg-gray-400/40"
                  style={{ left: `${Math.min(100, (channelAvgViews / maxViews) * 100)}%` }}
                />
              </div>

              {/* Top video */}
              {p.topVideos[0] && (
                <p className="text-xs text-gray-400 mt-1 truncate">
                  En iyi: "{p.topVideos[0].title}" ({formatNumber(p.topVideos[0].viewCount)})
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-400">
        <div className="w-0.5 h-3 bg-gray-400/40 rounded" />
        <span>Dikey çizgi = kanal ortalaması</span>
      </div>
    </div>
  );
}
