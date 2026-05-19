import { TrendingUp, Clock, Zap, BarChart2, Film, Star } from "lucide-react";
import type { ChannelMetrics } from "../types";
import { formatNumber, formatDuration } from "../utils/formatters";

interface Props {
  metrics: ChannelMetrics;
}

function MiniCompareBar({ a, b, colorA, colorB }: { a: number; b: number; colorA: string; colorB: string }) {
  const max = Math.max(a, b, 1);
  return (
    <div className="mt-3 space-y-1">
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colorA }} />
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(a / max) * 100}%`, backgroundColor: colorA }} />
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colorB }} />
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(b / max) * 100}%`, backgroundColor: colorB }} />
        </div>
      </div>
    </div>
  );
}

function ShortsRingMini({ ratio }: { ratio: number }) {
  const pct = Math.round(ratio * 100);
  const r = 14, circ = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-2 mt-2">
      <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90 shrink-0">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#fee2e2" strokeWidth="4" />
        <circle cx="18" cy="18" r={r} fill="none" stroke="#ef4444" strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.7s ease" }} />
      </svg>
      <div>
        <p className="text-xs text-gray-400 leading-none">Long-form</p>
        <p className="text-xs font-semibold text-gray-600 leading-none mt-0.5">%{100 - pct}</p>
      </div>
    </div>
  );
}

export function MetricsCards({ metrics }: Props) {
  const skewRatio = metrics.medianViews > 0 ? metrics.averageViews / metrics.medianViews : 1;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

      {/* Ortalama + Medyan karşılaştırmalı (2 kart birleşik geniş) */}
      <div className="col-span-2 bg-white rounded-2xl border border-stone-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Görüntüleme Dağılımı</span>
          {skewRatio > 2 && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              Skewed ↑ {skewRatio.toFixed(1)}x
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-400">Ortalama</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatNumber(metrics.averageViews)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <span className="text-xs text-gray-400">Medyan</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatNumber(metrics.medianViews)}</p>
          </div>
        </div>
        <MiniCompareBar a={metrics.averageViews} b={metrics.medianViews} colorA="#3b82f6" colorB="#8b5cf6" />
      </div>

      {/* Ortalama Süre */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4">
        <div className={`inline-flex p-2 rounded-lg bg-green-50 text-green-600 mb-2`}>
          <Clock className="w-4 h-4" />
        </div>
        <p className="text-xl font-bold text-gray-900">{formatDuration(metrics.averageDuration)}</p>
        <p className="text-xs text-gray-500 mt-0.5">Ortalama Süre</p>
        <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-400 rounded-full" style={{ width: `${Math.min(100, (metrics.averageDuration / 1200) * 100)}%` }} />
        </div>
        <p className="text-[10px] text-gray-400 mt-1">20 dak. maks.</p>
      </div>

      {/* Upload / hafta */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4">
        <div className="inline-flex p-2 rounded-lg bg-amber-50 text-amber-600 mb-2">
          <Zap className="w-4 h-4" />
        </div>
        <p className="text-xl font-bold text-gray-900">{metrics.uploadsPerWeek}x</p>
        <p className="text-xs text-gray-500 mt-0.5">Upload / Hafta</p>
        <div className="flex gap-0.5 mt-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-5 rounded-sm transition-all"
              style={{ backgroundColor: i < metrics.uploadsPerWeek ? "#f59e0b" : "#f3f4f6" }}
            />
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-1">7 gün hedef</p>
      </div>

      {/* Shorts oranı */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4">
        <div className="inline-flex p-2 rounded-lg bg-red-50 text-red-600 mb-2">
          <Film className="w-4 h-4" />
        </div>
        <p className="text-xl font-bold text-gray-900">%{Math.round(metrics.shortsRatio * 100)}</p>
        <p className="text-xs text-gray-500 mt-0.5">Shorts Oranı</p>
        <ShortsRingMini ratio={metrics.shortsRatio} />
      </div>

      {/* Analiz edilen */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4">
        <div className="inline-flex p-2 rounded-lg bg-gray-100 text-gray-600 mb-2">
          <Star className="w-4 h-4" />
        </div>
        <p className="text-xl font-bold text-gray-900">{metrics.totalVideosAnalyzed}</p>
        <p className="text-xs text-gray-500 mt-0.5">Analiz Edilen Video</p>
        <div className="mt-2 flex items-end gap-0.5 h-6">
          {[0.3,0.5,0.7,0.6,0.9,0.8,1].map((h, i) => (
            <div key={i} className="flex-1 bg-gray-200 rounded-sm" style={{ height: `${h * 100}%` }} />
          ))}
        </div>
      </div>

    </div>
  );
}
