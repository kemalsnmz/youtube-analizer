import { NextResponse } from "next/server";
import { readStore } from "@/features/knowledge-agent/embeddings/vectorStore";
import type { ResearchStatus } from "@/features/knowledge-agent/types";

const STALE_THRESHOLD_DAYS = Number(process.env.RESEARCH_STALE_DAYS ?? 7);

export async function GET(): Promise<NextResponse<ResearchStatus>> {
  const store = readStore();
  const sourceCount = store.sources.length;
  const isEmpty = sourceCount === 0;

  let daysSinceLast: number | null = null;
  let isStale = true;

  if (store.lastResearchAt) {
    const ms = Date.now() - new Date(store.lastResearchAt).getTime();
    daysSinceLast = Math.floor(ms / (1000 * 60 * 60 * 24));
    isStale = daysSinceLast >= STALE_THRESHOLD_DAYS;
  }

  return NextResponse.json({
    sourceCount,
    isEmpty,
    isStale,
    lastResearchAt: store.lastResearchAt,
    daysSinceLast,
    staleThresholdDays: STALE_THRESHOLD_DAYS,
    shouldAutoTrigger: isEmpty || isStale,
  });
}
