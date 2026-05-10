import { TrendingUp, Clock, Zap, BarChart2, Film, Star } from "lucide-react";
import type { ChannelMetrics } from "../types";
import { formatNumber, formatDuration } from "../utils/formatters";

interface Props {
  metrics: ChannelMetrics;
}

export function MetricsCards({ metrics }: Props) {
  const cards = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Ortalama Görüntüleme",
      value: formatNumber(metrics.averageViews),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      label: "Medyan Görüntüleme",
      value: formatNumber(metrics.medianViews),
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: "Ortalama Süre",
      value: formatDuration(metrics.averageDuration),
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: "Upload / Hafta",
      value: `${metrics.uploadsPerWeek}x`,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: <Film className="w-5 h-5" />,
      label: "Shorts Oranı",
      value: `%${Math.round(metrics.shortsRatio * 100)}`,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: "Analiz Edilen Video",
      value: metrics.totalVideosAnalyzed.toString(),
      color: "text-gray-600",
      bg: "bg-gray-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className={`inline-flex p-2 rounded-lg ${card.bg} ${card.color} mb-3`}>
            {card.icon}
          </div>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-tight">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
