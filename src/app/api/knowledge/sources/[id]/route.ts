import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { deleteSource } from "@/features/knowledge-agent/embeddings/vectorStore";

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/knowledge/sources/[id]">
): Promise<NextResponse> {
  const { id } = await ctx.params;
  const deleted = deleteSource(id);
  if (!deleted) {
    return NextResponse.json({ error: "Kaynak bulunamadı." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
