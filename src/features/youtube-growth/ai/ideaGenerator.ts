import type { GrowthAnalysisReport, VideoIdea } from "../types";

interface AnthropicResponse {
  content: { text: string }[];
}

export async function generateVideoIdeas(
  report: GrowthAnalysisReport,
  knowledgeContext: string
): Promise<VideoIdea[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY ortam değişkeni eksik.");

  const { channel, metrics, allOutliers, titlePatterns } = report;

  const outlierLines = allOutliers
    .filter((o) => o.outlierLevel !== "Normal")
    .slice(0, 8)
    .map((o) => `- "${o.video.title}" (${o.outlierScore.toFixed(1)}x median, ${o.video.format})`)
    .join("\n");

  const patternLines = titlePatterns
    .filter((p) => p.count > 0)
    .sort((a, b) => b.averageViews - a.averageViews)
    .slice(0, 5)
    .map((p) => `- ${p.pattern}: ort. ${p.averageViews.toLocaleString("tr-TR")} izlenme (${(p.averageViews / metrics.averageViews).toFixed(1)}x)`)
    .join("\n");

  const systemPrompt = `Sen bir YouTube video stratejisti olarak ${channel.title} kanalına özel video fikirleri üretiyorsun.
Kanalın analiz verileri:
- Abone: ${channel.subscriberCount.toLocaleString("tr-TR")} | Ort. izlenme: ${metrics.averageViews.toLocaleString("tr-TR")}
- Büyüme durumu: ${report.growthDiagnosis.status}

Outlier videolar (en iyi performans gösterenler):
${outlierLines || "Veri yok"}

En iyi başlık pattern'leri:
${patternLines || "Veri yok"}
${knowledgeContext ? `\nStrateji bilgi tabanı:\n${knowledgeContext}` : ""}

Yanıt SADECE geçerli JSON array olacak, başka hiçbir şey yazma.`;

  const userPrompt = `Bu kanala özel 6 adet video fikri üret. Her fikir outlier video pattern'lerini ve başarılı başlık formatlarını taklit etmeli.

Şu JSON formatında döndür:
[
  {
    "title": "Video başlığı (tam, yayına hazır)",
    "rationale": "Neden bu başlık — kanalın hangi verisine dayanıyor (1-2 cümle)",
    "targetAudience": "Kim izleyecek",
    "inspirationSource": "Hangi outlier video veya pattern'den ilham alındı",
    "format": "Documentary | Tutorial | Listicle | Story | Review | Shorts | vs"
  }
]`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API hatası ${res.status}: ${body}`);
  }

  const data = (await res.json()) as AnthropicResponse;
  const raw = data.content[0]?.text ?? "[]";

  // JSON bloğunu extract et (claude bazen ```json ``` ile sarar)
  const jsonMatch = raw.match(/```json\s*([\s\S]*?)```/) ?? raw.match(/(\[[\s\S]*\])/);
  const jsonStr = jsonMatch ? jsonMatch[1] : raw;

  try {
    const parsed = JSON.parse(jsonStr.trim()) as VideoIdea[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
