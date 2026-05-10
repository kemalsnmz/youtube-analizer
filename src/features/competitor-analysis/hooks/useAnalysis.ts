"use client";

import { useState } from "react";
import type { CompetitorReport } from "../types";

type Status = "idle" | "loading" | "success" | "error";

export function useAnalysis() {
  const [status, setStatus] = useState<Status>("idle");
  const [report, setReport] = useState<CompetitorReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);

  async function analyze(input: string, maxVideos = 50) {
    setStatus("loading");
    setError(null);
    setReport(null);

    try {
      const res = await fetch("/api/competitor-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, maxVideos }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error ?? "Analiz başarısız");
        setStatus("error");
        return;
      }

      setReport(data.report);
      setCached(data.cached);
      setStatus("success");
    } catch {
      setError("Sunucuya bağlanılamadı");
      setStatus("error");
    }
  }

  return { status, report, error, cached, analyze };
}
