"use client";

import type { UploadFrequencyInsight } from "../types";
import { TrendingUp, TrendingDown, Minus, Calendar, Clock } from "lucide-react";

const TREND_CONFIG = {
  increasing: { label: "Artıyor",  Icon: TrendingUp,  color: "text-emerald-600", bg: "bg-emerald-50", bar: "#10b981" },
  stable:     { label: "Stabil",   Icon: Minus,        color: "text-blue-600",    bg: "bg-blue-50",    bar: "#3b82f6" },
  decreasing: { label: "Düşüyor",  Icon: TrendingDown, color: "text-red-600",     bg: "bg-red-50",     bar: "#ef4444" },
};

function ConsistencyRing({ score }: { score: number }) {
  const r = 22, circ = 2 * Math.PI * r;
  const color = score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative w-14 h-14">
      <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#f3f4f6" strokeWidth="5" />
        <circle
          cx="28" cy="28" r={r}
          fill="none" stroke={color} strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={circ - (score / 100) * circ}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-gray-800">{score}</span>
      </div>
    </div>
  );
}

function BarChart({ bars, color }: { bars: { label: string; value: number; sublabel: string }[]; color: string }) {
  const maxVal = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="space-y-3">
      {bars.map((b) => (
        <div key={b.label}>
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-xs text-gray-500">{b.label}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-gray-900">{b.value}</span>
              <span className="text-xs text-gray-400">{b.sublabel}</span>
            </div>
          </div>
          <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, (b.value / maxVal) * 100)}%`,
                background: `linear-gradient(90deg, ${color}cc, ${color})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface Props {
  freq: UploadFrequencyInsight;
}

export function UploadFrequencyPanel({ freq }: Props) {
  const trend = TREND_CONFIG[freq.trend];
  const TrendIcon = trend.Icon;

  const bars = [
    { label: "Son 30 gün", value: freq.last30Days, sublabel: "video" },
    { label: "Son 60 gün", value: freq.last60Days, sublabel: "video" },
    { label: "Son 90 gün", value: freq.last90Days, sublabel: "video" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Upload Sıklığı</h3>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${trend.bg}`}>
          <TrendIcon className={`w-3.5 h-3.5 ${trend.color}`} />
          <span className={`text-xs font-semibold ${trend.color}`}>{trend.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Per week */}
        <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 border border-gray-100">
          <Clock className="w-4 h-4 text-gray-400 mb-1.5" />
          <span className="text-2xl font-bold text-gray-900">{freq.perWeek}</span>
          <span className="text-xs text-gray-500 mt-0.5">video / hafta</span>
        </div>

        {/* Per month */}
        <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 border border-gray-100">
          <Calendar className="w-4 h-4 text-gray-400 mb-1.5" />
          <span className="text-2xl font-bold text-gray-900">{freq.perMonth}</span>
          <span className="text-xs text-gray-500 mt-0.5">video / ay</span>
        </div>

        {/* Consistency ring */}
        <div className="flex flex-col items-center p-4 rounded-xl bg-gray-50 border border-gray-100">
          <ConsistencyRing score={freq.consistencyScore} />
          <span className="text-xs text-gray-500 mt-1.5">tutarlılık</span>
        </div>
      </div>

      <BarChart bars={bars} color={trend.bar} />

      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
        <span>En aktif gün</span>
        <span className="font-semibold text-gray-700">{freq.mostActiveDay}</span>
      </div>
    </div>
  );
}
