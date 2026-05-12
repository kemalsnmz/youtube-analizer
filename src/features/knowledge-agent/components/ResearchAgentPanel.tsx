"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Play, Square, CheckCircle, AlertCircle, Search, Download, Loader2 } from "lucide-react";
import type { AgentEvent, ResearchStats } from "../agent/researchAgent";
import { RESEARCH_TOPICS, TOTAL_ESTIMATED_INGESTS } from "../agent/topics";

interface LogLine {
  id: number;
  event: AgentEvent;
  time: string;
}

export function ResearchAgentPanel() {
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<LogLine[]>([]);
  const [stats, setStats] = useState<ResearchStats | null>(null);
  const [done, setDone] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef(0);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  function addLine(event: AgentEvent) {
    const time = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLog((prev) => [...prev, { id: counterRef.current++, event, time }]);
  }

  async function startResearch() {
    setRunning(true);
    setLog([]);
    setStats(null);
    setDone(false);

    try {
      const res = await fetch("/api/admin/research", { method: "POST" });
      if (!res.body) throw new Error("Stream alınamadı.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const event = JSON.parse(line) as AgentEvent;
            addLine(event);
            if (event.type === "done") {
              setStats(event.stats);
              setDone(true);
            }
          } catch {
            // ignore malformed line
          }
        }
      }
    } catch (err) {
      addLine({
        type: "error",
        message: err instanceof Error ? err.message : "Bağlantı hatası.",
      });
    } finally {
      setRunning(false);
    }
  }

  function renderLine(line: LogLine) {
    const { event } = line;

    switch (event.type) {
      case "start":
        return (
          <div className="flex items-center gap-2 text-purple-400 font-medium">
            <Bot className="w-3.5 h-3.5 flex-shrink-0" />
            Agent başlatıldı — {event.totalTopics} konu araştırılacak (~{TOTAL_ESTIMATED_INGESTS} kaynak)
          </div>
        );
      case "thinking":
        return (
          <div className="flex items-start gap-2 text-gray-400 italic">
            <Loader2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 animate-spin" />
            <span className="line-clamp-1">{event.text}</span>
          </div>
        );
      case "search":
        return (
          <div className="flex items-center gap-2 text-blue-400">
            <Search className="w-3.5 h-3.5 flex-shrink-0" />
            Aranıyor: <span className="font-medium">"{event.query}"</span>
          </div>
        );
      case "results":
        return (
          <div className="flex items-center gap-2 text-gray-400 pl-5">
            → {event.count} sonuç bulundu
          </div>
        );
      case "ingest":
        if (event.status === "ok") {
          return (
            <div className="flex items-center gap-2 text-green-400">
              <Download className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="line-clamp-1">Eklendi: <span className="font-medium">{event.title}</span></span>
            </div>
          );
        }
        if (event.status === "cached") {
          return (
            <div className="flex items-center gap-2 text-gray-500 pl-5">
              <span className="line-clamp-1">Zaten mevcut: {event.title}</span>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-2 text-red-400 pl-5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">Hata ({event.title}): {event.error}</span>
          </div>
        );
      case "done":
        return (
          <div className="flex items-start gap-2 text-green-400 font-medium">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>{event.summary}</span>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {event.message}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-100 rounded-lg">
            <Bot className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Research Agent</h3>
          {running && (
            <span className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              <Loader2 className="w-3 h-3 animate-spin" /> Çalışıyor
            </span>
          )}
          {done && !running && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              Tamamlandı
            </span>
          )}
        </div>
        <button
          onClick={startResearch}
          disabled={running}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-colors"
        >
          {running ? (
            <><Square className="w-3.5 h-3.5" /> Çalışıyor...</>
          ) : (
            <><Play className="w-3.5 h-3.5" /> Araştırmayı Başlat</>
          )}
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-5 ml-9">
        Claude {RESEARCH_TOPICS.length} konuyu araştırır, YouTube'dan alakalı videoları bilgi kütüphanesine ekler.
      </p>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Yeni Eklenen", value: stats.ingested, color: "text-green-600 bg-green-50" },
            { label: "Zaten Mevcuttu", value: stats.cached, color: "text-gray-600 bg-gray-50" },
            { label: "Hata", value: stats.errors, color: "text-red-600 bg-red-50" },
          ].map(({ label, value, color }) => (
            <div key={label} className={`rounded-xl p-3 text-center ${color.split(" ")[1]}`}>
              <div className={`text-2xl font-bold ${color.split(" ")[0]}`}>{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Log */}
      {log.length > 0 && (
        <div
          ref={logRef}
          className="bg-gray-950 rounded-xl p-4 h-72 overflow-y-auto font-mono text-xs space-y-1.5"
        >
          {log.map((line) => (
            <div key={line.id} className="flex gap-2">
              <span className="text-gray-600 flex-shrink-0">{line.time}</span>
              <div className="min-w-0">{renderLine(line)}</div>
            </div>
          ))}
          {running && (
            <div className="flex items-center gap-1 text-purple-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Agent düşünüyor...</span>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {log.length === 0 && !running && (
        <div className="text-center py-8 text-gray-400 text-sm">
          <Bot className="w-8 h-8 mx-auto mb-2 text-gray-200" />
          "Araştırmayı Başlat" butonuna bas — Claude otomatik olarak {RESEARCH_TOPICS.length} konuyu araştırır.
        </div>
      )}
    </div>
  );
}
