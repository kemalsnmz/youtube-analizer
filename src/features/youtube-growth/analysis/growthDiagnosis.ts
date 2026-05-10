import type { ChannelMetrics } from "@/features/competitor-analysis/types";
import type {
  OutlierVideo,
  UploadFrequencyInsight,
  ChannelHealthData,
  GrowthDiagnosis,
} from "../types";

export function generateGrowthDiagnosis(
  metrics: ChannelMetrics,
  outliers: OutlierVideo[],
  uploadFreq: UploadFrequencyInsight,
  health: ChannelHealthData
): GrowthDiagnosis {
  const reasons: string[] = [];

  if (uploadFreq.trend === "decreasing") {
    reasons.push("Upload sıklığı son 60 günde düşmüş — kanal momentum kaybediyor.");
  }
  if (uploadFreq.perWeek < 1) {
    reasons.push("Haftada 1'den az video yükleniyor — tutarsız içerik takvimi büyümeyi engelliyor.");
  }

  const viralCount = outliers.filter(
    (o) => o.outlierLevel === "ViralOutlier" || o.outlierLevel === "StrongOutlier"
  ).length;

  if (viralCount === 0) {
    reasons.push(
      "Hiç viral veya strong outlier video yok — kanalın büyük hit üretme potansiyeli henüz açılmamış."
    );
  } else if (viralCount >= 3) {
    reasons.push(
      `${viralCount} adet viral/strong outlier video var — kanal hit üretme kapasitesini kanıtlamış.`
    );
  }

  if (metrics.shortsRatio > 0.7) {
    reasons.push(
      "İçeriğin %70'inden fazlası Shorts — long-form abone büyümesi kısıtlanıyor olabilir."
    );
  }
  if (metrics.shortsRatio < 0.05 && metrics.totalVideosAnalyzed > 20) {
    reasons.push(
      "Shorts içerik yok — keşif algoritmasından gelen trafik kaçırılıyor olabilir."
    );
  }

  if (health.factors.engagementHealth < 30) {
    reasons.push(
      "İzlenme başına etkileşim (beğeni + yorum) düşük — topluluk bağı zayıf."
    );
  }

  if (health.factors.uploadConsistency < 40) {
    reasons.push(
      "Upload tutarlılığı düşük — düzenli içerik takvimi YouTube algoritmasında öncelik sağlar."
    );
  }

  const status: GrowthDiagnosis["status"] =
    uploadFreq.trend === "increasing" && viralCount >= 2
      ? "growing"
      : uploadFreq.trend === "decreasing" && health.score < 40
      ? "declining"
      : "stable";

  const summary =
    status === "growing"
      ? "Kanal büyüme modunda — yükleme sıklığı artıyor ve outlier videolar üretiyor."
      : status === "declining"
      ? "Kanal gerileme işaretleri gösteriyor — upload düşüşü ve düşük performans dikkat gerektiriyor."
      : "Kanal stabil seyirde — büyüme için stratejik hamleler yapılabilir.";

  const urgency: GrowthDiagnosis["urgency"] =
    status === "declining" ? "high" : status === "stable" ? "medium" : "low";

  return { status, summary, reasons, urgency };
}
