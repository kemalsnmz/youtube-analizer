"use client";

import type { GrowthDiagnosis } from "../types";
import { TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";

const STATUS_CONFIG = {
  growing: {
    label: "Büyüyor",
    Icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  stable: {
    label: "Stabil",
    Icon: Minus,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  declining: {
    label: "Gerileme",
    Icon: TrendingDown,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
};

const URGENCY_LABELS = { low: "Düşük", medium: "Orta", high: "Yüksek" };
const URGENCY_COLORS = {
  low: "text-green-600 bg-green-50",
  medium: "text-yellow-700 bg-yellow-50",
  high: "text-red-600 bg-red-50",
};

interface Props {
  diagnosis: GrowthDiagnosis;
}

export function GrowthDiagnosisCard({ diagnosis }: Props) {
  const cfg = STATUS_CONFIG[diagnosis.status];
  const Icon = cfg.Icon;

  return (
    <div className={`bg-white rounded-2xl border ${cfg.border} shadow-sm p-6`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl ${cfg.bg}`}>
          <Icon className={`w-5 h-5 ${cfg.color}`} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Büyüme Tanısı</h3>
          <span className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</span>
        </div>
        <div className="ml-auto">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${URGENCY_COLORS[diagnosis.urgency]}`}>
            Öncelik: {URGENCY_LABELS[diagnosis.urgency]}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{diagnosis.summary}</p>

      <div className="space-y-2">
        {diagnosis.reasons.map((reason, i) => (
          <div key={i} className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">{reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
