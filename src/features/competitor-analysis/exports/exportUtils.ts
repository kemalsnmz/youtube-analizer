import type { CompetitorReport } from "../types";

export function exportToJson(report: CompetitorReport): void {
  const json = JSON.stringify(report, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  triggerDownload(blob, `${report.channel.title}-analysis.json`);
}

export function exportToCsv(report: CompetitorReport): void {
  const headers = [
    "Title", "Published", "Views", "Likes", "Comments",
    "Duration (s)", "Is Short", "Format", "Patterns",
    "Performance Score", "Is Viral",
  ];

  const rows = report.videos.map((v) => [
    `"${v.title.replace(/"/g, '""')}"`,
    v.publishedAt.split("T")[0],
    v.viewCount,
    v.likeCount,
    v.commentCount,
    v.durationSeconds,
    v.isShort ? "Yes" : "No",
    v.format,
    v.titlePatterns.join("|"),
    v.performanceScore,
    v.isViral ? "Yes" : "No",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `${report.channel.title}-videos.csv`);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
