"use client";

import Image from "next/image";
import type { OutlierVideo } from "../types";

const LEVEL_CONFIG: Record<string, { badge: string; bar: string; glow: string; label: string }> = {
  ViralOutlier:  { badge: "bg-red-500 text-white",    bar: "#ef4444", glow: "shadow-red-200",    label: "Viral" },
  StrongOutlier: { badge: "bg-orange-500 text-white",  bar: "#f97316", glow: "shadow-orange-200", label: "Güçlü Outlier" },
  Outlier:       { badge: "bg-amber-400 text-black",   bar: "#f59e0b", glow: "shadow-amber-100",  label: "Outlier" },
  AboveAverage:  { badge: "bg-blue-500 text-white",    bar: "#3b82f6", glow: "shadow-blue-100",   label: "Ortalamanın Üstü" },
};

function OutlierBar({ score }: { score: number }) {
  const clamped = Math.min(score, 10);
  const pct = (clamped / 10) * 100;
  const color = score >= 5 ? "#ef4444" : score >= 3 ? "#f97316" : score >= 1.5 ? "#f59e0b" : "#3b82f6";

  return (
    <div className="px-3 pb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">Outlier skoru</span>
        <span className="font-bold" style={{ color }}>{score.toFixed(1)}x medyan</span>
      </div>
      <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
}

interface Props {
  outliers: OutlierVideo[];
}

export function OutlierVideosGrid({ outliers }: Props) {
  const notable = outliers.filter((o) => o.outlierLevel !== "Normal").slice(0, 6);
  if (notable.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-900">Outlier Videolar</h3>
          <p className="text-xs text-gray-400 mt-0.5">Medyanı en çok aşan {notable.length} video</p>
        </div>
        <div className="flex gap-1.5">
          {["Viral", "Güçlü Outlier", "Outlier"].map((l) => {
            const cfg = Object.values(LEVEL_CONFIG).find((c) => c.label === l);
            return cfg ? (
              <span key={l} className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>{l}</span>
            ) : null;
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notable.map((o) => {
          const cfg = LEVEL_CONFIG[o.outlierLevel] ?? LEVEL_CONFIG.AboveAverage;
          return (
            <a
              key={o.video.id}
              href={`https://www.youtube.com/watch?v=${o.video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`block rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg ${cfg.glow} transition-all duration-200 bg-white group`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-100">
                {o.video.thumbnailUrl && (
                  <Image
                    src={o.video.thumbnailUrl}
                    alt={o.video.title}
                    fill
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                )}
                {/* Level badge */}
                <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm ${cfg.badge}`}>
                  {cfg.label}
                </span>
                {/* Views overlay */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                  <span className="text-white text-xs font-semibold">
                    {o.video.viewCount.toLocaleString("tr-TR")} izlenme
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="px-3 pt-3 pb-2">
                <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-1 leading-snug">
                  {o.video.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{o.video.format}</span>
                  {o.video.isShort && (
                    <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-500 font-medium">Short</span>
                  )}
                </div>
              </div>

              <OutlierBar score={o.outlierScore} />
            </a>
          );
        })}
      </div>
    </div>
  );
}
