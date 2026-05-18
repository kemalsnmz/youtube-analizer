import fs from "fs";
import path from "path";
import type { KnowledgeSource } from "../types";
import { getAllSources } from "../embeddings/vectorStore";

const VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH ?? "";

const STOPWORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by",
  "from","as","is","was","are","were","be","been","have","has","had","do","does",
  "did","will","would","could","should","may","might","this","that","these","those",
  "i","you","he","she","we","they","it","its","my","your","his","her","our","their",
  "how","what","when","where","why","which","who","can","not","no","so","if","then",
  "youtube","video","channel","videos","channels","get","make","your","more","also",
  "about","just","like","use","using","used","very","really","well","good","best",
  "bir","ve","bu","ile","da","de","bir","için","olan","çok","daha","olan","ama",
  "en","ne","ya","ki","bu","şu","mi","mı","mu","mü",
]);

function extractKeywords(text: string, topN = 30): string[] {
  const freq: Record<string, number> = {};
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9çğışöüÇĞİŞÖÜ\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));

  for (const w of words) {
    freq[w] = (freq[w] ?? 0) + 1;
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([w]) => w);
}

function findRelated(source: KnowledgeSource, all: KnowledgeSource[]): KnowledgeSource[] {
  const srcKeywords = new Set(extractKeywords(source.rawText));
  const srcTags = new Set(source.tags.map((t) => t.toLowerCase()));

  const scored = all
    .filter((s) => s.id !== source.id)
    .map((other) => {
      let score = 0;

      // Tag overlap (high weight)
      for (const tag of other.tags) {
        if (srcTags.has(tag.toLowerCase())) score += 4;
      }

      // Keyword overlap (content similarity)
      const otherKeywords = extractKeywords(other.rawText);
      for (const kw of otherKeywords) {
        if (srcKeywords.has(kw)) score += 1;
      }

      return { source: other, score };
    })
    .filter((r) => r.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return scored.map((r) => r.source);
}

function ensureVaultDir(): boolean {
  if (!VAULT_PATH) return false;
  try {
    if (!fs.existsSync(VAULT_PATH)) fs.mkdirSync(VAULT_PATH, { recursive: true });
    return true;
  } catch {
    return false;
  }
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

export function writeToObsidian(source: KnowledgeSource): void {
  if (!ensureVaultDir()) return;

  const allSources = getAllSources();
  const related = findRelated(source, allSources);

  const filename = sanitizeFilename(source.title) + ".md";
  const filepath = path.join(VAULT_PATH, filename);

  const tags = source.tags.map((t) => `"${t}"`).join(", ");
  const date = new Date(source.createdAt).toISOString().split("T")[0];

  const relatedLinks =
    related.length > 0
      ? "\n## İlgili Notlar\n\n" +
        related.map((r) => `- [[${sanitizeFilename(r.title)}]]`).join("\n") +
        "\n"
      : "";

  const content = `---
title: "${source.title.replace(/"/g, "'")}"
source: ${source.sourceType}
url: ${source.url}
tags: [${tags}]
wordCount: ${source.wordCount}
date: ${date}
---

## Özet

${source.summary || "_Özet oluşturulmadı._"}

## İçerik

${source.rawText.slice(0, 50_000)}
${relatedLinks}`;

  fs.writeFileSync(filepath, content, "utf-8");
}

export function deleteFromObsidian(title: string): void {
  if (!VAULT_PATH) return;
  try {
    const filename = sanitizeFilename(title) + ".md";
    const filepath = path.join(VAULT_PATH, filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  } catch {
    // ignore
  }
}
