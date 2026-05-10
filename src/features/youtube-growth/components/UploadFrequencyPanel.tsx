"use client";

import type { UploadFrequencyInsight } from "../types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const TREND_CONFIG = {
  increasing: { label: "Artıyor",  Icon: TrendingUp,   color: "text-green-600",  bg: "bg-green-50" },
  stable:     { label: "Stabil",   Icon: Minus,         color: "text-blue-600",   bg: "bg-blue-50" },
  decreasing: { label: "Düşüyor",  Icon: TrendingDown,  color: "text-red-600",    bg: "bg-red-50" },
};

interface Props {
  freq: UploadFrequencyInsight;
}

export function UploadFrequencyPanel({ freq }: Props) {
  const trend = TREND_CONFIG[freq.trend];
  const TrendIcon = trend.Icon;
  const maxVal = Math.max(freq.last90Days, 1);

  const bars = [
    { label: "Son 30 gün", value: freq.last30Days },
    { label: "Son 60 gün", value: freq.last60Days },
    { label: "Son 90 gün", value: freq.last90Days },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-gray-900">Upload Sıklığı</h3>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${trend.bg}`}>
          <TrendIcon className={`w-4 h-4 ${trend.color}`} />
          <span className={`text-xs font-semibold ${trend.color}`}>{trend.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <p className="text-2xl font-bold text-gray-900">{freq.perWeek}</p>
          <p className="text-xs text-gray-500 mt-0.5">video / hafta</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <p className="text-2xl font-bold text-gray-900">{freq.perMonth}</p>
          <p className="text-xs text-gray-500 mt-0.5">video / ay</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-xl">
          <p className="text-lg font-bold text-gray-900">{freq.mostActiveDay}</p>
          <p className="text-xs text-gray-500 mt-0.5">aktif gün</p>
        </div>
      </div>

      <div className="space-y-3">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">{b.label}</span>
              <span className="font-semibold text-gray-800">{b.value} video</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-red-500 transition-all"
                style={{ width: `${Math.min(100, (b.value / maxVal) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
