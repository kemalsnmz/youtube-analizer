interface RawVideoSnippet {
  title: string;
  description: string;
  tags?: string[];
}

interface RawVideoItem {
  id: string;
  snippet: RawVideoSnippet;
}

interface YoutubeVideosResponse {
  items?: RawVideoItem[];
}

export function parseVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  return null;
}

export async function collectYoutubeVideo(
  videoId: string
): Promise<{ title: string; text: string; tags: string[] }> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY ortam değişkeni eksik.");

  const endpoint = new URL("https://www.googleapis.com/youtube/v3/videos");
  endpoint.searchParams.set("key", apiKey);
  endpoint.searchParams.set("part", "snippet");
  endpoint.searchParams.set("id", videoId);

  const res = await fetch(endpoint.toString());
  if (!res.ok) throw new Error(`YouTube API hatası ${res.status}`);

  const data = (await res.json()) as YoutubeVideosResponse;
  const item = data.items?.[0];
  if (!item) throw new Error(`Video bulunamadı: ${videoId}`);

  const { title, description, tags = [] } = item.snippet;
  const text = [title, description].filter(Boolean).join("\n\n");
  return { title, text, tags: tags.slice(0, 10) };
}
