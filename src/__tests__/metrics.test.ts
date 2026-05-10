import {
  calculateChannelMetrics,
  calculateVideoPerformance,
} from "@/features/competitor-analysis/analysis/metrics";
import type { VideoData } from "@/features/competitor-analysis/types";

function makeVideo(overrides: Partial<VideoData> = {}): VideoData {
  return {
    id: "v1",
    title: "Test Video",
    description: "",
    publishedAt: "2024-01-01T00:00:00Z",
    thumbnailUrl: "",
    tags: [],
    durationSeconds: 600,
    isShort: false,
    viewCount: 1000,
    likeCount: 100,
    commentCount: 10,
    format: "Unknown",
    titlePatterns: ["none"],
    ...overrides,
  };
}

// ─── calculateChannelMetrics ─────────────────────────────────────────────────

describe("calculateChannelMetrics", () => {
  test("boş dizi → sıfır metrikler", () => {
    const metrics = calculateChannelMetrics([]);
    expect(metrics.averageViews).toBe(0);
    expect(metrics.medianViews).toBe(0);
    expect(metrics.totalVideosAnalyzed).toBe(0);
  });

  test("ortalama görüntüleme doğru hesaplanır", () => {
    const videos = [
      makeVideo({ viewCount: 1000 }),
      makeVideo({ viewCount: 3000 }),
    ];
    const metrics = calculateChannelMetrics(videos);
    expect(metrics.averageViews).toBe(2000);
  });

  test("medyan tek sayıda eleman için ortanca değeri döner", () => {
    const videos = [
      makeVideo({ viewCount: 100 }),
      makeVideo({ viewCount: 200 }),
      makeVideo({ viewCount: 900 }),
    ];
    const metrics = calculateChannelMetrics(videos);
    expect(metrics.medianViews).toBe(200);
  });

  test("medyan çift sayıda eleman için iki ortancının ortalamasını döner", () => {
    const videos = [
      makeVideo({ viewCount: 100 }),
      makeVideo({ viewCount: 200 }),
      makeVideo({ viewCount: 300 }),
      makeVideo({ viewCount: 400 }),
    ];
    const metrics = calculateChannelMetrics(videos);
    expect(metrics.medianViews).toBe(250);
  });

  test("shorts oranı doğru hesaplanır", () => {
    const videos = [
      makeVideo({ isShort: true }),
      makeVideo({ isShort: true }),
      makeVideo({ isShort: false }),
      makeVideo({ isShort: false }),
    ];
    const metrics = calculateChannelMetrics(videos);
    expect(metrics.shortsRatio).toBe(0.5);
  });

  test("toplam video sayısı doğru", () => {
    const videos = [makeVideo(), makeVideo(), makeVideo()];
    const metrics = calculateChannelMetrics(videos);
    expect(metrics.totalVideosAnalyzed).toBe(3);
  });

  test("long form ve shorts ortalamaları ayrı hesaplanır", () => {
    const videos = [
      makeVideo({ isShort: true, viewCount: 5000 }),
      makeVideo({ isShort: false, viewCount: 1000 }),
      makeVideo({ isShort: false, viewCount: 3000 }),
    ];
    const metrics = calculateChannelMetrics(videos);
    expect(metrics.shortsAverageViews).toBe(5000);
    expect(metrics.longFormAverageViews).toBe(2000);
  });
});

// ─── calculateVideoPerformance ────────────────────────────────────────────────

describe("calculateVideoPerformance", () => {
  test("performanceScore ortalama görüntülemeye göre hesaplanır", () => {
    const videos = [
      makeVideo({ id: "v1", viewCount: 3000 }),
      makeVideo({ id: "v2", viewCount: 1000 }),
    ];
    const metrics = calculateChannelMetrics(videos);
    const perf = calculateVideoPerformance(videos, metrics);
    const v1 = perf.find((v) => v.id === "v1")!;
    expect(v1.performanceScore).toBe(1.5); // 3000 / 2000
  });

  test("performanceScore >= 3 → isViral true", () => {
    const videos = [
      makeVideo({ id: "viral", viewCount: 10000 }),
      makeVideo({ id: "normal", viewCount: 1000 }),
      makeVideo({ id: "normal2", viewCount: 1000 }),
    ];
    const metrics = calculateChannelMetrics(videos);
    const perf = calculateVideoPerformance(videos, metrics);
    const viral = perf.find((v) => v.id === "viral")!;
    expect(viral.isViral).toBe(true);
  });

  test("düşük performanslı video viral değil", () => {
    const videos = [
      makeVideo({ id: "v1", viewCount: 1000 }),
      makeVideo({ id: "v2", viewCount: 1000 }),
      makeVideo({ id: "v3", viewCount: 1000 }),
    ];
    const metrics = calculateChannelMetrics(videos);
    const perf = calculateVideoPerformance(videos, metrics);
    expect(perf.every((v) => !v.isViral)).toBe(true);
  });

  test("outlierScore >= 4 → isViral true", () => {
    const videos = [
      makeVideo({ id: "outlier", viewCount: 8000 }),
      makeVideo({ id: "n1", viewCount: 500 }),
      makeVideo({ id: "n2", viewCount: 500 }),
      makeVideo({ id: "n3", viewCount: 500 }),
      makeVideo({ id: "n4", viewCount: 500 }),
    ];
    const metrics = calculateChannelMetrics(videos);
    const perf = calculateVideoPerformance(videos, metrics);
    const outlier = perf.find((v) => v.id === "outlier")!;
    expect(outlier.isViral).toBe(true);
  });
});
