import type { ContentFormat } from "../types";

const FORMAT_LABELS: Record<ContentFormat, string> = {
  Comparison: "Karşılaştırma",
  Ranking: "Sıralama",
  Timeline: "Tarihsel",
  Tutorial: "Tutorial",
  Documentary: "Belgesel",
  DataVisualization: "Veri Görselleştirme",
  TopList: "Top Liste",
  ShortsClip: "Shorts",
  Unknown: "Diğer",
};

const COLORS: Record<ContentFormat, string> = {
  Comparison: "bg-blue-500",
  Ranking: "bg-purple-500",
  Timeline: "bg-teal-500",
  Tutorial: "bg-green-500",
  Documentary: "bg-amber-500",
  DataVisualization: "bg-indigo-500",
  TopList: "bg-pink-500",
  ShortsClip: "bg-red-500",
  Unknown: "bg-gray-300",
};

interface Props {
  formats: Record<ContentFormat, number>;
}

export function ContentFormatChart({ formats }: Props) {
  const total = Object.values(formats).reduce((s, n) => s + n, 0);
  const sorted = (Object.entries(formats) as [ContentFormat, number][])
    .filter(([, n]) => n > 0)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4">İçerik Format Dağılımı</h3>
      <div className="space-y-3">
        {sorted.map(([format, count]) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={format} className="flex items-center gap-3">
              <div className="w-32 text-sm text-gray-600 truncate">{FORMAT_LABELS[format]}</div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${COLORS[format]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="w-16 text-right text-xs text-gray-500">
                {count} · %{pct}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
