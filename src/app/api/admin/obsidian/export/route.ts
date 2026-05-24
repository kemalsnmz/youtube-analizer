import { NextResponse } from "next/server";
import { getAllSources } from "@/features/knowledge-agent/embeddings/vectorStore";
import { writeToObsidian } from "@/features/knowledge-agent/collectors/obsidianWriter";

export async function POST() {
  const vaultPath = process.env.OBSIDIAN_VAULT_PATH;
  if (!vaultPath) {
    return NextResponse.json({ error: "OBSIDIAN_VAULT_PATH tanımlı değil." }, { status: 400 });
  }

  const sources = getAllSources().filter((s) => s.status === "ready");
  let exported = 0;
  let errors = 0;

  for (const source of sources) {
    try {
      writeToObsidian(source);
      exported++;
    } catch {
      errors++;
    }
  }

  return NextResponse.json({ exported, errors, total: sources.length });
}
