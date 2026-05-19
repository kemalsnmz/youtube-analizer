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

// ─── yt-dlp metadata fallback ────────────────────────────────────────────────

interface YtdlpMeta {
  title?: string;
  description?: string;
  tags?: string[];
}

async function fetchMetaViaYtdlp(videoId: string): Promise<{ title: string; description: string; tags: string[] } | null> {
  try {
    const { stdout } = await execFileAsync(YTDLP, [
      `https://www.youtube.com/watch?v=${videoId}`,
      "--dump-json",
      "--no-playlist",
      "--skip-download",
      "--quiet",
    ], { timeout: 30_000 });
    const meta = JSON.parse(stdout) as YtdlpMeta;
    return {
      title: meta.title ?? videoId,
      description: meta.description ?? "",
      tags: (meta.tags ?? []).slice(0, 10),
    };
  } catch {
    return null;
  }
}

// ─── Ana Kolektör ─────────────────────────────────────────────────────────────

export async function collectYoutubeVideo(
  videoId: string
): Promise<{ title: string; text: string; tags: string[] }> {
  let title = videoId;
  let description = "";
  let tags: string[] = [];

  // 1. YouTube Data API dene
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (apiKey) {
    try {
      const endpoint = new URL("https://www.googleapis.com/youtube/v3/videos");
      endpoint.searchParams.set("key", apiKey);
      endpoint.searchParams.set("part", "snippet");
      endpoint.searchParams.set("id", videoId);
      const res = await fetch(endpoint.toString());
      if (res.ok) {
        const data = (await res.json()) as YoutubeVideosResponse;
        const item = data.items?.[0];
        if (item) {
          title = item.snippet.title;
          description = item.snippet.description;
          tags = (item.snippet.tags ?? []).slice(0, 10);
        }
      }
    } catch { /* fallback'e geç */ }
  }

  // 2. API başarısız olduysa yt-dlp ile metadata al
  if (title === videoId) {
    const meta = await fetchMetaViaYtdlp(videoId);
    if (meta) {
      title = meta.title;
      description = meta.description;
      tags = meta.tags;
    }
  }

  if (title === videoId && !description) {
    throw new Error("Video metadata alınamadı.");
  }

  // 3. Transkript dene (başarısız olursa title+description ile devam)
  const transcript = await fetchGroqTranscript(videoId).catch(() => null);

  const text = [title, description, transcript].filter(Boolean).join("\n\n");

  return { title, text, tags };
}
