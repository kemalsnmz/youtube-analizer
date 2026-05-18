"use client";

import { useState, useEffect } from "react";
import { BookOpen, Loader2, Search, Play, FileText, ExternalLink } from "lucide-react";
import type { KnowledgeSourcePreview } from "../types";

export function KnowledgeLibraryPanel() {
  const [sources, setSources] = useState<KnowledgeSourcePreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { title: string; url: string; score: number; excerpt: string }[] | null
  >(null);
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

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults(null);
    try {
      const res = await fetch("/api/knowledge/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, limit: 5 }),
      });
      const data = (await res.json()) as {
        results?: { chunk: { text: string }; source: { title: string; url: string }; score: number }[];
      };
      if (data.results && data.results.length > 0) {
        setSearchResults(
          data.results.map((r) => ({
            title: r.source.title,
            url: r.source.url,
            score: r.score,
            excerpt: r.chunk.text.slice(0, 220),
          }))
        );
      } else {
        setSearchResults([]);
      }
    } finally {
      setSearching(false);
    }
  }

  function clearSearch() {
    setSearchQuery("");
    setSearchResults(null);
  }

  const displaySources = sources;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            Bilgi Kütüphanesi
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            AI Strategist'in yanıtlarını oluşturmak için kullandığı {sources.length} kaynak
          </p>
        </div>
        <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full font-medium">
          {sources.length} kaynak
        </span>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Kütüphanede ara... (ör: thumbnail CTR, hook stratejisi)"
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={searching || !searchQuery.trim()}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Ara
          </button>
          {searchResults !== null && (
            <button
              type="button"
              onClick={clearSearch}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium rounded-xl transition-colors"
            >
              Temizle
            </button>
          )}
        </form>

        {/* Search results */}
        {searchResults !== null && (
          <div className="mt-4 space-y-3">
            {searchResults.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Eşleşen kaynak bulunamadı.</p>
            ) : (
              searchResults.map((r, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-gray-900 hover:text-purple-600 flex items-center gap-1 truncate"
                    >
                      <span className="truncate">{r.title}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                    <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full flex-shrink-0">
                      %{Math.round(r.score * 100)} eşleşme
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{r.excerpt}...</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Source list */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
        </div>
      ) : displaySources.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <BookOpen className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-gray-400">Kütüphane henüz boş.</p>
          <p className="text-xs text-gray-300 mt-1">Admin panelinden Research Agent'ı başlatarak doldurabilirsin.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displaySources.map((source) => {
            const isYoutube = source.sourceType === "youtube";
            return (
              <div key={source.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${isYoutube ? "bg-red-50" : "bg-blue-50"}`}>
                    {isYoutube ? (
                      <Play className="w-4 h-4 text-red-600" />
                    ) : (
                      <FileText className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-gray-900 hover:text-purple-600 flex items-center gap-1"
                    >
                      <span className="truncate">{source.title}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-gray-400">{source.wordCount.toLocaleString("tr-TR")} kelime</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{source.chunkCount} parça</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">
                        {new Date(source.createdAt).toLocaleDateString("tr-TR")}
                      </span>
                    </div>
                    {source.summary && (
                      <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-2">{source.summary}</p>
                    )}
                    {source.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {source.tags.slice(0, 6).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full border border-purple-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
