import { calculateChannelMetrics } from "@/features/competitor-analysis/analysis/metrics";
import type { VideoData } from "@/features/competitor-analysis/types";

function makeVideo(publishedAt: string): VideoData {
  return {
    id: Math.random().toString(),
    title: "Test",
    description: "",
    publishedAt,
    thumbnailUrl: "",
    tags: [],
    durationSeconds: 600,
    isShort: false,
    viewCount: 1000,
    likeCount: 0,
    commentCount: 0,
    format: "Unknown",
    titlePatterns: ["none"],
  };
}

describe("Upload Frequency", () => {
  test("4 video / 4 hafta = haftada 1 video", () => {
    const videos = [
      makeVideo("2024-01-01T00:00:00Z"),
      makeVideo("2024-01-08T00:00:00Z"),
      makeVideo("2024-01-15T00:00:00Z"),
      makeVideo("2024-01-22T00:00:00Z"),
    ];
    const metrics = calculateChannelMetrics(videos);
    expect(metrics.uploadsPerWeek).toBeCloseTo(1, 0);
  });

  test("7 video / 1 hafta = haftada 7 video", () => {
    const base = new Date("2024-01-01").getTime();
    const videos = Array.from({ length: 7 }, (_, i) =>
      makeVideo(new Date(base + i * 24 * 60 * 60 * 1000).toISOString())
    );
    const metrics = calculateChannelMetrics(videos);
    expect(metrics.uploadsPerWeek).toBeGreaterThanOrEqual(6);
  });

  test("tek video → uploadsPerWeek o videonun kendisi kadar", () => {
    const videos = [makeVideo("2024-01-01T00:00:00Z")];
    const metrics = calculateChannelMetrics(videos);
    expect(metrics.uploadsPerWeek).toBe(videos.length);
  });
});
