import { NextRequest, NextResponse } from "next/server";
import { getAllEntries, loadFullReport } from "@/features/youtube-growth/history/historyStore";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const entries = getAllEntries();
  const entry = entries.find((e) => e.id === id);
  if (!entry) {
    return NextResponse.json({ error: "Kayıt bulunamadı." }, { status: 404 });
  }
  const report = loadFullReport(entry.reportFile);
  if (!report) {
    return NextResponse.json({ error: "Rapor dosyası bulunamadı." }, { status: 404 });
  }
  return NextResponse.json({ report, entry });
}
