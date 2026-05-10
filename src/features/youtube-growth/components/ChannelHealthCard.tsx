"use client";

import type { ChannelHealthData } from "../types";

const LABEL_COLORS: Record<ChannelHealthData["label"], string> = {
  Mükemmel: "text-green-600",
  İyi: "text-emerald-600",
  Orta: "text-yellow-600",
  Düşük: "text-orange-600",
  Kritik: "text-red-600",
};

function scoreColor(score: number): string {
  if (score >= 80) return "#16a34a";
  if (score >= 60) return "#059669";
  if (score >= 40) return "#ca8a04";
  if (score >= 20) return "#ea580c";
  return "#dc2626";
}

interface Props {
  health: ChannelHealthData;
}

export function ChannelHealthCard({ health }: Props) {
  const color = scoreColor(health.score);
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference - (health.score / 100) * circumference;

  const factors = [
    { label: "Upload Tutarlılığı", value: health.factors.uploadConsistency },
    { label: "Outlier Oranı", value: health.factors.outlierRate },
    { label: "Etkileşim Sağlığı", value: health.factors.engagementHealth },
    { label: "İçerik Çeşitliliği", value: health.factors.contentDiversity },
    { label: "Shorts Dengesi", value: health.factors.shortsBalance },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-6">Kanal Sağlık Skoru</h3>
      <div className="flex items-center gap-6">
        <div className="relative flex-shrink-0">
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="45" fill="none" stroke="#f3f4f6" strokeWidth="10" />
            <circle
              cx="55" cy="55" r="45" fill="none"
              stroke={color} strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 55 55)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">{health.score}</span>
            <span className="text-xs text-gray-400">/ 100</span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          {factors.map((f) => (
            <div key={f.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">{f.label}</span>
                <span className="text-gray-700 font-medium">{f.value}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${Math.min(100, f.value)}%`, backgroundColor: color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center">
        <span className={`text-sm font-semibold ${LABEL_COLORS[health.label]}`}>
          {health.label}
        </span>
      </div>
    </div>
  );
}
