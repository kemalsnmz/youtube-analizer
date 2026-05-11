import { NextRequest, NextResponse } from "next/server";
import { ingestUrl } from "@/features/knowledge-agent/pipeline/ingestPipeline";
import type { IngestRequest } from "@/features/knowledge-agent/types";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: IngestRequest;
  try {
    body = (await req.json()) as IngestRequest;
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
  }

  if (!body.url?.trim()) {
    return NextResponse.json({ error: "url alanı zorunlu." }, { status: 400 });
  }

  try {
    const result = await ingestUrl(body);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bilinmeyen hata.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
