"use client";

import { useState } from "react";
import { Plus, Loader2, Link2, Play } from "lucide-react";
import type { KnowledgeSourcePreview, SourceType } from "../types";

interface Props {
  onIngested: (source: KnowledgeSourcePreview) => void;
}

export function IngestForm({ onIngested }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  function detectType(input: string): SourceType {
    return /youtube\.com|youtu\.be/.test(input) ? "youtube" : "article";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/knowledge/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed, sourceType: detectType(trimmed) }),
      });
      const data = (await res.json()) as {
        source?: KnowledgeSourcePreview;
        cached?: boolean;
        error?: string;
      };

      if (!res.ok || data.error) {
        setError(data.error ?? "Bilinmeyen hata.");
      } else if (data.source) {
        onIngested(data.source);
        setUrl("");
        setSuccessMsg(data.cached ? "Kaynak zaten mevcut." : "Kaynak başarıyla eklendi.");
        setTimeout(() => setSuccessMsg(null), 3000);
      }
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  const isYoutube = detectType(url) === "youtube";

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-1">Kaynak Ekle</h3>
      <p className="text-xs text-gray-400 mb-4">
        YouTube video URL'si veya makale/blog bağlantısı yapıştır.
      </p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {url && isYoutube ? (
              <Play className="w-4 h-4 text-red-500" />
            ) : (
              <Link2 className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            required
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {loading ? "İşleniyor..." : "Ekle"}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}
      {successMsg && (
        <p className="mt-3 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
          {successMsg}
        </p>
      )}
    </form>
  );
}
