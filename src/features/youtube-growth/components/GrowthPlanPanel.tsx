"use client";

import { useState } from "react";
import { Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import type { GrowthAnalysisReport } from "../types";

interface Props {
  report: GrowthAnalysisReport;
}

export function GrowthPlanPanel({ report }: Props) {
  const [plan, setPlan] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(true);

  async function handleGenerate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/youtube-growth/generate-plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ report }),
      });
      const data = (await res.json()) as { plan?: string; error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? "Hata");
      setPlan(data.plan ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Plan üretilemedi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h2 className="text-base font-semibold text-gray-900">90 Günlük Büyüme Planı</h2>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">AI + Bilgi Kütüphanesi</span>
        </div>
        {plan && (
          <button onClick={() => setExpanded((v) => !v)} className="text-gray-400 hover:text-gray-600">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      <div className="p-6">
        {!plan && !loading && (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm mb-4">
              Kanalın tüm verileri analiz edilerek kişiselleştirilmiş bir 90 günlük büyüme planı oluşturulacak.
            </p>
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Büyüme Planı Oluştur
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <p className="text-gray-500 text-sm">Bilgi kütüphanesi taranıyor, plan hazırlanıyor...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        {plan && expanded && (
          <div className="prose prose-sm max-w-none text-gray-800">
            <MarkdownRenderer content={plan} />
          </div>
        )}
      </div>
    </div>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return <h2 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-2 first:mt-0">{line.slice(3)}</h2>;
        }
        if (line.startsWith("### ")) {
          return <h3 key={i} className="text-base font-semibold text-purple-700 mt-4 mb-1">{line.slice(4)}</h3>;
        }
        if (line.startsWith("- **")) {
          const parts = line.slice(2).split(":**");
          return (
            <div key={i} className="flex gap-2 ml-4 my-0.5">
              <span className="text-purple-500 mt-0.5">•</span>
              <span><strong className="text-gray-900">{parts[0].slice(2)}:</strong>{parts[1]}</span>
            </div>
          );
        }
        if (line.match(/^(\d+)\. /)) {
          return <p key={i} className="ml-4 text-gray-700 my-0.5">{line}</p>;
        }
        if (line.startsWith("- ")) {
          return <p key={i} className="ml-4 text-gray-700 my-0.5">• {line.slice(2)}</p>;
        }
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={i} className="font-semibold text-gray-900 my-1">{line.slice(2, -2)}</p>;
        }
        if (line.trim() === "") {
          return <div key={i} className="h-1" />;
        }
        return <p key={i} className="text-gray-700 leading-relaxed">{renderInline(line)}</p>;
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="text-gray-900">{part.slice(2, -2)}</strong>
      : part
  );
}
