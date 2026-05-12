import { ingestUrl } from "../pipeline/ingestPipeline";

// ─── Tool Definitions (Anthropic schema) ──────────────────────────────────────

export const TOOL_DEFINITIONS = [
  {
    name: "search_youtube",
    description:
      "YouTube'da belirli bir konuyla ilgili video ara. Video başlıkları, kanal adları ve URL'leri döner. Her konuda en alakalı videoları bulmak için kullan.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "YouTube arama sorgusu (İngilizce veya Türkçe)",
        },
        max_results: {
          type: "number",
          description: "Maksimum sonuç sayısı (1-6 arası)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "ingest_url",
    description:
      "Bir YouTube video URL'sini bilgi kütüphanesine ekle. Video başlığı ve açıklaması çekilir, vektör olarak saklanır. Yalnızca gerçekten alakalı videoları ingest et.",
    input_schema: {
      type: "object" as const,
      properties: {
        url: {
          type: "string",
          description: "YouTube video URL'si (https://www.youtube.com/watch?v=...)",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "finish_research",
    description:
      "Tüm konular araştırıldığında çağır. Araştırma tamamlandı sinyali verir.",
    input_schema: {
      type: "object" as const,
      properties: {
        summary: {
          type: "string",
          description: "Araştırma özeti: kaç kaynak eklendi, hangi konular kapsandı",
        },
      },
      required: ["summary"],
    },
  },
] as const;

export type ToolName = "search_youtube" | "ingest_url" | "finish_research";

// ─── Tool Execution ────────────────────────────────────────────────────────────

interface YoutubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    description: string;
  };
}

interface YoutubeSearchResponse {
  items?: YoutubeSearchItem[];
}

export async function executeSearchYoutube(
  query: string,
  maxResults: number = 4
): Promise<string> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return JSON.stringify({ error: "YOUTUBE_API_KEY eksik." });

  const endpoint = new URL("https://www.googleapis.com/youtube/v3/search");
  endpoint.searchParams.set("key", apiKey);
  endpoint.searchParams.set("part", "snippet");
  endpoint.searchParams.set("type", "video");
  endpoint.searchParams.set("q", query);
  endpoint.searchParams.set("maxResults", String(Math.min(maxResults, 6)));
  endpoint.searchParams.set("order", "relevance");

  try {
    const res = await fetch(endpoint.toString());
    if (!res.ok) return JSON.stringify({ error: `YouTube API ${res.status}` });

    const data = (await res.json()) as YoutubeSearchResponse;
    const results = (data.items ?? []).map((item) => ({
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      description: item.snippet.description.slice(0, 150),
    }));

    return JSON.stringify({ results, count: results.length });
  } catch (err) {
    return JSON.stringify({ error: err instanceof Error ? err.message : "Hata" });
  }
}

export async function executeIngestUrl(url: string): Promise<string> {
  try {
    const result = await ingestUrl({ url });
    return JSON.stringify({
      success: true,
      title: result.source.title,
      wordCount: result.source.wordCount,
      chunkCount: result.source.chunks.length,
      cached: result.cached,
    });
  } catch (err) {
    return JSON.stringify({
      success: false,
      error: err instanceof Error ? err.message : "Bilinmeyen hata",
    });
  }
}
