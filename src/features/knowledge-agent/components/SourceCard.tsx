"use client";

import { useState } from "react";
import { Trash2, ExternalLink, Play, FileText, Loader2 } from "lucide-react";
import type { KnowledgeSourcePreview } from "../types";

interface Props {
  source: KnowledgeSourcePreview;
  onDeleted: (id: string) => void;
}

export function SourceCard({ source, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`"${source.title}" silinsin mi?`)) return;
    setDeleting(true);
    try {
      await fetch(`/api/knowledge/sources/${source.id}`, { method: "DELETE" });
      onDeleted(source.id);
    } finally {
      setDeleting(false);
    }
  }

  const isYoutube = source.sourceType === "youtube";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${isYoutube ? "bg-red-50" : "bg-blue-50"}`}>
            {isYoutube ? (
              <Play className="w-4 h-4 text-red-600" />
            ) : (
              <FileText className="w-4 h-4 text-blue-600" />
            )}
          </div>
          <div className="min-w-0">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-gray-900 hover:text-purple-600 flex items-center gap-1 truncate"
            >
              <span className="truncate">{source.title}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-400">{source.wordCount.toLocaleString("tr-TR")} kelime</span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400">{source.chunkCount} parça</span>
              <span className="text-xs text-gray-300">·</span>
              <span className="text-xs text-gray-400">
                {new Date(source.createdAt).toLocaleDateString("tr-TR")}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
        >
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>

      {source.summary && (
        <p className="mt-3 text-xs text-gray-600 leading-relaxed line-clamp-2 ml-10">
          {source.summary}
        </p>
      )}

      {source.tags.length > 0 && (
        <div className="mt-3 ml-10 flex flex-wrap gap-1.5">
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
  );
}
