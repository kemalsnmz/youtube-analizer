import fs from "fs";
import path from "path";
import type { KnowledgeSource } from "../types";
import { getAllSources } from "../embeddings/vectorStore";

const VAULT_PATH = process.env.OBSIDIAN_VAULT_PATH ?? "";

// ─── Kategori Haritası ────────────────────────────────────────────────────────

const CATEGORY_MAP: { pattern: RegExp; folder: string; label: string }[] = [
  { pattern: /audit|diagnos|problem|fix|stuck|plateau|turnaround|critique|failure|revival/, folder: "audit", label: "🔍 Kanal Teşhisi" },
  { pattern: /ctr|click.through|thumbnail|impression|split.test|ab.test/, folder: "ctr", label: "🖼️ CTR & Thumbnail" },
  { pattern: /retention|watch.time|drop.off|hook|pacing|pattern.interrupt|rewatch|loop/, folder: "retention", label: "⏱️ Retention" },
  { pattern: /algorithm|suggest|recommend|homepage|discovery|viral|impressions|push/, folder: "algorithm", label: "⚙️ Algoritma" },
  { pattern: /seo|keyword|search.rank|tag|description|chapter|timestamp/, folder: "seo", label: "🔎 SEO" },
  { pattern: /competitor|rival|gap.analys|reverse.engineer/, folder: "competitor", label: "🏆 Rakip Analizi" },
  { pattern: /growth|grow|case.study|0.to|subscriber.*plan|transformation/, folder: "growth", label: "📈 Büyüme" },
  { pattern: /analytic|metric|studio|data|rpm|cpm|revenue|traffic.source/, folder: "analytics", label: "📊 Analitik" },
  { pattern: /strateg|content.plan|niche|calendar|batch|evergreen|pillar/, folder: "strategy", label: "🗺️ Strateji" },
  { pattern: /monetiz|sponsor|brand.deal|adsense/, folder: "monetization", label: "💰 Monetizasyon" },
  { pattern: /shorts|short.form/, folder: "shorts", label: "⚡ Shorts" },
  { pattern: /engag|comment|community|subscribe.*psychology|end.screen/, folder: "engagement", label: "💬 Engagement" },
  { pattern: /production|format|length|intro|storytelling|script|emotion/, folder: "production", label: "🎬 Üretim" },
];

function inferCategory(source: KnowledgeSource): { folder: string; label: string } {
  const text = (source.tags.join(" ") + " " + source.title).toLowerCase();
  for (const { pattern, folder, label } of CATEGORY_MAP) {
    if (pattern.test(text)) return { folder, label };
  }
  return { folder: "general", label: "📚 Genel" };
}

// ─── Stopwords & Keyword Extraction ──────────────────────────────────────────

const STOPWORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by",
  "from","as","is","was","are","were","be","been","have","has","had","do","does",
  "did","will","would","could","should","may","might","this","that","these","those",
  "i","you","he","she","we","they","it","its","my","your","his","her","our","their",
  "how","what","when","where","why","which","who","can","not","no","so","if","then",
  "youtube","video","channel","videos","channels","get","make","your","more","also",
  "about","just","like","use","using","used","very","really","well","good","best",
  "bir","ve","bu","ile","da","de","için","olan","çok","daha","ama","en","ne","ya","ki",
]);

function extractKeywords(text: string, topN = 30): string[] {
  const freq: Record<string, number> = {};
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9çğışöüÇĞİŞÖÜ\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));
  for (const w of words) freq[w] = (freq[w] ?? 0) + 1;
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, topN).map(([w]) => w);
}

