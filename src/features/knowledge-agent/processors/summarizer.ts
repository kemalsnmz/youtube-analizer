interface SummaryResult {
  summary: string;
  tags: string[];
}

interface AnthropicResponse {
  content: { text: string }[];
}

export async function summarizeText(text: string): Promise<SummaryResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { summary: "", tags: [] };

  const sample = text.slice(0, 3000);
  const prompt = `Aşağıdaki metni analiz et ve sadece geçerli JSON döndür, başka hiçbir şey yazma:

${sample}

Döndüreceğin format:
{"summary":"2-3 cümlelik Türkçe özet","tags":["etiket1","etiket2","etiket3","etiket4","etiket5"]}

Etiketler şu konulardan seçilmeli: youtube-growth, algorithm, retention, thumbnail, title-optimization, hook, shorts, engagement, monetization, content-strategy, upload-frequency, channel-health, analytics, seo, community.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) return { summary: "", tags: [] };

    const data = (await res.json()) as AnthropicResponse;
    const raw = data.content[0]?.text ?? "{}";
    const parsed = JSON.parse(raw) as Partial<SummaryResult>;
    return {
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    };
  } catch {
    return { summary: "", tags: [] };
  }
}
