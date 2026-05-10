"use client";

import type { GrowthOpportunity } from "../types";
import { Lightbulb, ArrowRight } from "lucide-react";

const CONFIDENCE_STYLES = {
  high:   "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  low:    "bg-gray-100 text-gray-600",
};
const CONFIDENCE_LABELS = { high: "Yüksek güven", medium: "Orta güven", low: "Düşük güven" };

const IMPACT_STYLES = {
  high:   "bg-red-100 text-red-700",
  medium: "bg-orange-100 text-orange-700",
  low:    "bg-blue-100 text-blue-700",
};
const IMPACT_LABELS = { high: "Yüksek etki", medium: "Orta etki", low: "Düşük etki" };

interface Props {
  opportunities: GrowthOpportunity[];
}

export function GrowthOpportunityPanel({ opportunities }: Props) {
  if (opportunities.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="font-semibold text-gray-900">Büyüme Fırsatları</h3>
      </div>

      <div className="space-y-4">
        {opportunities.map((opp) => (
          <div key={opp.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
            <div className="flex items-start gap-2 mb-2 flex-wrap">
              <h4 className="text-sm font-semibold text-gray-800 flex-1">{opp.title}</h4>
              <div className="flex gap-1.5 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CONFIDENCE_STYLES[opp.confidence]}`}>
                  {CONFIDENCE_LABELS[opp.confidence]}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${IMPACT_STYLES[opp.impact]}`}>
                  {IMPACT_LABELS[opp.impact]}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-3">{opp.reason}</p>
            {opp.suggestedTitles.length > 0 && (
              <div className="space-y-1">
                {opp.suggestedTitles.map((title, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <ArrowRight className="w-3 h-3 text-red-400" />
                    <span>{title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
