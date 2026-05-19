"use client";

import { useState, useRef, useEffect } from "react";
import type { GrowthAnalysisReport } from "../types";
import { Bot, Send, Loader2, Lock } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_QUESTIONS = [
  "Kanalım neden büyümüyor?",
  "Bir sonraki videom ne olmalı?",
  "En güçlü başlık formatım hangisi?",
];

interface Props {
  report: GrowthAnalysisReport;
}

function AssistantMessage({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-1.5 text-sm text-gray-800">
      {lines.map((line, i) => {
        // ## Başlık
        if (line.startsWith("## ")) {
          return (
            <p key={i} className="font-bold text-gray-900 text-base mt-3 mb-1 first:mt-0">
              {line.slice(3)}
            </p>
          );
        }
        // ### Alt başlık
        if (line.startsWith("### ")) {
          return (
            <p key={i} className="font-semibold text-purple-700 mt-2 mb-0.5">
              {line.slice(4)}
            </p>
          );
        }
        // **Tanı:** veya **Kanıt:** gibi bold label ile başlayan satır
        if (line.match(/^\*\*[^*]+:\*\*/)) {
          const match = line.match(/^\*\*([^*]+):\*\*(.*)/);
          if (match) {
            return (
              <p key={i} className="leading-relaxed">
                <span className="font-bold text-gray-900">{match[1]}:</span>
                <span>{renderInline(match[2])}</span>
              </p>
            );
          }
        }
        // - bullet ile başlayan satır
        if (line.startsWith("- ")) {
          return (
            <div key={i} className="flex gap-2 leading-relaxed pl-1">
              <span className="text-purple-400 mt-0.5 shrink-0">•</span>
              <span>{renderInline(line.slice(2))}</span>
            </div>
          );
        }
        // 1. 2. numaralı liste
        if (line.match(/^\d+\.\s/)) {
          const match = line.match(/^(\d+)\.\s(.*)/);
          if (match) {
            return (
              <div key={i} className="flex gap-2 leading-relaxed pl-1">
                <span className="text-purple-500 font-semibold shrink-0 min-w-[1.2rem]">{match[1]}.</span>
                <span>{renderInline(match[2])}</span>
              </div>
            );
          }
        }
        // Boş satır
        if (line.trim() === "") {
          return <div key={i} className="h-1" />;
        }
        // Normal paragraf
        return (
          <p key={i} className="leading-relaxed">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-gray-900">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        )
      )}
    </>
  );
}

export function AIStrategistChat({ report }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [noKey, setNoKey] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(question?: string) {
    const q = (question ?? input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/youtube-growth/ask-strategist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, report }),
      });
      const data = await res.json();
      if (data.error?.includes("ANTHROPIC_API_KEY")) {
        setNoKey(true);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "API anahtarı bulunamadı. .env.local dosyasına ANTHROPIC_API_KEY ekleyin." },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.answer ?? data.error ?? "Hata oluştu." },
        ]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Bağlantı hatası." }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 bg-purple-100 rounded-lg">
          <Bot className="w-4 h-4 text-purple-600" />
        </div>
        <h3 className="font-semibold text-gray-900">AI Growth Strategist</h3>
        {noKey && (
          <div className="ml-auto flex items-center gap-1 text-xs text-amber-600">
            <Lock className="w-3 h-3" />
            <span>API anahtarı gerekli</span>
          </div>
        )}
        {!noKey && (
          <span className="ml-auto text-xs text-gray-400">Kanal verilerinizi biliyor</span>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-5 ml-9">Kanalın hakkında veri destekli stratejik cevaplar alın.</p>

      <div className="min-h-[180px] max-h-[520px] overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-gray-400 mb-3">Hızlı soru seç veya kendin yaz:</p>
            <div className="space-y-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl px-4 py-2.5 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "user" ? (
              <div className="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed bg-red-600 text-white">
                {msg.content}
              </div>
            ) : (
              <div className="max-w-[90%] rounded-2xl px-5 py-4 bg-gray-50 border border-gray-100">
                <AssistantMessage content={msg.content} />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Kanalın hakkında bir şey sor..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="p-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 rounded-xl transition-colors"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
