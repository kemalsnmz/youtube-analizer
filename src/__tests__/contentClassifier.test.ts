import { classifyFormat } from "@/features/competitor-analysis/analysis/contentClassifier";

describe("classifyFormat", () => {
  test("60 saniye veya altı → ShortsClip", () => {
    expect(classifyFormat("Herhangi bir başlık", 60)).toBe("ShortsClip");
    expect(classifyFormat("Herhangi bir başlık", 30)).toBe("ShortsClip");
  });

  test("'vs' içeren uzun video → Comparison", () => {
    expect(classifyFormat("iPhone vs Samsung", 600)).toBe("Comparison");
  });

  test("'top' ile başlayan uzun video → Ranking", () => {
    expect(classifyFormat("Top 10 best channels", 600)).toBe("Ranking");
  });

  test("'how to' içeren uzun video → Tutorial", () => {
    expect(classifyFormat("How to edit videos fast", 600)).toBe("Tutorial");
  });

  test("'nasıl' içeren video → Tutorial", () => {
    expect(classifyFormat("Video nasıl düzenlenir", 600)).toBe("Tutorial");
  });

  test("'history of' içeren video → Timeline", () => {
    expect(classifyFormat("The history of YouTube", 600)).toBe("Timeline");
  });

  test("'story of' içeren video → Documentary", () => {
    expect(classifyFormat("The story of MrBeast", 600)).toBe("Documentary");
  });

  test("'data' içeren video → DataVisualization", () => {
    expect(classifyFormat("Data shows the truth", 600)).toBe("DataVisualization");
  });

  test("'list' içeren video → TopList", () => {
    expect(classifyFormat("Things you need to know", 600)).toBe("TopList");
  });

  test("eşleşme yoksa → Unknown", () => {
    expect(classifyFormat("Günlük vlogum", 600)).toBe("Unknown");
  });
});
