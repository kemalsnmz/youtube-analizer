"use client";

import { useState } from "react";
import type { GrowthAnalysisReport, GrowthAnalyzeRequest } from "../types";

type Status = "idle" | "loading" | "success" | "error";

export function useGrowthAnalysis() {
  const [status, setStatus] = useState<Status>("idle");
  const [report, setReport] = useState<GrowthAnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);

  async function analyze(request: GrowthAnalyzeRequest) {
    setStatus("loading");
    setError(null);
    setReport(null);
    try {
      const res = await fetch("/api/youtube-growth/analyze-channel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? "Analiz başarısız.");
        setStatus("error");
      } else {
        setReport(data.report);
        setCached(data.cached);
        setStatus("success");
      }
    } catch {
      setError("Bağlantı hatası. Lütfen tekrar dene.");
      setStatus("error");
    }
  }

  function loadReport(r: GrowthAnalysisReport) {
    setReport(r);
    setCached(true);
    setStatus("success");
    setError(null);
  }

  return { status, report, error, cached, analyze, loadReport };
}
