import {
  parseYoutubeInput,
  validateYoutubeInput,
  parseDuration,
  isShortVideo,
} from "@/features/competitor-analysis/utils/urlParser";

// ─── validateYoutubeInput ────────────────────────────────────────────────────

describe("validateYoutubeInput", () => {
  test("boş string geçersiz", () => {
    expect(validateYoutubeInput("")).toBe(false);
  });

  test("tek karakter geçersiz", () => {
    expect(validateYoutubeInput("a")).toBe(false);
  });

  test("geçerli URL kabul edilir", () => {
    expect(validateYoutubeInput("https://www.youtube.com/@MrBeast")).toBe(true);
  });

  test("geçerli handle kabul edilir", () => {
    expect(validateYoutubeInput("@MrBeast")).toBe(true);
  });
});

// ─── parseYoutubeInput ───────────────────────────────────────────────────────

describe("parseYoutubeInput", () => {
  test("channel URL parse edilir", () => {
    const result = parseYoutubeInput("https://www.youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA");
    expect(result.type).toBe("channel_url");
    expect(result.value).toBe("UCX6OQ3DkcsbYNE6H8uQQuVA");
  });

  test("@handle URL parse edilir", () => {
    const result = parseYoutubeInput("https://www.youtube.com/@MrBeast");
    expect(result.type).toBe("handle_url");
    expect(result.value).toBe("MrBeast");
  });

  test("youtube.com/c/name parse edilir", () => {
    const result = parseYoutubeInput("https://www.youtube.com/c/kurzgesagt");
    expect(result.type).toBe("custom_url");
    expect(result.value).toBe("kurzgesagt");
  });

  test("bare @handle parse edilir", () => {
    const result = parseYoutubeInput("@Kurzgesagt");
    expect(result.type).toBe("handle");
    expect(result.value).toBe("Kurzgesagt");
  });

  test("UCxxxx channel ID parse edilir", () => {
    const result = parseYoutubeInput("UCX6OQ3DkcsbYNE6H8uQQuVA");
    expect(result.type).toBe("channel_id");
    expect(result.value).toBe("UCX6OQ3DkcsbYNE6H8uQQuVA");
  });

  test("bilinmeyen input unknown döner", () => {
    const result = parseYoutubeInput("mrBeastChannel");
    expect(result.type).toBe("unknown");
    expect(result.value).toBe("mrBeastChannel");
  });

  test("başındaki ve sonundaki boşluklar temizlenir", () => {
    const result = parseYoutubeInput("  @MrBeast  ");
    expect(result.type).toBe("handle");
    expect(result.value).toBe("MrBeast");
  });
});

// ─── parseDuration ───────────────────────────────────────────────────────────

describe("parseDuration", () => {
  test("PT4M13S → 253 saniye", () => {
    expect(parseDuration("PT4M13S")).toBe(253);
  });

  test("PT1H2M30S → 3750 saniye", () => {
    expect(parseDuration("PT1H2M30S")).toBe(3750);
  });

  test("PT30S → 30 saniye", () => {
    expect(parseDuration("PT30S")).toBe(30);
  });

  test("PT10M → 600 saniye", () => {
    expect(parseDuration("PT10M")).toBe(600);
  });

  test("PT1H → 3600 saniye", () => {
    expect(parseDuration("PT1H")).toBe(3600);
  });

  test("geçersiz string → 0", () => {
    expect(parseDuration("")).toBe(0);
    expect(parseDuration("invalid")).toBe(0);
  });
});

// ─── isShortVideo ────────────────────────────────────────────────────────────

describe("isShortVideo", () => {
  test("60 saniye → Short", () => {
    expect(isShortVideo(60)).toBe(true);
  });

  test("59 saniye → Short", () => {
    expect(isShortVideo(59)).toBe(true);
  });

  test("61 saniye → Short değil", () => {
    expect(isShortVideo(61)).toBe(false);
  });

  test("0 saniye → Short değil (geçersiz)", () => {
    expect(isShortVideo(0)).toBe(false);
  });

  test("600 saniye → Short değil", () => {
    expect(isShortVideo(600)).toBe(false);
  });
});
