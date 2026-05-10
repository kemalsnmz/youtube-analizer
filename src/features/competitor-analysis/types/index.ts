// ─── Raw API Types ────────────────────────────────────────────────────────────

export interface RawChannelData {
  id: string;
  snippet: {
    title: string;
    description: string;
    customUrl?: string;
    publishedAt: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
    };
    country?: string;
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
    hiddenSubscriberCount?: boolean;
  };
  contentDetails: {
    relatedPlaylists: {
      uploads: string;
    };
  };
}

export interface RawVideoItem {
  id: string;
  snippet: {
    publishedAt: string;
    title: string;
    description: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
      maxres?: { url: string };
    };
    channelId: string;
    channelTitle: string;
    tags?: string[];
    categoryId?: string;
  };
  statistics: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
  contentDetails: {
    duration: string; // ISO 8601
  };
}

// ─── Normalized Domain Types ──────────────────────────────────────────────────

export interface ChannelInfo {
  id: string;
  title: string;
  description: string;
  customUrl?: string;
  publishedAt: string;
  thumbnailUrl: string;
  country?: string;
  subscriberCount: number;
  totalViewCount: number;
  videoCount: number;
}

export type ContentFormat =
  | "Comparison"
  | "Ranking"
  | "Timeline"
  | "Tutorial"
  | "Documentary"
  | "DataVisualization"
  | "TopList"
  | "ShortsClip"
  | "Unknown";

export type TitlePattern =
  | "number"
  | "vs"
  | "question"
  | "topBestWorst"
  | "year"
  | "clickbait"
  | "none";

export interface VideoData {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  tags: string[];
  durationSeconds: number;
  isShort: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  format: ContentFormat;
  titlePatterns: TitlePattern[];
}

// ─── Metrics ──────────────────────────────────────────────────────────────────

export interface ChannelMetrics {
  averageViews: number;
  medianViews: number;
  averageDuration: number;
  uploadsPerWeek: number;
  shortsRatio: number;
  totalVideosAnalyzed: number;
  longFormAverageViews: number;
  shortsAverageViews: number;
}

export interface VideoPerformance extends VideoData {
  performanceScore: number; // views / averageViews
  outlierScore: number;     // views / medianViews
  isViral: boolean;
}

// ─── Title Analysis ───────────────────────────────────────────────────────────

export interface TitlePatternStat {
  pattern: TitlePattern;
  count: number;
  averageViews: number;
  topVideos: VideoData[];
}

// ─── Opportunities ────────────────────────────────────────────────────────────

export interface ContentOpportunity {
  type: "winning_pattern" | "content_gap" | "content_idea";
  title: string;
  description: string;
  supportingData?: string;
}

// ─── Final Report ─────────────────────────────────────────────────────────────

export interface CompetitorReport {
  generatedAt: string;
  channel: ChannelInfo;
  metrics: ChannelMetrics;
  videos: VideoPerformance[];
  viralVideos: VideoPerformance[];
  titlePatterns: TitlePatternStat[];
  contentFormats: Record<ContentFormat, number>;
  opportunities: ContentOpportunity[];
}

// ─── API Request / Response ───────────────────────────────────────────────────

export interface AnalyzeRequest {
  input: string;
  maxVideos?: number;
}

export interface AnalyzeResponse {
  success: true;
  report: CompetitorReport;
  cached: boolean;
}

export interface AnalyzeError {
  success: false;
  error: string;
}
