import type {
  ChannelInfo,
  VideoData,
  ChannelMetrics,
  TitlePatternStat,
} from "@/features/competitor-analysis/types";

export type { ChannelInfo, VideoData, ChannelMetrics, TitlePatternStat };

export type OutlierLevel =
  | "Normal"
  | "AboveAverage"
  | "Outlier"
  | "StrongOutlier"
  | "ViralOutlier";

export type OutlierVideo = {
  video: VideoData;
  performanceScore: number;
  outlierScore: number;
  outlierLevel: OutlierLevel;
  viewsPerDay: number;
  engagementRate: number;
};

export type UploadFrequencyInsight = {
  last30Days: number;
  last60Days: number;
  last90Days: number;
  perWeek: number;
  perMonth: number;
  mostActiveDay: string;
  consistencyScore: number;
  trend: "increasing" | "stable" | "decreasing";
};

export type ChannelHealthData = {
  score: number;
  label: "Kritik" | "Düşük" | "Orta" | "İyi" | "Mükemmel";
  factors: {
    uploadConsistency: number;
    outlierRate: number;
    engagementHealth: number;
    contentDiversity: number;
    shortsBalance: number;
  };
};

export type GrowthDiagnosis = {
  status: "growing" | "stable" | "declining";
  summary: string;
  reasons: string[];
  urgency: "low" | "medium" | "high";
};

export type GrowthOpportunity = {
  id: string;
  type: "format" | "title" | "upload" | "outlier" | "shorts";
  title: string;
  reason: string;
  confidence: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  suggestedTitles: string[];
};

export type GrowthAnalysisReport = {
  channel: ChannelInfo;
  videos: VideoData[];
  metrics: ChannelMetrics;
  topOutliers: OutlierVideo[];
  allOutliers: OutlierVideo[];
  titlePatterns: TitlePatternStat[];
  uploadFrequency: UploadFrequencyInsight;
  channelHealth: ChannelHealthData;
  growthDiagnosis: GrowthDiagnosis;
  opportunities: GrowthOpportunity[];
  cachedAt: string;
};

export type GrowthAnalyzeRequest = {
  channelUrl: string;
  maxVideos?: number;
};

export type GrowthAnalyzeResponse = {
  success: true;
  report: GrowthAnalysisReport;
  cached: boolean;
};

export type GrowthAnalyzeError = {
  success: false;
  error: string;
  code: string;
};

export type AskStrategistRequest = {
  question: string;
  report: GrowthAnalysisReport;
};

export type AskStrategistResponse = {
  answer: string;
};