function findRelated(source: KnowledgeSource, all: KnowledgeSource[]): KnowledgeSource[] {
  const srcKeywords = new Set(extractKeywords(source.rawText));
  const srcTags = new Set(source.tags.map((t) => t.toLowerCase()));

  return all
    .filter((s) => s.id !== source.id)
    .map((other) => {
      let score = 0;
      for (const tag of other.tags) if (srcTags.has(tag.toLowerCase())) score += 4;
      for (const kw of extractKeywords(other.rawText)) if (srcKeywords.has(kw)) score += 1;
      return { source: other, score };
    })
    .filter((r) => r.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((r) => r.source);
}

// ─── Dosya İşlemleri ──────────────────────────────────────────────────────────

export function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").trim().slice(0, 100);
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ─── MOC (Map of Content) Güncelleyici ───────────────────────────────────────

function updateMOC(folder: string, label: string, allSources: KnowledgeSource[]): void {
  const folderPath = path.join(VAULT_PATH, folder);
  ensureDir(folderPath);

  const sources = allSources.filter((s) => inferCategory(s).folder === folder);
  if (sources.length === 0) return;

  const links = sources
    .sort((a, b) => b.wordCount - a.wordCount)
    .map((s) => `- [[${folder}/${sanitizeFilename(s.title)}]] (${s.wordCount} kelime)`)
    .join("\n");

  const content = `---
type: moc
category: ${folder}
noteCount: ${sources.length}
---

# ${label}

Bu klasördeki ${sources.length} kaynak:

${links}

---
[[YouTube Uzman Kütüphanesi]] ← Ana dizine dön
`;

  fs.writeFileSync(path.join(folderPath, `MOC - ${label}.md`), content, "utf-8");
}

function updateMasterIndex(allSources: KnowledgeSource[]): void {
  if (!VAULT_PATH) return;

  const byFolder: Record<string, KnowledgeSource[]> = {};
  for (const s of allSources) {
    const { folder } = inferCategory(s);
    if (!byFolder[folder]) byFolder[folder] = [];
    byFolder[folder].push(s);
  }

  const sections = CATEGORY_MAP.map(({ folder, label }) => {
    const sources = byFolder[folder] ?? [];
    if (sources.length === 0) return null;
    return `### ${label} (${sources.length} kaynak)\n[[${folder}/MOC - ${label}]]`;
  }).filter(Boolean).join("\n\n");

  const content = `---
type: master-index
totalSources: ${allSources.length}
---

# 🎓 YouTube Uzman Kütüphanesi

Toplam **${allSources.length}** kaynak — kanal teşhisi, büyüme planlaması ve algoritma uzmanlığı.

## Kategoriler

${sections}
`;

  fs.writeFileSync(path.join(VAULT_PATH, "YouTube Uzman Kütüphanesi.md"), content, "utf-8");
}

// ─── Ana Yazıcı ───────────────────────────────────────────────────────────────

export function writeToObsidian(source: KnowledgeSource): void {
  if (!VAULT_PATH) return;

  const allSources = getAllSources();
  const { folder, label } = inferCategory(source);
  const folderPath = path.join(VAULT_PATH, folder);
  ensureDir(folderPath);

  const related = findRelated(source, allSources);
  const filename = sanitizeFilename(source.title) + ".md";
  const filepath = path.join(folderPath, filename);
  const tags = source.tags.map((t) => `"${t}"`).join(", ");
  const date = new Date(source.createdAt).toISOString().split("T")[0];

  const relatedLinks =
    related.length > 0
      ? "\n## İlgili Notlar\n\n" +
        related.map((r) => {
          const { folder: rFolder } = inferCategory(r);
          return `- [[${rFolder}/${sanitizeFilename(r.title)}]]`;
        }).join("\n") + "\n"
      : "";

  const content = `---
title: "${source.title.replace(/"/g, "'")}"
source: ${source.sourceType}
url: ${source.url}
category: ${folder}
tags: [${tags}]
wordCount: ${source.wordCount}
date: ${date}
---

## Özet

${source.summary || "_Özet oluşturulmadı._"}

## İçerik

${source.rawText.slice(0, 50_000)}
${relatedLinks}
---
[[${folder}/MOC - ${label}]] ← Kategoriye dön | [[YouTube Uzman Kütüphanesi]] ← Ana dizin
`;

  fs.writeFileSync(filepath, content, "utf-8");

  // MOC ve master index güncelle
  updateMOC(folder, label, allSources);
  updateMasterIndex(allSources);
}

export function deleteFromObsidian(title: string, source?: KnowledgeSource): void {
  if (!VAULT_PATH) return;
  try {
    const folder = source ? inferCategory(source).folder : null;
    const filename = sanitizeFilename(title) + ".md";
    const filepath = folder
      ? path.join(VAULT_PATH, folder, filename)
      : path.join(VAULT_PATH, filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  } catch { /* ignore */ }
}
