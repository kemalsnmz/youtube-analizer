"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

interface Props {
  onAnalyze: (input: string, maxVideos: number) => void;
  loading: boolean;
}

export function SearchForm({ onAnalyze, loading }: Props) {
  const [input, setInput] = useState("");
  const [maxVideos, setMaxVideos] = useState(50);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim()) onAnalyze(input.trim(), maxVideos);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="YouTube kanal URL'si veya @handle girin..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm shadow-sm"
            disabled={loading}
          />
        </div>
        <select
          value={maxVideos}
          onChange={(e) => setMaxVideos(Number(e.target.value))}
          className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
          disabled={loading}
        >
          <option value={25}>25 video</option>
          <option value={50}>50 video</option>
          <option value={100}>100 video</option>
          <option value={200}>200 video</option>
        </select>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analiz ediliyor...
            </>
          ) : (
            "Analiz Et"
          )}
        </button>
      </div>
      <p className="text-xs text-gray-400">
        Örnek: https://www.youtube.com/@MrBeast · @channel · UCxxxxxx
      </p>
    </form>
  );
}
