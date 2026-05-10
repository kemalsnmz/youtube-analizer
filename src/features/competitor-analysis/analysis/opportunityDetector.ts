import type {
  ChannelMetrics,
  TitlePatternStat,
  VideoPerformance,
  ContentFormat,
  ContentOpportunity,
} from "../types";
import { formatNumber } from "../utils/formatters";

const PATTERN_LABELS: Record<string, string> = {
  number: "Sayı İçeren",
  vs: "VS / Karşılaştırma",
  question: "Soru Başlığı",
  topBestWorst: "Top / En İyi / En Kötü",
  year: "Yıl İçeren",
  clickbait: "Clickbait",
};

const FORMAT_DETAILS: Record<string, { label: string; why: string; howto: string }> = {
  Comparison: {
    label: "Karşılaştırma",
    why: "İzleyiciler karar vermek için karşılaştırma içeriklerine yoğun ilgi gösterir. 'X mi Y mi?' formatı yüksek tıklanma oranı üretir.",
    howto: "Kendi nişindeki iki popüler ürünü, kişiyi veya fikri karşılaştır. Başlığa 'vs' veya 'mi?' ekle.",
  },
  Ranking: {
    label: "Sıralama / Top Liste",
    why: "İnsanlar sıralama içeriklerini merak ettikleri için izler ve paylaşır. Algoritma tarafından da önerilme oranı yüksektir.",
    howto: "'En iyi 10...', 'Top 5...', 'En kötü 7...' formatında video üret. Sıralama tartışmalı olursa yorum ve etkileşim artar.",
  },
  Timeline: {
    label: "Tarihsel / Timeline",
    why: "Eğitici ve merak uyandırıcı içerikler uzun izlenme süresi sağlar. YouTube bu tür videoları daha fazla önerir.",
    howto: "'X'in tarihi', 'Y nasıl değişti', 'Z'nin yükselişi ve düşüşü' formatında içerik üret.",
  },
  Tutorial: {
    label: "Tutorial / Nasıl Yapılır",
    why: "Arama motoru odaklı içerikler uzun vadede organik trafik getirir. İzleyici aynı videoya defalarca döner.",
    howto: "'Nasıl yapılır', 'Adım adım', 'Başlangıç rehberi' formatlarını dene. Başlığa hedef kelimeyi koy.",
  },
  Documentary: {
    label: "Belgesel / Hikaye",
    why: "Hikaye formatı izleyiciyi duygusal olarak bağlar. Paylaşım oranı diğer formatlara göre çok daha yüksektir.",
    howto: "'X'in hikayesi', 'Perde arkası', 'Gerçek yüzü' gibi formatlar dene. Kişisel bir anlatı kullan.",
  },
  DataVisualization: {
    label: "Veri Görselleştirme",
    why: "Veri odaklı içerikler güvenilirlik yaratır ve medyada paylaşılma şansı yüksektir.",
    howto: "İstatistik, grafik veya karşılaştırmalı veri içeren videolar üret. 'Verilerle X', 'İstatistikler ne diyor' formatlarını kullan.",
  },
  TopList: {
    label: "Liste İçeriği",
    why: "Liste formatı izleyiciye net bir beklenti verir. '10 şey' başlığı merak uyandırır ve tıklanma oranını artırır.",
    howto: "'X hakkında bilmediğin 7 şey', 'Mutlaka izlemen gereken 5 film' gibi başlıklar dene.",
  },
};

