import { ingestUrl } from "../pipeline/ingestPipeline";

// ─── Tool Definitions (Anthropic schema) ──────────────────────────────────────

export const TOOL_DEFINITIONS = [
  {
    name: "search_web",
    description:
      "Web'de arama yap ve ilgili makale/blog URL'lerini bul. YouTube dışı kaynaklara (SEO blog'ları, pazarlama siteleri, rehberler) ulaşmak için kullan. Sonuçlardan uygun olanları ingest_url ile ekle.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "Arama sorgusu (örn: 'youtube thumbnail ctr optimization guide 2025')",
        },
        max_results: {
          type: "number",
          description: "Maksimum sonuç sayısı (1-8 arası, varsayılan 5)",
        },
      },
      required: ["query"],
    },
  },
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

export type ToolName = "search_web" | "search_youtube" | "ingest_url" | "finish_research";

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

interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score: number;
}

interface TavilyResponse {
  results?: TavilyResult[];
  error?: string;
}

export async function executeSearchWeb(
  query: string,
  maxResults: number = 5
): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return JSON.stringify({ error: "TAVILY_API_KEY eksik." });

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: Math.min(maxResults, 8),
        search_depth: "basic",
        include_answer: false,
        exclude_domains: ["youtube.com", "youtu.be"],
      }),
    });

    if (!res.ok) return JSON.stringify({ error: `Tavily API ${res.status}` });

    const data = (await res.json()) as TavilyResponse;
    const results = (data.results ?? []).map((r) => ({
      title: r.title,
      url: r.url,
      excerpt: r.content.slice(0, 200),
      score: r.score,
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
