import type { ChannelMetrics } from "@/features/competitor-analysis/types";
import type { OutlierVideo, UploadFrequencyInsight, ChannelHealthData } from "../types";

export function calculateChannelHealth(
  metrics: ChannelMetrics,
  outliers: OutlierVideo[],
  uploadFreq: UploadFrequencyInsight
): ChannelHealthData {
  const totalVideos = Math.max(1, metrics.totalVideosAnalyzed);

  const uploadConsistency = uploadFreq.consistencyScore;

  const outlierCount = outliers.filter(
    (o) => o.outlierLevel !== "Normal" && o.outlierLevel !== "AboveAverage"
  ).length;
  const outlierRate = Math.min(100, Math.round((outlierCount / totalVideos) * 100 * 5));

  const avgEngagement =
    outliers.length > 0
      ? outliers.reduce((sum, o) => sum + o.engagementRate, 0) / outliers.length
      : 0;
  const engagementHealth = Math.min(100, Math.round(avgEngagement * 5000));

  const formats = new Set(outliers.map((o) => o.video.format));
  const contentDiversity = Math.min(100, formats.size * 15);

  const ratio = metrics.shortsRatio;
  const shortsBalance =
    ratio >= 0.2 && ratio <= 0.4
      ? 100
      : ratio < 0.1 || ratio > 0.7
      ? 30
      : 60;

  const score = Math.round(
    uploadConsistency * 0.3 +
      outlierRate * 0.25 +
      engagementHealth * 0.2 +
      contentDiversity * 0.1 +
      shortsBalance * 0.15
  );

  const label: ChannelHealthData["label"] =
    score >= 80
      ? "Mükemmel"
      : score >= 60
      ? "İyi"
      : score >= 40
      ? "Orta"
      : score >= 20
      ? "Düşük"
      : "Kritik";

  return {
    score,
    label,
    factors: {
      uploadConsistency,
      outlierRate,
      engagementHealth,
      contentDiversity,
      shortsBalance,
    },
  };
}