export function detectOpportunities(
  metrics: ChannelMetrics,
  titlePatterns: TitlePatternStat[],
  viralVideos: VideoPerformance[],
  contentFormats: Record<ContentFormat, number>
): ContentOpportunity[] {
  const opportunities: ContentOpportunity[] = [];

  // ── Winning title patterns ─────────────────────────────────────────────────
  const winningPatterns = titlePatterns.filter(
    (p) => p.pattern !== "none" && p.averageViews > metrics.averageViews * 1.3
  );
  for (const p of winningPatterns.slice(0, 3)) {
    const label = PATTERN_LABELS[p.pattern] ?? p.pattern;
    const uplift = Math.round((p.averageViews / metrics.averageViews - 1) * 100);
    const topExample = p.topVideos[0];
    opportunities.push({
      type: "winning_pattern",
      title: `"${label}" başlıkları rakip için çalışıyor — sen de kullan`,
      description:
        `Bu pattern'le yapılan ${p.count} video, kanal ortalamasının %${uplift} üzerinde görüntüleme aldı. ` +
        `Bu rakibin en etkili başlık formüllerinden biri. ` +
        (topExample
          ? `En iyi örnek: "${topExample.title}" — ${formatNumber(topExample.viewCount)} görüntüleme.`
          : "") +
        ` Kendi içeriklerinde bu formatı taklit et; aynı konuyu farklı bir açıdan ele al.`,
      supportingData: `Kanal ortalaması: ${formatNumber(metrics.averageViews)} | Bu pattern ortalaması: ${formatNumber(p.averageViews)} | Fark: +%${uplift}`,
    });
  }

  // ── Content gaps (unused formats) ─────────────────────────────────────────
  const allFormats: ContentFormat[] = [
    "Comparison", "Ranking", "Timeline", "Tutorial",
    "Documentary", "DataVisualization", "TopList",
  ];
  const unusedFormats = allFormats.filter((f) => (contentFormats[f] ?? 0) === 0);
  for (const f of unusedFormats.slice(0, 3)) {
    const detail = FORMAT_DETAILS[f];
    if (!detail) continue;
    opportunities.push({
      type: "content_gap",
      title: `Rakip "${detail.label}" formatını hiç denememiş — bu bir fırsat`,
      description:
        `${detail.why} ` +
        `Rakip bu boşluğu kapatmamış; sen bu formatla girecek olursan izleyici kitlesini ele geçirme şansın var. ` +
        `Nasıl yaparsın: ${detail.howto}`,
      supportingData: `Bu kanalda "${detail.label}" formatında 0 video mevcut.`,
    });
  }

  // ── Shorts gap ─────────────────────────────────────────────────────────────
  if (metrics.shortsRatio < 0.1) {
    opportunities.push({
      type: "content_gap",
      title: "Rakip Shorts'u neredeyse hiç kullanmıyor — büyük bir açık",
      description:
        `Toplam videolarının yalnızca %${Math.round(metrics.shortsRatio * 100)}'i Shorts formatında. ` +
        `YouTube Shorts, abone olmayan kişilere de gösterildiği için keşfedilebilirliği normal videoların çok üzerinde. ` +
        `Rakibin uzun formatlı videolarını 45-60 saniyelik Shorts'lara dönüştür; ` +
        `özellikle en viral videolarının en dikkat çekici anlarını kırp. ` +
        `Bu sayede rakibin göremediği yeni bir kitleye ulaşabilirsin.`,
      supportingData: `Shorts oranı: %${Math.round(metrics.shortsRatio * 100)} | Tavsiye edilen minimum oran: %20-30`,
    });
  }

  // ── Viral content ideas ────────────────────────────────────────────────────
  if (viralVideos.length > 0) {
    const topViral = viralVideos[0];
    const second = viralVideos[1];
    opportunities.push({
      type: "content_idea",
      title: `En viral videoyu analiz et ve benzerini üret`,
      description:
        `Rakibin en çok izlenen videosu "${topViral.title}" — ${formatNumber(topViral.viewCount)} görüntüleme ile kanal ortalamasının ${topViral.performanceScore}x'ini aldı. ` +
        `Bu başarının ardında genellikle konu seçimi, başlık formatı veya yayın zamanlaması yatar. ` +
        (second
          ? `İkinci sıradaki "${second.title}" de ${formatNumber(second.viewCount)} görüntüleme ile öne çıkıyor. `
          : "") +
        `Bu iki videoyu izle, hangi konunun neden bu kadar ilgi çektiğini anla, ` +
        `ardından aynı konuyu kendi tarzınla ve daha güncel bir açıdan ele al.`,
      supportingData: `En viral: ${formatNumber(topViral.viewCount)} görüntüleme | Performans skoru: ${topViral.performanceScore}x | Toplam viral video: ${viralVideos.length}`,
    });
  }

  // ── Upload frequency ──────────────────────────────────────────────────────
  if (metrics.uploadsPerWeek < 1) {
    opportunities.push({
      type: "content_idea",
      title: "Rakip seyrek yüklüyor — tutarlılıkla geçebilirsin",
      description:
        `Rakip haftada ortalama ${metrics.uploadsPerWeek} video yüklüyor. ` +
        `YouTube algoritması tutarlı yükleme yapan kanalları daha fazla önerir. ` +
        `Haftada en az 1-2 video yükleyerek rakibin önüne geçebilirsin. ` +
        `İçerik üretiminde tıkandığında rakibin en başarılı videolarının konularını farklı bir açıdan ele al; ` +
        `bu hem fikir bulmayı kolaylaştırır hem de aynı izleyici kitlesine ulaşmanı sağlar.`,
      supportingData: `Rakip upload sıklığı: haftada ${metrics.uploadsPerWeek} video | Tavsiye: haftada 1-2 minimum`,
    });
  }

  // ── Long form vs shorts performance ───────────────────────────────────────
  if (
    metrics.shortsAverageViews > 0 &&
    metrics.longFormAverageViews > 0 &&
    metrics.shortsAverageViews > metrics.longFormAverageViews * 1.5
  ) {
    opportunities.push({
      type: "winning_pattern",
      title: "Shorts, uzun formattan çok daha iyi performans gösteriyor",
      description:
        `Rakibin Shorts videoları ortalama ${formatNumber(metrics.shortsAverageViews)} görüntüleme alırken, ` +
        `uzun formatlı videolar ortalama ${formatNumber(metrics.longFormAverageViews)} görüntüleme alıyor. ` +
        `Bu, Shorts formatının bu niş için çok daha güçlü olduğunu gösteriyor. ` +
        `Stratejini Shorts ağırlıklı kurman ve uzun formatlı içerikleri daha az ama daha güçlü üretmen önerilir.`,
      supportingData: `Shorts ort.: ${formatNumber(metrics.shortsAverageViews)} | Uzun form ort.: ${formatNumber(metrics.longFormAverageViews)}`,
    });
  }

  return opportunities;
}
