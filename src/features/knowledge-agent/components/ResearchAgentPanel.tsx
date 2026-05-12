"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Play, CheckCircle, AlertCircle, Search, Download, Loader2, Clock, RefreshCw, X } from "lucide-react";
import type { AgentEvent, ResearchStats } from "../agent/researchAgent";
import type { ResearchStatus } from "../types";
import { RESEARCH_TOPICS, TOTAL_ESTIMATED_INGESTS } from "../agent/topics";

interface LogLine {
  id: number;
  event: AgentEvent;
  time: string;
}

const COUNTDOWN_SECS = 5;

export function ResearchAgentPanel() {
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<LogLine[]>([]);
  const [stats, setStats] = useState<ResearchStats | null>(null);
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState<ResearchStatus | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  const startResearch = useCallback(async () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(null);
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
              void fetchStatus();
            }
          } catch {
            // ignore malformed line
          }
        }
      }
    } catch (err) {
      addLine({ type: "error", message: err instanceof Error ? err.message : "Bağlantı hatası." });
    } finally {
      setRunning(false);
    }
  }, []);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/research/status");
      const data = (await res.json()) as ResearchStatus;
      setStatus(data);
      return data;
    } catch {
      return null;
    }
  }, []);

  // On mount: fetch status → auto-trigger if needed
  useEffect(() => {
    fetchStatus().then((data) => {
      if (!data?.shouldAutoTrigger) return;
      let secs = COUNTDOWN_SECS;
      setCountdown(secs);
      countdownRef.current = setInterval(() => {
        secs--;
        if (secs <= 0) {
          clearInterval(countdownRef.current!);
          setCountdown(null);
          void startResearch();
        } else {
          setCountdown(secs);
        }
      }, 1000);
    });

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [fetchStatus, startResearch]);

  function cancelCountdown() {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(null);
  }

  function addLine(event: AgentEvent) {
    const time = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    setLog((prev) => [...prev, { id: counterRef.current++, event, time }]);
  }

  function renderLine(line: LogLine) {
    const { event } = line;
    switch (event.type) {
      case "start":
        return (
          <div className="flex items-center gap-2 text-purple-400 font-medium">
            <Bot className="w-3.5 h-3.5 flex-shrink-0" />
            Agent başlatıldı — {event.totalTopics} konu, ~{TOTAL_ESTIMATED_INGESTS} kaynak hedefi
          </div>
        );
      case "thinking":
        return (
          <div className="flex items-start gap-2 text-gray-500 italic">
            <Loader2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 animate-spin" />
            <span className="line-clamp-1">{event.text}</span>
          </div>
        );
      case "search":
        return (
          <div className="flex items-center gap-2 text-blue-400">
            <Search className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Aranıyor: <span className="font-medium">"{event.query}"</span></span>
          </div>
        );
      case "results":
        return (
          <div className="pl-5 text-gray-500">→ {event.count} sonuç bulundu</div>
        );
      case "ingest":
        if (event.status === "ok") return (
          <div className="flex items-center gap-2 text-green-400">
            <Download className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">Eklendi: <span className="font-medium">{event.title}</span></span>
          </div>
        );
        if (event.status === "cached") return (
          <div className="pl-5 text-gray-600 line-clamp-1">Mevcut: {event.title}</div>
        );
        return (
          <div className="flex items-center gap-2 text-red-400 pl-5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">Hata: {event.error}</span>
          </div>
        );
      case "done":
        return (
          <div className="flex items-start gap-2 text-green-400 font-medium">
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            {event.summary}
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

  // Status badge
  function renderStatusBadge() {
    if (!status) return null;
    if (status.isEmpty) return (
      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
        Kütüphane boş
      </span>
    );
    if (status.isStale) return (
      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {status.daysSinceLast} gündür güncellenmedi
      </span>
    );
    return (
      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        {status.daysSinceLast === 0 ? "Bugün güncellendi" : `${status.daysSinceLast ?? "?"} gün önce güncellendi`}
      </span>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1.5 bg-purple-100 rounded-lg">
            <Bot className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Research Agent</h3>
          {running && (
            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Çalışıyor
            </span>
          )}
          {done && !running && renderStatusBadge()}
          {!done && !running && renderStatusBadge()}
        </div>
        <button
          onClick={() => void startResearch()}
          disabled={running}
          className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-colors"
        >
          {running
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Çalışıyor...</>
            : <><RefreshCw className="w-3.5 h-3.5" /> Şimdi Araştır</>}
        </button>
      </div>

      <p className="text-xs text-gray-400 mb-4 ml-9">
        Claude {RESEARCH_TOPICS.length} konuyu araştırır · Eğer {status?.staleThresholdDays ?? 7}+ gündür güncellenmemişse otomatik başlar
      </p>

      {/* Auto-trigger countdown */}
      {countdown !== null && (
        <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 flex-1">
            {status?.isEmpty
              ? "Bilgi kütüphanesi boş."
              : `Kütüphane ${status?.daysSinceLast} gündür güncellenmedi.`}{" "}
            Araştırma <span className="font-bold">{countdown}</span> saniye içinde başlıyor...
          </p>
          <button
            onClick={cancelCountdown}
            className="flex items-center gap-1 text-xs text-amber-700 hover:text-amber-900 font-medium"
          >
            <X className="w-3.5 h-3.5" /> İptal
          </button>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "Yeni Eklenen", value: stats.ingested, cls: "text-green-600 bg-green-50" },
            { label: "Zaten Mevcuttu", value: stats.cached, cls: "text-gray-600 bg-gray-50" },
            { label: "Hata", value: stats.errors, cls: "text-red-600 bg-red-50" },
          ].map(({ label, value, cls }) => (
            <div key={label} className={`rounded-xl p-3 text-center ${cls.split(" ")[1]}`}>
              <div className={`text-2xl font-bold ${cls.split(" ")[0]}`}>{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Log */}
      {log.length > 0 && (
        <div ref={logRef} className="bg-gray-950 rounded-xl p-4 h-72 overflow-y-auto font-mono text-xs space-y-1.5">
          {log.map((line) => (
            <div key={line.id} className="flex gap-2">
              <span className="text-gray-600 flex-shrink-0">{line.time}</span>
              <div className="min-w-0">{renderLine(line)}</div>
            </div>
          ))}
          {running && (
            <div className="flex items-center gap-1 text-purple-400">
              <Loader2 className="w-3 h-3 animate-spin" /> Agent çalışıyor...
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {log.length === 0 && !running && countdown === null && (
        <div className="text-center py-8 text-gray-400 text-sm">
          <Bot className="w-8 h-8 mx-auto mb-2 text-gray-200" />
          "Şimdi Araştır" butonuna bas veya sayfayı aç — gerekirse otomatik başlar.
        </div>
      )}
    </div>
  );
}
