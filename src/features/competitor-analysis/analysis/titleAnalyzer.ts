import type { TitlePattern, TitlePatternStat, VideoData } from "../types";

const CLICKBAIT_WORDS = [
  "shocking", "unbelievable", "insane", "crazy", "mind-blowing",
  "you won't believe", "inanılmaz", "şok", "çılgın", "inanılması güç",
  "mutlaka izle", "herkesi şok etti",
];

const TOP_BEST_WORST = ["top", "best", "worst", "en iyi", "en kötü", "en çok"];

export function detectTitlePatterns(title: string): TitlePattern[] {
  const lower = title.toLowerCase();
  const patterns: TitlePattern[] = [];

  if (/\d/.test(title)) patterns.push("number");
  if (/ vs\.? /i.test(title) || /karşı/i.test(title)) patterns.push("vs");
  if (/\?$/.test(title.trim()) || /^(neden|niye|nasıl|what|why|how|is |are |do |does |can )/i.test(title)) patterns.push("question");
  if (TOP_BEST_WORST.some((w) => lower.startsWith(w) || lower.includes(` ${w} `))) patterns.push("topBestWorst");
  if (/\b(19|20)\d{2}\b/.test(title)) patterns.push("year");
  if (CLICKBAIT_WORDS.some((w) => lower.includes(w))) patterns.push("clickbait");

  if (patterns.length === 0) patterns.push("none");
  return patterns;
}

export function analyzeTitlePatterns(videos: VideoData[]): TitlePatternStat[] {
  const patternMap = new Map<TitlePattern, VideoData[]>();

  for (const video of videos) {
    for (const pattern of video.titlePatterns) {
      if (!patternMap.has(pattern)) patternMap.set(pattern, []);
      patternMap.get(pattern)!.push(video);
    }
  }

  const stats: TitlePatternStat[] = [];

  for (const [pattern, patternVideos] of patternMap.entries()) {
    const totalViews = patternVideos.reduce((s, v) => s + v.viewCount, 0);
    const averageViews = Math.round(totalViews / patternVideos.length);
    const topVideos = [...patternVideos]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5);

    stats.push({ pattern, count: patternVideos.length, averageViews, topVideos });
  }

  return stats.sort((a, b) => b.averageViews - a.averageViews);
}
