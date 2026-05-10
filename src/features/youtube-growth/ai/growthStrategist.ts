import type { GrowthAnalysisReport } from "../types";

export async function askGrowthStrategist(
  question: string,
  report: GrowthAnalysisReport
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY ortam değişkeni .env.local dosyasına eklenmemiş.");
  }

  const systemPrompt = buildSystemPrompt(report);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: question }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Anthropic API hatası ${response.status}: ${body}`);
  }

  const data = await response.json() as { content: { text: string }[] };
  return data.content[0]?.text ?? "Cevap üretilemedi.";
}

function buildSystemPrompt(report: GrowthAnalysisReport): string {
  const { channel, metrics, channelHealth, growthDiagnosis, uploadFrequency, topOutliers, opportunities } = report;

  const outlierList = topOutliers
    .slice(0, 5)
    .map((o) => `- "${o.video.title}" → ${o.outlierLevel} (${o.outlierScore.toFixed(1)}x medyan, ${o.video.viewCount.toLocaleString("tr-TR")} izlenme)`)
    .join("\n");

  const oppList = opportunities
    .map((o) => `- ${o.title}: ${o.reason}`)
    .join("\n");

  return `Sen bir YouTube Growth Strategist'sin. Aşağıdaki kanal verilerine dayanarak kullanıcının sorularını yanıtla.

KURALLAR:
- Genel tavsiye verme. Her önerini somut veriyle destekle.
- Kısa ve uygulanabilir cevaplar ver.
- Türkçe yaz.

KANAL BİLGİLERİ:
Kanal: ${channel.title}
Abone: ${channel.subscriberCount.toLocaleString("tr-TR")}
Analiz edilen video: ${metrics.totalVideosAnalyzed}

METRİKLER:
- Ortalama izlenme: ${metrics.averageViews.toLocaleString("tr-TR")}
- Medyan izlenme: ${metrics.medianViews.toLocaleString("tr-TR")}
- Haftalık upload: ${metrics.uploadsPerWeek}
- Shorts oranı: %${Math.round(metrics.shortsRatio * 100)}

KANAL SAĞLIĞI: ${channelHealth.score}/100 (${channelHealth.label})

BÜYÜME DURUMU: ${growthDiagnosis.status}
${growthDiagnosis.summary}
Sebepler: ${growthDiagnosis.reasons.join(" | ")}

UPLOAD SIKLIĞI:
- Son 30 gün: ${uploadFrequency.last30Days} video
- Son 60 gün: ${uploadFrequency.last60Days} video
- Trend: ${uploadFrequency.trend}
- En aktif gün: ${uploadFrequency.mostActiveDay}

OUTLIER VİDEOLAR:
${outlierList || "Outlier video bulunamadı."}

FIRSATLAR:
${oppList || "Fırsat analizi yapılamadı."}`.trim();
}
