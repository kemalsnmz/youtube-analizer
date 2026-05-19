import { NextRequest, NextResponse } from "next/server";
import { generateGrowthPlan } from "@/features/youtube-growth/ai/growthStrategist";
import { buildKnowledgeContext } from "@/features/knowledge-agent/retriever/contextBuilder";
import type { GrowthAnalysisReport } from "@/features/youtube-growth/types";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { report }: { report: GrowthAnalysisReport } = await req.json();

  if (!report) {
    return NextResponse.json({ error: "Report eksik." }, { status: 400 });
  }

  const query = `youtube kanal büyüme planı teşhis ${report.growthDiagnosis.status} ${report.channelHealth.label} CTR retention algoritma`;
  const knowledgeContext = buildKnowledgeContext(query);

  try {
    const plan = await generateGrowthPlan(report, knowledgeContext);
    return NextResponse.json({ plan });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Plan üretilemedi.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
