import type { VideoData, ChannelMetrics, VideoPerformance } from "../types";

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function calculateChannelMetrics(videos: VideoData[]): ChannelMetrics {
  if (videos.length === 0) {
    return {
      averageViews: 0,
      medianViews: 0,
      averageDuration: 0,
      uploadsPerWeek: 0,
      shortsRatio: 0,
      totalVideosAnalyzed: 0,
      longFormAverageViews: 0,
      shortsAverageViews: 0,
    };
  }

  const views = videos.map((v) => v.viewCount);
  const longForm = videos.filter((v) => !v.isShort);
  const shorts = videos.filter((v) => v.isShort);

  // Upload frequency: span between oldest and newest
  const dates = videos.map((v) => new Date(v.publishedAt).getTime()).sort((a, b) => a - b);
  const spanMs = dates[dates.length - 1] - dates[0];
  const spanWeeks = spanMs / (1000 * 60 * 60 * 24 * 7);
  const uploadsPerWeek = spanWeeks > 0 ? videos.length / spanWeeks : videos.length;

  return {
    averageViews: Math.round(average(views)),
    medianViews: Math.round(median(views)),
    averageDuration: Math.round(average(videos.map((v) => v.durationSeconds))),
    uploadsPerWeek: Math.round(uploadsPerWeek * 10) / 10,
    shortsRatio: Math.round((shorts.length / videos.length) * 100) / 100,
    totalVideosAnalyzed: videos.length,
    longFormAverageViews: Math.round(average(longForm.map((v) => v.viewCount))),
    shortsAverageViews: Math.round(average(shorts.map((v) => v.viewCount))),
  };
}

export function calculateVideoPerformance(
  videos: VideoData[],
  metrics: ChannelMetrics
): VideoPerformance[] {
  return videos.map((video) => {
    const performanceScore =
      metrics.averageViews > 0
        ? Math.round((video.viewCount / metrics.averageViews) * 100) / 100
        : 0;
    const outlierScore =
      metrics.medianViews > 0
        ? Math.round((video.viewCount / metrics.medianViews) * 100) / 100
        : 0;
    const isViral = performanceScore >= 3 || outlierScore >= 4;

    return { ...video, performanceScore, outlierScore, isViral };
  });
}
