import { Lightbulb, TrendingUp, AlertCircle } from "lucide-react";
import type { ContentOpportunity } from "../types";

const TYPE_CONFIG = {
  winning_pattern: {
    icon: <TrendingUp className="w-4 h-4" />,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
    badge: "Kazanan Pattern",
    badgeColor: "bg-green-100 text-green-700",
  },
  content_gap: {
    icon: <AlertCircle className="w-4 h-4" />,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    badge: "İçerik Boşluğu",
    badgeColor: "bg-amber-100 text-amber-700",
  },
  content_idea: {
    icon: <Lightbulb className="w-4 h-4" />,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    badge: "İçerik Fikri",
    badgeColor: "bg-blue-100 text-blue-700",
  },
};

interface Props {
  opportunities: ContentOpportunity[];
}

export function OpportunityReport({ opportunities }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Fırsatlar & Stratejik Notlar</h3>
      {opportunities.length === 0 && (
        <p className="text-sm text-gray-400">Yeterli veri bulunamadı.</p>
      )}
      <div className="space-y-3">
        {opportunities.map((opp, i) => {
          const cfg = TYPE_CONFIG[opp.type];
          return (
            <div key={i} className={`flex gap-4 p-4 rounded-xl border ${cfg.border} ${cfg.bg}`}>
              <div className={`flex-shrink-0 mt-0.5 ${cfg.color}`}>{cfg.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badgeColor}`}>
                    {cfg.badge}
                  </span>
                  <h4 className="text-sm font-semibold text-gray-900">{opp.title}</h4>
                </div>
                <p className="text-sm text-gray-600">{opp.description}</p>
                {opp.supportingData && (
                  <p className="text-xs text-gray-400 mt-1.5 font-mono">{opp.supportingData}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
