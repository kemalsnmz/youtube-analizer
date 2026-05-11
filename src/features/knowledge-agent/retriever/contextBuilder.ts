import { semanticSearch } from "./semanticSearch";

export function buildKnowledgeContext(question: string): string {
  const results = semanticSearch({ query: question, limit: 4, minScore: 0.05 });
  if (results.length === 0) return "";

  const snippets = results
    .map((r, i) => `[Kaynak ${i + 1}: ${r.source.title}]\n${r.chunk.text.slice(0, 400)}`)
    .join("\n\n");

  return `\n\nBİLGİ KÜTÜPHANESİ:\nAşağıdaki kaynaklar bu soruyla ilgili bulundu:\n\n${snippets}`;
}
