import type { GrowthAnalysisReport } from "../types";

interface AnthropicResponse {
  content: { text: string }[];
}

// ─── Otomatik Büyüme Planı Üretici ───────────────────────────────────────────

export async function generateGrowthPlan(
  report: GrowthAnalysisReport,
  knowledgeContext: string
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY ortam değişkeni eksik.");

  const prompt = `Bu kanalı analiz et ve profesyonel bir büyüme planı oluştur.

Planı şu yapıda ver (Türkçe, markdown formatında):

## 🔍 Kanal Teşhisi
Kanalın mevcut durumu 3-4 cümleyle. Somut sayılar kullan.

## 🚨 Kritik Sorunlar
Her sorun için:
- **Sorun:** [ne]
- **Kanıt:** [kanaldan somut veri]
- **Neden kritik:** [etkisi]

## 📅 90 Günlük Büyüme Planı

### Hafta 1-2: Acil Aksiyonlar
[Bu hafta yapılacak 3-4 somut adım]

### Ay 1: Temel Düzeltmeler
[İlk ay odaklanılacak 3-4 alan]

### Ay 2-3: Büyüme Akseleratörleri
[Büyümeyi hızlandıracak 3-4 strateji]

## 🎯 Öncelikli İçerik Fırsatları
Bu kanalın verilerine göre en yüksek potansiyelli 3 içerik konusu/formatı. Her biri için örnek başlık öner.

## 📊 Başarı Metrikleri
30 / 60 / 90 günde hedeflenmesi gereken somut KPI'lar (izlenme, CTR, retention, abone).`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2500,
      system: buildSystemPrompt(report, knowledgeContext),
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API hatası ${res.status}: ${body}`);
  }

  const data = (await res.json()) as AnthropicResponse;
  return data.content[0]?.text ?? "Plan üretilemedi.";
}

export async function askGrowthStrategist(
  question: string,
  report: GrowthAnalysisReport,
  knowledgeContext = ""
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY ortam değişkeni .env.local dosyasına eklenmemiş.");
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: buildSystemPrompt(report, knowledgeContext),
      messages: [{ role: "user", content: question }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API hatası ${res.status}: ${body}`);
  }

  const data = (await res.json()) as AnthropicResponse;
  return data.content[0]?.text ?? "Cevap üretilemedi.";
}

// ─── System Prompt Builder ────────────────────────────────────────────────────

