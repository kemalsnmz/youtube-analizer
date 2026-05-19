"use client";

import { useState } from "react";
import { Lightbulb, Loader2, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import type { GrowthAnalysisReport, VideoIdea } from "../types";

interface Props {
  report: GrowthAnalysisReport;
}

const FORMAT_COLORS: Record<string, string> = {
  Documentary: "bg-blue-100 text-blue-700",
  Tutorial: "bg-green-100 text-green-700",
  Listicle: "bg-orange-100 text-orange-700",
  Story: "bg-pink-100 text-pink-700",
  Review: "bg-yellow-100 text-yellow-700",
  Shorts: "bg-red-100 text-red-700",
  vs: "bg-purple-100 text-purple-700",
};

function IdeaCard({ idea }: { idea: VideoIdea }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(idea.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const colorClass = FORMAT_COLORS[idea.format] ?? "bg-gray-100 text-gray-600";

  return (
    <div
      className={`bg-white border rounded-xl p-4 flex flex-col gap-2 transition-all ${
        copied ? "border-green-400 shadow-sm shadow-green-100" : "border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-gray-900 text-sm leading-snug flex-1">{idea.title}</p>
        <button
          onClick={handleCopy}
          className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          title="Başlığı kopyala"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">{idea.rationale}</p>

      <div className="flex flex-wrap gap-1.5 mt-1">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorClass}`}>
          {idea.format}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
          {idea.targetAudience}
        </span>
      </div>

      {idea.inspirationSource && (
        <p className="text-xs text-gray-400 italic border-t border-gray-50 pt-2">
          İlham: {idea.inspirationSource}
        </p>
      )}
    </div>
  );
}

export function VideoIdeaPanel({ report }: Props) {
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(true);

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/youtube-growth/generate-ideas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ report }),
      });
      const data = (await res.json()) as { ideas?: VideoIdea[]; error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? "Hata");
      setIdeas(data.ideas ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fikirler üretilemedi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-semibold text-gray-900">Video Fikir Üreteci</h2>
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
            AI + Outlier Data
          </span>
        </div>
        {ideas.length > 0 && (
          <button onClick={() => setExpanded((v) => !v)} className="text-gray-400 hover:text-gray-600">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      <div className="p-6">
        {ideas.length === 0 && !loading && (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm mb-4">
              Kanalının outlier videolarına ve başlık pattern'lerine bakarak yayına hazır video fikirleri oluşturulacak.
            </p>
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              Fikir Üret
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-gray-500 text-sm">Outlier veriler analiz ediliyor, fikirler hazırlanıyor...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        {ideas.length > 0 && expanded && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ideas.map((idea, i) => <IdeaCard key={i} idea={idea} />)}
            </div>
            <div className="mt-5 flex justify-center">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-sm font-semibold hover:bg-amber-100 hover:border-amber-300 transition-colors disabled:opacity-50"
              >
                <Lightbulb className="w-4 h-4" />
                Farklı Fikirler Üret
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
