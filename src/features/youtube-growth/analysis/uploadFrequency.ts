import type { VideoData } from "@/features/competitor-analysis/types";
import type { UploadFrequencyInsight } from "../types";

const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

function videosInLastDays(videos: VideoData[], days: number): number {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return videos.filter((v) => new Date(v.publishedAt).getTime() > cutoff).length;
}

export function analyzeUploadFrequency(videos: VideoData[]): UploadFrequencyInsight {
  if (videos.length === 0) {
    return {
      last30Days: 0,
      last60Days: 0,
      last90Days: 0,
      perWeek: 0,
      perMonth: 0,
      mostActiveDay: "Bilinmiyor",
      consistencyScore: 0,
      trend: "stable",
    };
  }

  const last30 = videosInLastDays(videos, 30);
  const last60 = videosInLastDays(videos, 60);
  const last90 = videosInLastDays(videos, 90);

  const perMonth = last30;
  const perWeek = parseFloat((last30 / 4.3).toFixed(1));

  const dayCounts = new Array(7).fill(0);
  for (const v of videos) {
    dayCounts[new Date(v.publishedAt).getDay()]++;
  }
  const mostActiveDay = DAYS[dayCounts.indexOf(Math.max(...dayCounts))];

  const prev30 = last60 - last30;
  let consistencyScore = 50;
  if (last30 > 0 && prev30 > 0) {
    consistencyScore = Math.min(100, Math.round((last30 / prev30) * 50));
  } else if (last30 > 0) {
    consistencyScore = 70;
  }

  let trend: "increasing" | "stable" | "decreasing" = "stable";
  if (prev30 > 0) {
    const change = (last30 - prev30) / prev30;
    if (change > 0.2) trend = "increasing";
    else if (change < -0.2) trend = "decreasing";
  }

  return {
    last30Days: last30,
    last60Days: last60,
    last90Days: last90,
    perWeek,
    perMonth,
    mostActiveDay,
    consistencyScore,
    trend,
  };
}
