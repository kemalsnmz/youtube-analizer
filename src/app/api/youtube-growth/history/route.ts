import { NextRequest, NextResponse } from "next/server";
import { getAllEntries, getEntriesByChannelId } from "@/features/youtube-growth/history/historyStore";

export async function GET(req: NextRequest) {
  const channelId = req.nextUrl.searchParams.get("channelId");
  const entries = channelId ? getEntriesByChannelId(channelId) : getAllEntries();
  return NextResponse.json({ entries });
}
