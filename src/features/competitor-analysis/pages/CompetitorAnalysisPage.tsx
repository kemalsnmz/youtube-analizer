"use client";

import { PlaySquare } from "lucide-react";
import { useAnalysis } from "../hooks/useAnalysis";
import { SearchForm } from "../components/SearchForm";
import { ChannelOverview } from "../components/ChannelOverview";
import { MetricsCards } from "../components/MetricsCards";
import { VideoTable } from "../components/VideoTable";
import { ViralVideos } from "../components/ViralVideos";
import { TitleInsights } from "../components/TitleInsights";
import { ContentFormatChart } from "../components/ContentFormatChart";
import { OpportunityReport } from "../components/OpportunityReport";
import { ExportButtons } from "../components/ExportButtons";

export function CompetitorAnalysisPage() {
  const { status, report, error, cached, analyze } = useAnalysis();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="flex items-center gap-2 text-red-600">
            <PlaySquare className="w-6 h-6" />
            <span className="font-bold text-lg text-gray-900">YT Rakip Analiz</span>
          </div>
          <span className="text-gray-300">·</span>
          <span className="text-sm text-gray-500">YouTube kanallarını analiz et, fırsatları keşfet</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <SearchForm onAnalyze={analyze} loading={status === "loading"} />
        </div>

        {/* Loading */}
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Kanal analiz ediliyor, lütfen bekleyin...</p>
            <p className="text-gray-400 text-xs">YouTube API'den veriler çekiliyor</p>
          </div>
        )}

        {/* Error */}
        {status === "error" && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-700 font-semibold mb-1">Analiz başarısız</p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Results */}
        {status === "success" && report && (
          <>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <ChannelOverview channel={report.channel} cached={cached} />
            </div>

            <MetricsCards metrics={report.metrics} />

            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-base font-semibold text-gray-700">Detaylı Analiz</h2>
              <ExportButtons report={report} />
            </div>

            <OpportunityReport opportunities={report.opportunities} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TitleInsights
                patterns={report.titlePatterns}
                channelAvgViews={report.metrics.averageViews}
              />
              <ContentFormatChart formats={report.contentFormats} />
            </div>

            <ViralVideos videos={report.viralVideos} />

            <VideoTable videos={report.videos} />
          </>
        )}

        {/* Idle */}
        {status === "idle" && (
          <div className="text-center py-24 text-gray-400">
            <PlaySquare className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            <p className="text-lg font-medium">Rakibini analiz etmeye başla</p>
            <p className="text-sm mt-1">Yukarıya bir YouTube kanal URL'si gir</p>
          </div>
        )}
      </main>
    </div>
  );
}
