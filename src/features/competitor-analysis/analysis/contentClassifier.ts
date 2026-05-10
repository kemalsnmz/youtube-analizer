import type { ContentFormat } from "../types";

const FORMAT_RULES: Array<{ format: ContentFormat; keywords: string[] }> = [
  { format: "Comparison", keywords: ["vs", "karşı", "versus", "compared", "or", "mi", "mı"] },
  { format: "Ranking", keywords: ["top ", "best ", "worst ", "ranked", "ranking", "sıralama", "en iyi", "en kötü"] },
  { format: "Tutorial", keywords: ["how to", "tutorial", "guide", "nasıl", "öğren", "learn", "step by step"] },
  { format: "Timeline", keywords: ["history of", "timeline", "tarih", "evolution", "through the years", "yıllar içinde"] },
  { format: "Documentary", keywords: ["story of", "rise and fall", "documentary", "belgesel", "hikayesi"] },
  { format: "DataVisualization", keywords: ["data", "statistics", "stats", "chart", "istatistik", "veri"] },
  { format: "TopList", keywords: ["list", "things you", "reasons why", "facts about", "liste", "şey"] },
];

export function classifyFormat(title: string, durationSeconds: number): ContentFormat {
  if (durationSeconds <= 60) return "ShortsClip";

  const lower = title.toLowerCase();

  for (const { format, keywords } of FORMAT_RULES) {
    if (keywords.some((kw) => lower.includes(kw))) return format;
  }

  return "Unknown";
}

export function aggregateFormats(
  videos: { format: ContentFormat }[]
): Record<ContentFormat, number> {
  const counts: Record<ContentFormat, number> = {
    Comparison: 0,
    Ranking: 0,
    Timeline: 0,
    Tutorial: 0,
    Documentary: 0,
    DataVisualization: 0,
    TopList: 0,
    ShortsClip: 0,
    Unknown: 0,
  };
  for (const v of videos) {
    counts[v.format] = (counts[v.format] ?? 0) + 1;
  }
  return counts;
}
