import { NextRequest, NextResponse } from "next/server";
import { generateVideoIdeas } from "@/features/youtube-growth/ai/ideaGenerator";
import { buildKnowledgeContext } from "@/features/knowledge-agent/retriever/contextBuilder";
import type { GrowthAnalysisReport } from "@/features/youtube-growth/types";

export async function POST(req: NextRequest) {
  let report: GrowthAnalysisReport;
  try {
    const body = await req.json() as { report: GrowthAnalysisReport };
    report = body.report;
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const outlierTitles = report.allOutliers
    .filter((o) => o.outlierLevel !== "Normal")
    .slice(0, 5)
    .map((o) => o.video.title)
    .join(" ");

  const query = `youtube video fikir başlık title format büyüme CTR ${report.growthDiagnosis.status} ${outlierTitles}`;
  const knowledgeContext = buildKnowledgeContext(query);

  try {
    const ideas = await generateVideoIdeas(report, knowledgeContext);
    return NextResponse.json({ ideas });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Bilinmeyen hata.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
