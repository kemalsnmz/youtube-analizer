"use client";

import { useState } from "react";
import { TrendingUp, Users, BarChart3, Brain, Zap, Sparkles } from "lucide-react";
import { useGrowthAnalysis } from "@/features/youtube-growth/hooks/useGrowthAnalysis";
import { SearchForm } from "@/features/competitor-analysis/components/SearchForm";
import { YouTubeGrowthPage } from "@/features/youtube-growth/pages/YouTubeGrowthPage";
import { CompetitorAnalysisPage } from "@/features/competitor-analysis/pages/CompetitorAnalysisPage";

type Tab = "growth" | "competitor";

const FEATURES = [
  { icon: BarChart3, label: "Outlier Tespiti" },
  { icon: Brain,    label: "AI Stratejist" },
  { icon: Zap,      label: "Büyüme Planı" },
  { icon: Sparkles, label: "Video Fikirleri" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("growth");
  const { status, report, error, cached, analyze, loadReport } = useGrowthAnalysis();

  const isGrowth = activeTab === "growth";

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900" />
        <div className="absolute top-[-80px] left-[-80px] w-[400px] h-[400px] rounded-full bg-violet-600/20 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[-40px] right-[-60px] w-[320px] h-[320px] rounded-full bg-orange-500/15 blur-[100px] animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 pt-10 pb-24">
          {/* Tagline */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight mb-2">
              Kanalını büyüt,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-orange-400">
                veriyle.
              </span>
            </h1>
            <p className="text-slate-400 text-sm">
              Outlier videolarını bul, büyüme engellerini teşhis et, yapay zeka ile strateji üret.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-medium backdrop-blur-sm"
              >
                <Icon className="w-3.5 h-3.5 text-violet-400" />
                {label}
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-2xl p-1 w-fit backdrop-blur-sm">
            {(["growth", "competitor"] as Tab[]).map((tab) => {
              const active = activeTab === tab;
              const Icon  = tab === "growth" ? TrendingUp : Users;
              const label = tab === "growth" ? "Kanal Büyütme" : "Rakip Analizi";
              const desc  = tab === "growth" ? "Teşhis, outlier, AI plan" : "Rakibi analiz et";
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-200 text-left ${
                    active
                      ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-500/25"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-semibold leading-tight">{label}</div>
                    <div className={`text-xs leading-tight mt-0.5 ${active ? "text-violet-200" : "text-slate-500"}`}>
                      {desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Search card (overlapping) — only for growth tab ─────────────── */}
      {isGrowth && (
        <div className="max-w-3xl mx-auto px-6 -mt-14 relative z-10 mb-8">
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-gray-100 p-6">
            <SearchForm
              onAnalyze={(input, maxVideos) => analyze({ channelUrl: input, maxVideos })}
              loading={status === "loading"}
            />
          </div>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {isGrowth ? (
          <YouTubeGrowthPage
            status={status}
            report={report}
            error={error}
            cached={cached}
            loadReport={loadReport}
          />
        ) : (
          <CompetitorAnalysisPage />
        )}
      </div>
    </div>
  );
}
