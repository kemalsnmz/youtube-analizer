import { NextRequest, NextResponse } from "next/server";
import { semanticSearch } from "@/features/knowledge-agent/retriever/semanticSearch";
import type { SearchQuery } from "@/features/knowledge-agent/types";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: SearchQuery;
  try {
    body = (await req.json()) as SearchQuery;
  } catch {
    return NextResponse.json({ error: "Geçersiz JSON." }, { status: 400 });
  }

  if (!body.query?.trim()) {
    return NextResponse.json({ error: "query alanı zorunlu." }, { status: 400 });
  }

  const results = semanticSearch(body);
  return NextResponse.json({ results });
}
