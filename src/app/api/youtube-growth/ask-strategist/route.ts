import { NextRequest, NextResponse } from "next/server";
import { askGrowthStrategist } from "@/features/youtube-growth/ai/growthStrategist";
import { buildKnowledgeContext } from "@/features/knowledge-agent/retriever/contextBuilder";
import type { AskStrategistRequest, AskStrategistResponse } from "@/features/youtube-growth/types";

export async function POST(
  req: NextRequest
): Promise<NextResponse<AskStrategistResponse | { error: string }>> {
  const body: AskStrategistRequest = await req.json();
  const { question, report } = body;

  if (!question?.trim()) {
    return NextResponse.json({ error: "Soru boş olamaz." }, { status: 400 });
  }

  const knowledgeContext = buildKnowledgeContext(question);

  try {
    const answer = await askGrowthStrategist(question, report, knowledgeContext);
    return NextResponse.json({ answer });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI yanıt üretemedi.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