function buildSystemPrompt(report: GrowthAnalysisReport, knowledgeContext: string): string {
  const {
    channel,
    videos,
    metrics,
    channelHealth,
    growthDiagnosis,
    uploadFrequency,
    allOutliers,
    titlePatterns,
    opportunities,
  } = report;

  // ── Content format distribution ──
  const formatDist = videos.reduce<Record<string, { count: number; totalViews: number }>>(
    (acc, v) => {
      if (!acc[v.format]) acc[v.format] = { count: 0, totalViews: 0 };
      acc[v.format].count += 1;
      acc[v.format].totalViews += v.viewCount;
      return acc;
    },
    {}
  );
  const formatLines = Object.entries(formatDist)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([fmt, { count, totalViews }]) => {
      const pct = Math.round((count / metrics.totalVideosAnalyzed) * 100);
      const avgV = Math.round(totalViews / count);
      const ratio = metrics.averageViews > 0 ? (avgV / metrics.averageViews).toFixed(1) : "?";
      return `  ${fmt}: ${count} video (%${pct}) | ort. ${avgV.toLocaleString("tr-TR")} izlenme (kanal ort. ${ratio}x)`;
    })
    .join("\n");

  // ── Title patterns (sorted by avg views desc) ──
  const patternLines = titlePatterns
    .filter((p) => p.count > 0)
    .sort((a, b) => b.averageViews - a.averageViews)
    .map((p) => {
      const ratio =
        metrics.averageViews > 0 ? (p.averageViews / metrics.averageViews).toFixed(1) : "?";
      const topTitles = p.topVideos
        .slice(0, 2)
        .map((v) => `"${v.title}" (${v.viewCount.toLocaleString("tr-TR")})`)
        .join(", ");
      return `  ${p.pattern}: ${p.count} video | ort. ${p.averageViews.toLocaleString("tr-TR")} izlenme (${ratio}x) | En iyi: ${topTitles}`;
    })
    .join("\n");

  // ── Outlier videos (non-Normal, top 12) ──
  const outlierLines = allOutliers
    .filter((o) => o.outlierLevel !== "Normal")
    .slice(0, 12)
    .map((o) => {
      const patterns = o.video.titlePatterns.length ? o.video.titlePatterns.join("+") : "none";
      return (
        `  [${o.outlierLevel}] "${o.video.title}"\n` +
        `    → ${o.outlierScore.toFixed(1)}x median | ${o.video.viewCount.toLocaleString("tr-TR")} görüntülenme` +
        ` | ${o.viewsPerDay.toFixed(0)} görüntülenme/gün | engagement: %${(o.engagementRate * 100).toFixed(2)}\n` +
        `    → Format: ${o.video.format} | Başlık pattern: ${patterns} | Short: ${o.video.isShort ? "Evet" : "Hayır"}`
      );
    })
    .join("\n");

  // ── Channel health factor breakdown ──
  const { factors } = channelHealth;
  const healthLines = [
    `  Upload tutarlılığı: ${factors.uploadConsistency}/100`,
    `  Outlier oranı:      ${factors.outlierRate}/100`,
    `  Engagement sağlığı: ${factors.engagementHealth}/100`,
    `  İçerik çeşitliliği:${factors.contentDiversity}/100`,
    `  Shorts dengesi:     ${factors.shortsBalance}/100`,
  ].join("\n");

  // ── Opportunities ──
  const oppLines = opportunities
    .map(
      (o) =>
        `  [${o.type}] ${o.title} | güven: ${o.confidence} | etki: ${o.impact}\n` +
        `    ${o.reason}\n` +
        (o.suggestedTitles.length
          ? `    Önerilen başlıklar: ${o.suggestedTitles.slice(0, 2).join(" / ")}`
          : "")
    )
    .join("\n");

  // ── Long-form vs Shorts ──
  const lfVsShorts =
    `Long-form ort. izlenme: ${metrics.longFormAverageViews.toLocaleString("tr-TR")}\n` +
    `Shorts ort. izlenme:    ${metrics.shortsAverageViews.toLocaleString("tr-TR")}\n` +
    `Shorts oranı:           %${Math.round(metrics.shortsRatio * 100)}`;

  return `Sen bir veri odaklı YouTube Growth Strategist'sin.
Aşağıda kanalın tam analiz raporu verilmiştir. Kullanıcının sorularını bu verilere dayanarak yanıtla.

═══════════════════════════════════════════════════════
YANIT KURALLARI
═══════════════════════════════════════════════════════
- Genel tavsiye VERME. Her önerini kanalın somut verisiyle kanıtla.
- Rakam, oran ve pattern kullan. "iyi içerik yap" gibi belirsiz öneri yapma.
- Her yanıtı aşağıdaki yapıda ver (Türkçe):

**Tanı:** [Sorunun/durumun net teşhisi — 1-2 cümle]

**Kanıt:** [Bu kanalın verilerinden 2-4 somut bulgu — sayılar, oranlar, pattern adları]

**Öneri:** [Tek net ve uygulanabilir aksiyon — ne yapmalı, nasıl yapmalı]

**Öncelik:** [Yüksek / Orta / Düşük] — [1 cümle gerekçe]

**Aksiyonlar:**
1. [Somut ilk adım]
2. [Somut ikinci adım]
3. [Somut üçüncü adım]

═══════════════════════════════════════════════════════
KANAL BİLGİLERİ
═══════════════════════════════════════════════════════
Kanal: ${channel.title}
Abone: ${channel.subscriberCount.toLocaleString("tr-TR")}
Analiz edilen video: ${metrics.totalVideosAnalyzed}
Kanal kurulumu: ${channel.publishedAt ? new Date(channel.publishedAt).getFullYear() : "bilinmiyor"}

═══════════════════════════════════════════════════════
PERFORMANS METRİKLERİ
═══════════════════════════════════════════════════════
Ortalama izlenme:      ${metrics.averageViews.toLocaleString("tr-TR")}
Medyan izlenme:        ${metrics.medianViews.toLocaleString("tr-TR")}
Ort. video süresi:     ${Math.round(metrics.averageDuration / 60)} dakika
Haftalık upload:       ${metrics.uploadsPerWeek}

${lfVsShorts}

═══════════════════════════════════════════════════════
KANAL SAĞLIĞI: ${channelHealth.score}/100 (${channelHealth.label})
═══════════════════════════════════════════════════════
${healthLines}

═══════════════════════════════════════════════════════
BÜYÜME DURUMU: ${growthDiagnosis.status.toUpperCase()} | Aciliyet: ${growthDiagnosis.urgency}
═══════════════════════════════════════════════════════
${growthDiagnosis.summary}
Sebepler:
${growthDiagnosis.reasons.map((r) => `  - ${r}`).join("\n")}

═══════════════════════════════════════════════════════
UPLOAD SIKLIĞI
═══════════════════════════════════════════════════════
Son 30 gün:   ${uploadFrequency.last30Days} video
Son 60 gün:   ${uploadFrequency.last60Days} video
Son 90 gün:   ${uploadFrequency.last90Days} video
Tutarlılık:   ${uploadFrequency.consistencyScore}/100
Trend:        ${uploadFrequency.trend}
En aktif gün: ${uploadFrequency.mostActiveDay}

═══════════════════════════════════════════════════════
OUTLIER VİDEOLAR (median üzeri performans)
═══════════════════════════════════════════════════════
${outlierLines || "  Outlier video tespit edilemedi."}

═══════════════════════════════════════════════════════
BAŞLIK PATTERN ANALİZİ (yüksek → düşük performans)
═══════════════════════════════════════════════════════
${patternLines || "  Pattern verisi yok."}

═══════════════════════════════════════════════════════
İÇERİK FORMAT DAĞILIMI
═══════════════════════════════════════════════════════
${formatLines || "  Format verisi yok."}

═══════════════════════════════════════════════════════
BÜYÜME FIRSATLARI
═══════════════════════════════════════════════════════
${oppLines || "  Fırsat analizi yapılamadı."}${knowledgeContext ? `\n\n═══════════════════════════════════════════════════════\nBİLGİ KÜTÜPHANESİ CONTEXT'İ\n═══════════════════════════════════════════════════════${knowledgeContext}` : ""}`.trim();
}
