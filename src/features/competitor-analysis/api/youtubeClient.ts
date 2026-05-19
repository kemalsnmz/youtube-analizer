import type {
  RawChannelData,
  RawVideoItem,
  ChannelInfo,
  VideoData,
} from "../types";
import { parseDuration, isShortVideo } from "../utils/urlParser";
import { classifyFormat } from "../analysis/contentClassifier";
import { detectTitlePatterns } from "../analysis/titleAnalyzer";
import { parseYoutubeInput } from "../utils/urlParser";

const BASE = "https://www.googleapis.com/youtube/v3";

function getApiKeys(): string[] {
  const keys: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const k = i === 1
      ? process.env.YOUTUBE_API_KEY
      : process.env[`YOUTUBE_API_KEY_${i}`];
    if (k?.trim()) keys.push(k.trim());
  }
  if (keys.length === 0) throw new Error("Hiç YOUTUBE_API_KEY tanımlı değil.");
  return keys;
}

function isQuotaError(body: string): boolean {
  try {
    const json = JSON.parse(body);
    return json?.error?.errors?.[0]?.reason === "quotaExceeded";
  } catch (_) { return false; }
}

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  const keys = getApiKeys();

  for (let i = 0; i < keys.length; i++) {
    const url = new URL(`${BASE}${path}`);
    url.searchParams.set("key", keys[i]);
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

    const res = await fetch(url.toString(), { next: { revalidate: 0 } });
    if (res.ok) return res.json() as Promise<T>;

    const body = await res.text();
    if (res.status === 403 && isQuotaError(body)) {
      // Bu key'in kotası dolmuş, sonrakini dene
      if (i < keys.length - 1) continue;
      throw new Error(
        `Tüm YouTube API key'lerinin günlük kotası doldu. Kota her gün gece 03:00 (TR saati) sıfırlanır.`
      );
    }
    throw new Error(`YouTube API hatası (${res.status}). Lütfen tekrar deneyin.`);
  }
  throw new Error("YouTube API isteği başarısız.");
}

// ─── Channel Resolver ─────────────────────────────────────────────────────────

export async function resolveChannelId(rawInput: string): Promise<string> {
  const parsed = parseYoutubeInput(rawInput);

  if (parsed.type === "channel_url" || parsed.type === "channel_id") {
    return parsed.value;
  }

  if (parsed.type === "handle_url" || parsed.type === "handle") {
    const data = await get<{ items?: { id: string }[] }>("/channels", {
      part: "id",
      forHandle: parsed.value,
      maxResults: "1",
    });
    const id = data.items?.[0]?.id;
    if (!id) throw new Error(`Channel not found for handle: @${parsed.value}`);
    return id;
  }

  // custom_url or unknown → search
  const data = await get<{ items?: { id: { channelId: string } }[] }>("/search", {
    part: "id",
    type: "channel",
    q: parsed.value,
    maxResults: "1",
  });
  const id = data.items?.[0]?.id?.channelId;
  if (!id) throw new Error(`Channel not found for query: ${parsed.value}`);
  return id;
}

// ─── Channel Details ──────────────────────────────────────────────────────────

export async function fetchChannelDetails(channelId: string): Promise<ChannelInfo> {
  const data = await get<{ items?: RawChannelData[] }>("/channels", {
    part: "snippet,statistics,contentDetails",
    id: channelId,
  });
  const raw = data.items?.[0];
  if (!raw) throw new Error(`Channel not found: ${channelId}`);

  return {
    id: raw.id,
    title: raw.snippet.title,
    description: raw.snippet.description,
    customUrl: raw.snippet.customUrl,
    publishedAt: raw.snippet.publishedAt,
    thumbnailUrl:
      raw.snippet.thumbnails.high?.url ??
      raw.snippet.thumbnails.medium?.url ??
      raw.snippet.thumbnails.default?.url ??
      "",
    country: raw.snippet.country,
    subscriberCount: parseInt(raw.statistics.subscriberCount ?? "0", 10),
    totalViewCount: parseInt(raw.statistics.viewCount ?? "0", 10),
    videoCount: parseInt(raw.statistics.videoCount ?? "0", 10),
  };
}

export async function fetchUploadsPlaylistId(channelId: string): Promise<string> {
  const data = await get<{ items?: RawChannelData[] }>("/channels", {
    part: "contentDetails",
    id: channelId,
  });
  const playlistId = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!playlistId) throw new Error("Uploads playlist not found");
  return playlistId;
}

// ─── Videos ───────────────────────────────────────────────────────────────────

async function fetchPlaylistVideoIds(
  playlistId: string,
  maxVideos: number
): Promise<string[]> {
  const ids: string[] = [];
  let pageToken: string | undefined;

  while (ids.length < maxVideos) {
    const params: Record<string, string> = {
      part: "contentDetails",
      playlistId,
      maxResults: String(Math.min(50, maxVideos - ids.length)),
    };
    if (pageToken) params.pageToken = pageToken;

    const data = await get<{
      items?: { contentDetails: { videoId: string } }[];
      nextPageToken?: string;
    }>("/playlistItems", params);

    for (const item of data.items ?? []) {
      ids.push(item.contentDetails.videoId);
    }

    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
  }

  return ids;
}

async function fetchVideoDetails(ids: string[]): Promise<RawVideoItem[]> {
  const chunks: RawVideoItem[] = [];
  for (let i = 0; i < ids.length; i += 50) {
    const batch = ids.slice(i, i + 50);
    const data = await get<{ items?: RawVideoItem[] }>("/videos", {
      part: "snippet,statistics,contentDetails",
      id: batch.join(","),
    });
    chunks.push(...(data.items ?? []));
  }
  return chunks;
}

export async function fetchChannelVideos(
  channelId: string,
  maxVideos = 50
): Promise<VideoData[]> {
  const playlistId = await fetchUploadsPlaylistId(channelId);
  const videoIds = await fetchPlaylistVideoIds(playlistId, maxVideos);
  const rawVideos = await fetchVideoDetails(videoIds);

  return rawVideos.map((raw): VideoData => {
    const durationSeconds = parseDuration(raw.contentDetails.duration);
    const isShort = isShortVideo(durationSeconds);
    const viewCount = parseInt(raw.statistics.viewCount ?? "0", 10);
    const likeCount = parseInt(raw.statistics.likeCount ?? "0", 10);
    const commentCount = parseInt(raw.statistics.commentCount ?? "0", 10);
    const thumbnailUrl =
      raw.snippet.thumbnails.maxres?.url ??
      raw.snippet.thumbnails.high?.url ??
      raw.snippet.thumbnails.medium?.url ??
      "";

    return {
      id: raw.id,
      title: raw.snippet.title,
      description: raw.snippet.description,
      publishedAt: raw.snippet.publishedAt,
      thumbnailUrl,
      tags: raw.snippet.tags ?? [],
      durationSeconds,
      isShort,
      viewCount,
      likeCount,
      commentCount,
      format: classifyFormat(raw.snippet.title, durationSeconds),
      titlePatterns: detectTitlePatterns(raw.snippet.title),
    };
  });
}
