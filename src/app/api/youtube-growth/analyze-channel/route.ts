import { NextRequest, NextResponse } from "next/server";
import { analyzeChannelGrowth } from "@/features/youtube-growth/api/analyzer";
import { saveAnalysis } from "@/features/youtube-growth/history/historyStore";
import type {
  GrowthAnalyzeRequest,
  GrowthAnalyzeResponse,
  GrowthAnalyzeError,
} from "@/features/youtube-growth/types";

export async function POST(
  req: NextRequest
): Promise<NextResponse<GrowthAnalyzeResponse | GrowthAnalyzeError>> {
  let body: GrowthAnalyzeRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Geçersiz istek.", code: "INVALID_REQUEST" },
      { status: 400 }
    );
  }

  const { channelUrl, maxVideos } = body;
  if (!channelUrl?.trim()) {
    return NextResponse.json(
      { success: false, error: "Kanal URL'si boş olamaz.", code: "INVALID_INPUT" },
      { status: 400 }
    );
  }

  try {
    const { report, cached } = await analyzeChannelGrowth({ channelUrl, maxVideos });
    if (!cached) saveAnalysis(report);
    return NextResponse.json({ success: true, report, cached });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Bilinmeyen hata.";
    const code = msg.toLowerCase().includes("not found") ? "CHANNEL_NOT_FOUND" : "FETCH_FAILED";
    return NextResponse.json({ success: false, error: msg, code }, { status: 500 });
  }
}
