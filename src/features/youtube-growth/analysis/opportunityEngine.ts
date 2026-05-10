import type { TitlePatternStat, ChannelMetrics } from "@/features/competitor-analysis/types";
import type { OutlierVideo, UploadFrequencyInsight, GrowthOpportunity } from "../types";

export function generateOpportunities(
  metrics: ChannelMetrics,
  outliers: OutlierVideo[],
  titlePatterns: TitlePatternStat[],
  uploadFreq: UploadFrequencyInsight
): GrowthOpportunity[] {
  const opportunities: GrowthOpportunity[] = [];

  // En başarılı title pattern fırsatı
  const topPattern = titlePatterns
    .filter((p) => p.pattern !== "none" && p.count >= 2)
    .sort((a, b) => b.averageViews - a.averageViews)[0];

  if (topPattern) {
    opportunities.push({
      id: "title-pattern",
      type: "title",
      title: `"${topPattern.pattern}" başlık formatı en yüksek performansı gösteriyor`,
      reason: `Bu formattaki ${topPattern.count} videonun ortalama izlenmesi ${topPattern.averageViews.toLocaleString("tr-TR")} — kanal ortalamasının üzerinde.`,
      confidence: topPattern.count >= 5 ? "high" : "medium",
      impact: "high",
      suggestedTitles: topPattern.topVideos.slice(0, 2).map((v) => `Benzer format: "${v.title}"`),
    });
  }

  // Upload sıklığı fırsatı
  if (uploadFreq.trend === "decreasing" || uploadFreq.perWeek < 1.5) {
    opportunities.push({
      id: "upload-frequency",
      type: "upload",
      title: "Upload sıklığını artır — algoritma tutarlılığı ödüllendirir",
      reason: `Son 30 günde ${uploadFreq.last30Days} video yüklendi. Haftada en az 2 video hedeflenmesi öneriliyor.`,
      confidence: "high",
      impact: "high",
      suggestedTitles: [],
    });
  }

  // En güçlü outlier video formatı fırsatı
  const topOutlier = outliers.find(
    (o) => o.outlierLevel === "ViralOutlier" || o.outlierLevel === "StrongOutlier"
  );
  if (topOutlier) {
    opportunities.push({
      id: "outlier-format",
      type: "outlier",
      title: `"${topOutlier.video.format}" formatı ${topOutlier.outlierLevel === "ViralOutlier" ? "viral" : "güçlü"} sonuç verdi`,
      reason: `"${topOutlier.video.title}" — kanal medyanının ${topOutlier.outlierScore.toFixed(1)} katı izlendi. Bu format tekrar denenmeye değer.`,
      confidence: "high",
      impact: "high",
      suggestedTitles: [`"${topOutlier.video.format}" formatında yeni içerik üret`],
    });
  }

  // Shorts boşluğu fırsatı
  if (metrics.shortsRatio < 0.1 && metrics.totalVideosAnalyzed > 10) {
    opportunities.push({
      id: "shorts-gap",
      type: "shorts",
      title: "Shorts içerik ekle — keşif kanalını aç",
      reason:
        "Kanalda Shorts içerik yok veya çok az. Shorts, yeni izleyicilere ulaşmak için güçlü bir keşif aracı.",
      confidence: "medium",
      impact: "medium",
      suggestedTitles: ["Mevcut en iyi videonun 60 saniyelik özeti"],
    });
  } else if (metrics.shortsRatio > 0.7) {
    opportunities.push({
      id: "longform-gap",
      type: "shorts",
      title: "Long-form içerik ekle — abone bağı kur",
      reason:
        "İçeriğin büyük bölümü Shorts. Long-form videolar daha güçlü izleyici bağı ve abone büyümesi sağlar.",
      confidence: "medium",
      impact: "high",
      suggestedTitles: [],
    });
  }

  return opportunities;
}
