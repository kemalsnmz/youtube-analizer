import type { VideoData, ChannelMetrics } from "@/features/competitor-analysis/types";
import type { OutlierVideo, OutlierLevel } from "../types";

function getOutlierLevel(performanceScore: number, outlierScore: number): OutlierLevel {
  const max = Math.max(performanceScore, outlierScore);
  if (max >= 10) return "ViralOutlier";
  if (max >= 5) return "StrongOutlier";
  if (max >= 3) return "Outlier";
  if (max >= 2) return "AboveAverage";
  return "Normal";
}

export function detectOutliers(videos: VideoData[], metrics: ChannelMetrics): OutlierVideo[] {
  return videos
    .map((video) => {
      const performanceScore =
        metrics.averageViews > 0 ? video.viewCount / metrics.averageViews : 1;
      const outlierScore =
        metrics.medianViews > 0 ? video.viewCount / metrics.medianViews : 1;
      const daysSince = Math.max(
        1,
        (Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      const viewsPerDay = video.viewCount / daysSince;
      const engagementRate =
        video.viewCount > 0
          ? (video.likeCount + video.commentCount) / video.viewCount
          : 0;

      return {
        video,
        performanceScore,
        outlierScore,
        outlierLevel: getOutlierLevel(performanceScore, outlierScore),
        viewsPerDay,
        engagementRate,
      };
    })
    .sort((a, b) => b.outlierScore - a.outlierScore);
}

export function getTopOutliers(outliers: OutlierVideo[], limit = 10): OutlierVideo[] {
  return outliers.filter((o) => o.outlierLevel !== "Normal").slice(0, limit);
}
