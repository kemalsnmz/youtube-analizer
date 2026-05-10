"use client";

import { SearchForm } from "@/features/competitor-analysis/components/SearchForm";
import { ChannelOverview } from "@/features/competitor-analysis/components/ChannelOverview";
import { MetricsCards } from "@/features/competitor-analysis/components/MetricsCards";
import { TitleInsights } from "@/features/competitor-analysis/components/TitleInsights";
import { ChannelHealthCard } from "../components/ChannelHealthCard";
import { OutlierVideosGrid } from "../components/OutlierVideosGrid";
import { UploadFrequencyPanel } from "../components/UploadFrequencyPanel";
import { GrowthDiagnosisCard } from "../components/GrowthDiagnosisCard";
import { GrowthOpportunityPanel } from "../components/GrowthOpportunityPanel";
import { AIStrategistChat } from "../components/AIStrategistChat";
import { useGrowthAnalysis } from "../hooks/useGrowthAnalysis";
import { Loader2 } from "lucide-react";

export function YouTubeGrowthPage() {
  const { status, report, error, cached, analyze } = useGrowthAnalysis();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">YouTube Growth Intelligence</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Kanalını analiz et, outlier videolarını bul ve büyüme stratejini oluştur.
        </p>
      </div>

      <div className="mb-8">
        <SearchForm
          onAnalyze={(input, maxVideos) => analyze({ channelUrl: input, maxVideos })}
          loading={status === "loading"}
        />
      </div>

      {status === "loading" && (
        <div className="flex flex-col items-center gap-4 py-24">
          <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
          <p className="text-gray-500">Kanal analiz ediliyor, lütfen bekleyin...</p>
        </div>
      )}

      {status === "error" && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {status === "success" && report && (
        <div className="space-y-6">
          <ChannelOverview channel={report.channel} cached={cached} />

          <MetricsCards metrics={report.metrics} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

          <AIStrategistChat report={report} />
        </div>
      )}
    </div>
  );
}
