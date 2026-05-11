"use client";

import { useState } from "react";
import { YouTubeGrowthPage } from "@/features/youtube-growth/pages/YouTubeGrowthPage";
import { CompetitorAnalysisPage } from "@/features/competitor-analysis/pages/CompetitorAnalysisPage";
import { KnowledgeAgentPage } from "@/features/knowledge-agent/pages/KnowledgeAgentPage";
import { TrendingUp, Users, BookOpen } from "lucide-react";

type Tab = "growth" | "competitor" | "knowledge";

const TABS: { id: Tab; label: string; Icon: typeof TrendingUp; description: string }[] = [
  {
    id: "growth",
    label: "Kanal Büyütme",
    Icon: TrendingUp,
    description: "Outlier tespiti, büyüme tanısı, AI stratejist",
  },
  {
    id: "competitor",
    label: "Rakip Analizi",
    Icon: Users,
    description: "Rakip kanalı analiz et, fırsatları keşfet",
  },
  {
    id: "knowledge",
    label: "Bilgi Kütüphanesi",
    Icon: BookOpen,
    description: "Kaynak ekle, AI stratejisti besle",
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("growth");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab bar */}
        <div className="flex gap-2 mb-8 bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm w-fit">
          {TABS.map(({ id, label, Icon, description }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all text-left ${
                  isActive
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold leading-tight">{label}</div>
                  <div className={`text-xs leading-tight mt-0.5 ${isActive ? "text-red-100" : "text-gray-400"}`}>
                    {description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className={activeTab === "growth" ? "block" : "hidden"}>
          <YouTubeGrowthPage />
        </div>
        <div className={activeTab === "competitor" ? "block" : "hidden"}>
          <CompetitorAnalysisPage />
        </div>
        <div className={activeTab === "knowledge" ? "block" : "hidden"}>
          <KnowledgeAgentPage />
        </div>
      </div>
    </div>
  );
}
