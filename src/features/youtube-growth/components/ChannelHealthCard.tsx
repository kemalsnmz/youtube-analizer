"use client";

import type { ChannelHealthData } from "../types";

const LABEL_CONFIG: Record<ChannelHealthData["label"], { color: string; ring: string; bg: string }> = {
  Mükemmel: { color: "text-emerald-600", ring: "#10b981", bg: "bg-emerald-50" },
  İyi:       { color: "text-green-600",   ring: "#16a34a", bg: "bg-green-50" },
  Orta:      { color: "text-yellow-600",  ring: "#ca8a04", bg: "bg-yellow-50" },
  Düşük:     { color: "text-orange-600",  ring: "#ea580c", bg: "bg-orange-50" },
  Kritik:    { color: "text-red-600",     ring: "#dc2626", bg: "bg-red-50" },
};

const FACTORS = [
  { key: "uploadConsistency", label: "Upload\nTutarlılığı" },
  { key: "outlierRate",       label: "Outlier\nOranı" },
  { key: "engagementHealth",  label: "Engagement\nSağlığı" },
  { key: "contentDiversity",  label: "İçerik\nÇeşitliliği" },
  { key: "shortsBalance",     label: "Shorts\nDengesi" },
] as const;

function RadarChart({ factors, color }: { factors: ChannelHealthData["factors"]; color: string }) {
  const cx = 100, cy = 100, maxR = 72;
  const n = FACTORS.length;

  const angleFor = (i: number) => (i * 2 * Math.PI) / n - Math.PI / 2;

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const gridPolygon = (level: number) =>
    FACTORS.map((_, i) => {
      const a = angleFor(i);
      return `${cx + maxR * level * Math.cos(a)},${cy + maxR * level * Math.sin(a)}`;
    }).join(" ");

  const dataPolygon = FACTORS.map(({ key }, i) => {
    const val = Math.min(100, factors[key]) / 100;
    const a = angleFor(i);
    return `${cx + maxR * val * Math.cos(a)},${cy + maxR * val * Math.sin(a)}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 200 200" className="w-full max-w-[200px]">
      {/* Grid rings */}
      {gridLevels.map((lvl) => (
        <polygon
          key={lvl}
          points={gridPolygon(lvl)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {FACTORS.map((_, i) => {
        const a = angleFor(i);
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={cx + maxR * Math.cos(a)}
            y2={cy + maxR * Math.sin(a)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={dataPolygon}
        fill={color}
        fillOpacity="0.15"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Data dots */}
      {FACTORS.map(({ key }, i) => {
        const val = Math.min(100, factors[key]) / 100;
        const a = angleFor(i);
        return (
          <circle
            key={i}
            cx={cx + maxR * val * Math.cos(a)}
            cy={cy + maxR * val * Math.sin(a)}
            r="3.5"
            fill={color}
            stroke="white"
            strokeWidth="1.5"
          />
        );
      })}

      {/* Labels */}
      {FACTORS.map(({ label }, i) => {
        const a = angleFor(i);
        const lx = cx + (maxR + 18) * Math.cos(a);
        const ly = cy + (maxR + 18) * Math.sin(a);
        const lines = label.split("\n");
        return (
          <text
            key={i}
            x={lx} y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="7.5"
            fill="#6b7280"
            fontFamily="inherit"
          >
            {lines.map((l, li) => (
              <tspan key={li} x={lx} dy={li === 0 ? (lines.length > 1 ? "-5" : "0") : "10"}>
                {l}
              </tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}

interface Props {
  health: ChannelHealthData;
}

export function ChannelHealthCard({ health }: Props) {
  const cfg = LABEL_CONFIG[health.label];
  const circumference = 2 * Math.PI * 38;
  const dashOffset = circumference - (health.score / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-5">Kanal Sağlık Skoru</h3>

      <div className="flex items-center gap-6">
        {/* Donut score */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative">
            <svg width="92" height="92" viewBox="0 0 92 92">
              <circle cx="46" cy="46" r="38" fill="none" stroke="#f3f4f6" strokeWidth="9" />
              <circle
                cx="46" cy="46" r="38"
                fill="none"
                stroke={cfg.ring}
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                transform="rotate(-90 46 46)"
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{health.score}</span>
              <span className="text-[10px] text-gray-400">/ 100</span>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
            {health.label}
          </span>
        </div>

        {/* Radar chart */}
        <div className="flex-1 flex justify-center">
          <RadarChart factors={health.factors} color={cfg.ring} />
        </div>
      </div>

      {/* Factor legend */}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-gray-50 pt-4">
        {FACTORS.map(({ key, label }) => {
          const val = health.factors[key];
          return (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="text-gray-500 truncate">{label.replace("\n", " ")}</span>
              <div className="flex items-center gap-1.5 ml-2">
                <div className="w-14 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${val}%`, backgroundColor: cfg.ring, transition: "width 0.6s ease" }}
                  />
                </div>
                <span className="text-gray-700 font-medium w-5 text-right">{val}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
