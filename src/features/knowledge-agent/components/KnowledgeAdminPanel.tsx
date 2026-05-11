"use client";

import { useState, useEffect } from "react";
import { BookOpen, Loader2, Search } from "lucide-react";
import { IngestForm } from "./IngestForm";
import { SourceCard } from "./SourceCard";
import type { KnowledgeSourcePreview } from "../types";

export function KnowledgeAdminPanel() {
  const [sources, setSources] = useState<KnowledgeSourcePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    void fetchSources();
  }, []);

  async function fetchSources() {
    setLoading(true);
    try {
      const res = await fetch("/api/knowledge/sources");
      const data = (await res.json()) as { sources?: KnowledgeSourcePreview[] };
      setSources(data.sources ?? []);
    } finally {
      setLoading(false);
    }
  }

  function handleIngested(source: KnowledgeSourcePreview) {
    setSources((prev) => {
      const exists = prev.find((s) => s.id === source.id);
      return exists ? prev : [source, ...prev];
    });
  }

  function handleDeleted(id: string) {
    setSources((prev) => prev.filter((s) => s.id !== id));
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults(null);
    try {
      const res = await fetch("/api/knowledge/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, limit: 3 }),
      });
      const data = (await res.json()) as {
        results?: { chunk: { text: string }; source: { title: string }; score: number }[];
      };
      if (data.results && data.results.length > 0) {
        const formatted = data.results
          .map(
            (r, i) =>
              `[${i + 1}] ${r.source.title} (skor: ${r.score.toFixed(3)})\n${r.chunk.text.slice(0, 200)}...`
          )
          .join("\n\n");
        setSearchResults(formatted);
      } else {
        setSearchResults("Eşleşen kaynak bulunamadı.");
      }
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="space-y-6">
      <IngestForm onIngested={handleIngested} />

      {/* Semantic search test */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-1">Anlamsal Arama</h3>
        <p className="text-xs text-gray-400 mb-4">Kütüphanede bir kavramı ara.</p>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ör: thumbnail tıklanma oranı nasıl artırılır"
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={searching || !searchQuery.trim()}
            className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Ara
          </button>
        </form>
        {searchResults && (
          <pre className="mt-4 bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
            {searchResults}
          </pre>
        )}
      </div>

      {/* Source list */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-purple-600" />
          <h3 className="font-semibold text-gray-900">
            Bilgi Kütüphanesi
            <span className="ml-2 text-sm font-normal text-gray-400">({sources.length} kaynak)</span>
          </h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
          </div>
        ) : sources.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Henüz kaynak eklenmemiş.</p>
            <p className="text-xs text-gray-300 mt-1">YouTube videosu veya makale URL'si ekleyerek başla.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sources.map((source) => (
              <SourceCard key={source.id} source={source} onDeleted={handleDeleted} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
