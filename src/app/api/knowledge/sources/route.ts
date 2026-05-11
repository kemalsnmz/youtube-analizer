import { NextResponse } from "next/server";
import { getAllSources } from "@/features/knowledge-agent/embeddings/vectorStore";
import type { KnowledgeSourcePreview } from "@/features/knowledge-agent/types";

export async function GET(): Promise<NextResponse> {
  const sources = getAllSources();

  const previews: KnowledgeSourcePreview[] = sources.map(
    ({ chunks, rawText, ...rest }) => ({
      ...rest,
      chunkCount: chunks.length,
      rawText: rawText.slice(0, 200),
    })
  );

  return NextResponse.json({ sources: previews });
}
