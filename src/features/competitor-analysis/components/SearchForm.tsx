"use client";

import { useState } from "react";
import { Search, Loader2, ChevronDown } from "lucide-react";

interface Props {
  onAnalyze: (input: string, maxVideos: number) => void;
  loading: boolean;
}

function isValidYouTubeInput(value: string): boolean {
  const v = value.trim();
  return (
    /youtube\.com\/(channel\/UC|@|c\/|user\/)/.test(v) ||
    /^@[\w.-]+$/.test(v) ||
    /^UC[\w-]{20,}$/.test(v)
  );
}

export function SearchForm({ onAnalyze, loading }: Props) {
  const [input, setInput] = useState("");
  const [maxVideos, setMaxVideos] = useState(50);
  const [validationError, setValidationError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!isValidYouTubeInput(trimmed)) {
      setValidationError("Geçerli bir YouTube kanal URL'si, @handle veya kanal ID'si girin.");
      return;
    }
    setValidationError("");
    onAnalyze(trimmed, maxVideos);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setValidationError(""); }}
            placeholder="@handle veya kanal URL'si..."
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-300 focus:bg-white text-sm transition-all"
            disabled={loading}
          />
        </div>

        {/* Video count select */}
        <div className="relative">
          <select
            value={maxVideos}
            onChange={(e) => setMaxVideos(Number(e.target.value))}
            className="appearance-none pl-4 pr-8 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-300 focus:bg-white transition-all cursor-pointer"
            disabled={loading}
          >
            <option value={25}>25 video</option>
            <option value={50}>50 video</option>
            <option value={100}>100 video</option>
            <option value={200}>200 video</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="relative px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0 bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/30 hover:from-violet-500 hover:to-violet-400 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analiz ediliyor</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Analiz Et</span>
            </>
          )}
        </button>
      </div>

      {/* Helper / error text */}
      <div className="px-1">
        {validationError ? (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
            {validationError}
          </p>
        ) : (
          <p className="text-xs text-gray-400">
            Örnek: <span className="text-gray-500 font-mono">@MrBeast</span> · <span className="text-gray-500 font-mono">https://youtube.com/@channel</span>
          </p>
        )}
      </div>
    </form>
  );
}
