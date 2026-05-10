import { detectTitlePatterns, analyzeTitlePatterns } from "@/features/competitor-analysis/analysis/titleAnalyzer";
import type { VideoData } from "@/features/competitor-analysis/types";

function makeVideo(title: string, viewCount = 1000): VideoData {
  return {
    id: Math.random().toString(),
    title,
    description: "",
    publishedAt: "2024-01-01T00:00:00Z",
    thumbnailUrl: "",
    tags: [],
    durationSeconds: 600,
    isShort: false,
    viewCount,
    likeCount: 0,
    commentCount: 0,
    format: "Unknown",
    titlePatterns: detectTitlePatterns(title),
  };
}

// ─── detectTitlePatterns ──────────────────────────────────────────────────────

describe("detectTitlePatterns", () => {
  test("sayı içeren başlık → number pattern", () => {
    const patterns = detectTitlePatterns("Top 10 YouTube Tricks");
    expect(patterns).toContain("number");
  });

  test("vs içeren başlık → vs pattern", () => {
    const patterns = detectTitlePatterns("iPhone vs Samsung");
    expect(patterns).toContain("vs");
  });

  test("soru işareti ile biten başlık → question pattern", () => {
    const patterns = detectTitlePatterns("Bu işe yarıyor mu?");
    expect(patterns).toContain("question");
  });

  test("'why' ile başlayan başlık → question pattern", () => {
    const patterns = detectTitlePatterns("Why everyone loves this");
    expect(patterns).toContain("question");
  });

  test("'top' ile başlayan başlık → topBestWorst pattern", () => {
    const patterns = detectTitlePatterns("Top viral videos of 2024");
    expect(patterns).toContain("topBestWorst");
  });

  test("yıl içeren başlık → year pattern", () => {
    const patterns = detectTitlePatterns("Best phones of 2023");
    expect(patterns).toContain("year");
  });

  test("clickbait kelimesi içeren başlık → clickbait pattern", () => {
    const patterns = detectTitlePatterns("This is insane!");
    expect(patterns).toContain("clickbait");
  });

  test("nötr başlık → none pattern", () => {
    const patterns = detectTitlePatterns("My daily routine");
    expect(patterns).toContain("none");
  });

  test("birden fazla pattern aynı anda tespit edilir", () => {
    const patterns = detectTitlePatterns("Top 5 best phones of 2024?");
    expect(patterns).toContain("number");
    expect(patterns).toContain("topBestWorst");
    expect(patterns).toContain("year");
    expect(patterns).toContain("question");
  });
});

// ─── analyzeTitlePatterns ─────────────────────────────────────────────────────

describe("analyzeTitlePatterns", () => {
  test("pattern istatistikleri doğru hesaplanır", () => {
    const videos = [
      makeVideo("Top 10 videos", 2000),
      makeVideo("Top 5 channels", 4000),
      makeVideo("My daily vlog", 1000),
    ];
    const stats = analyzeTitlePatterns(videos);
    const numberStat = stats.find((s) => s.pattern === "number");
    expect(numberStat).toBeDefined();
    expect(numberStat!.count).toBe(2);
    expect(numberStat!.averageViews).toBe(3000);
  });

  test("topVideos en yüksek görüntülemeye göre sıralanır", () => {
    const videos = [
      makeVideo("Top 10 tricks", 500),
      makeVideo("Top 5 secrets", 9000),
      makeVideo("Top 3 tips", 3000),
    ];
    const stats = analyzeTitlePatterns(videos);
    const numberStat = stats.find((s) => s.pattern === "number")!;
    expect(numberStat.topVideos[0].viewCount).toBe(9000);
  });

  test("boş video dizisi → boş istatistik", () => {
    const stats = analyzeTitlePatterns([]);
    expect(stats).toHaveLength(0);
  });
});
