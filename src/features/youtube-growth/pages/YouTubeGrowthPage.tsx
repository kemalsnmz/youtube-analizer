"use client";

import { ChannelOverview } from "@/features/competitor-analysis/components/ChannelOverview";
import { MetricsCards } from "@/features/competitor-analysis/components/MetricsCards";
import { TitleInsights } from "@/features/competitor-analysis/components/TitleInsights";
import { ChannelHealthCard } from "../components/ChannelHealthCard";
import { OutlierVideosGrid } from "../components/OutlierVideosGrid";
import { UploadFrequencyPanel } from "../components/UploadFrequencyPanel";
import { GrowthDiagnosisCard } from "../components/GrowthDiagnosisCard";
import { GrowthOpportunityPanel } from "../components/GrowthOpportunityPanel";
import { AIStrategistChat } from "../components/AIStrategistChat";
import { GrowthPlanPanel } from "../components/GrowthPlanPanel";
import { VideoIdeaPanel } from "../components/VideoIdeaPanel";
import { AnalysisHistoryPanel } from "../components/AnalysisHistoryPanel";
import type { GrowthAnalysisReport } from "../types";
import { Loader2 } from "lucide-react";

interface Props {
  status: "idle" | "loading" | "success" | "error";
  report: GrowthAnalysisReport | null;
  error: string | null;
  cached: boolean;
  loadReport: (r: GrowthAnalysisReport) => void;
}

export function YouTubeGrowthPage({ status, report, error, cached, loadReport }: Props) {
  return (
    <div>
      <AnalysisHistoryPanel onLoadReport={loadReport} />

      {/* Loading */}
      {status === "loading" && (
        <div className="flex flex-col items-center gap-5 py-28">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-orange-400 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Loader2 className="w-7 h-7 text-white animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-orange-400 blur-xl opacity-30 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-gray-900 font-semibold mb-1">Kanal analiz ediliyor</p>
            <p className="text-gray-500 text-sm">Videolar taranıyor, outlier&apos;lar hesaplanıyor...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {status === "error" && error && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-red-400 text-sm mt-1">URL&apos;yi kontrol edip tekrar dene.</p>
        </div>
      )}

      {/* Idle hint */}
      {status === "idle" && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">Kanal URL&apos;ini girerek analizi başlat.</p>
        </div>
      )}

      {/* Results */}
      {status === "success" && report && (
        <div
          className="rounded-3xl p-6 space-y-5"
          style={{ background: "#ece9e4" }}
        >
          <ChannelOverview channel={report.channel} cached={cached} />
          <MetricsCards metrics={report.metrics} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ChannelHealthCard health={report.channelHealth} />
            <GrowthDiagnosisCard diagnosis={report.growthDiagnosis} />
          </div>

          <UploadFrequencyPanel freq={report.uploadFrequency} />
          <OutlierVideosGrid outliers={report.allOutliers} />

          <TitleInsights
            patterns={report.titlePatterns}
            channelAvgViews={report.metrics.averageViews}
          />

          <GrowthOpportunityPanel opportunities={report.opportunities} />
          <VideoIdeaPanel report={report} />
          <GrowthPlanPanel report={report} />
          <AIStrategistChat report={report} />
        </div>
      )}
    </div>
  );
}
