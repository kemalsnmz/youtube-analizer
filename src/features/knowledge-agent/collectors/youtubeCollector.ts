import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { join } from "path";
import { readFileSync, unlinkSync, existsSync } from "fs";
import path from "path";

const execFileAsync = promisify(execFile);

const YTDLP = path.join(process.cwd(), "bin", "yt-dlp.exe");

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

// ─── yt-dlp + Groq Whisper ────────────────────────────────────────────────────

async function fetchGroqTranscript(videoId: string): Promise<string | null> {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) return null;

  const outPath = join(tmpdir(), `yt-${videoId}.webm`);

  try {
    // yt-dlp ile ses indir (ffmpeg gerektirmeyen format)
    await execFileAsync(YTDLP, [
      `https://www.youtube.com/watch?v=${videoId}`,
      "-f", "worstaudio",
      "-o", outPath,
      "--no-playlist",
      "--js-runtimes", "node",
      "--quiet",
    ], { timeout: 90_000 });

    if (!existsSync(outPath)) return null;

    const audioBuffer = readFileSync(outPath);
    if (audioBuffer.length > 24 * 1024 * 1024) return null; // 24MB limit

    const blob = new Blob([audioBuffer], { type: "audio/webm" });
    const formData = new FormData();
    formData.append("file", blob, "audio.webm");
    formData.append("model", "whisper-large-v3");
    formData.append("response_format", "text");

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${groqKey}` },
      body: formData,
      signal: AbortSignal.timeout(120_000),
    });

    if (!res.ok) return null;
    return (await res.text()).trim() || null;
  } catch {
    return null;
  } finally {
    try { if (existsSync(outPath)) unlinkSync(outPath); } catch { /* ignore */ }
  }
}

// ─── Ana Kolektör ─────────────────────────────────────────────────────────────

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

  const transcript = await fetchGroqTranscript(videoId);

  const MIN_WORDS = 100;
  const wordCount = transcript ? transcript.split(/\s+/).filter(Boolean).length : 0;
  if (!transcript || wordCount < MIN_WORDS) {
    throw new Error(`Transkript alınamadı veya çok kısa (${wordCount} kelime). Video atlandı.`);
  }

  const text = [title, description, transcript].filter(Boolean).join("\n\n");

  return { title, text, tags: tags.slice(0, 10) };
}
