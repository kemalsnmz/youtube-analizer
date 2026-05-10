import { NextRequest, NextResponse } from "next/server";
import { analyzeChannel } from "@/features/competitor-analysis/api/analyzer";
import { validateYoutubeInput } from "@/features/competitor-analysis/utils/urlParser";
import type { AnalyzeResponse, AnalyzeError } from "@/features/competitor-analysis/types";

export async function POST(req: NextRequest): Promise<NextResponse<AnalyzeResponse | AnalyzeError>> {
  try {
    const body = await req.json();
    const input: string = body.input ?? "";
    const maxVideos: number = Math.min(Number(body.maxVideos ?? 50), 200);

    if (!validateYoutubeInput(input)) {
      return NextResponse.json({ success: false, error: "Geçersiz kanal girişi" }, { status: 400 });
    }

    const { report, cached } = await analyzeChannel(input, maxVideos);
    return NextResponse.json({ success: true, report, cached });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bilinmeyen hata";
    console.error("[competitor-analysis]", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
