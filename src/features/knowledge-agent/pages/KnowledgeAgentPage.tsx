"use client";

import { KnowledgeAdminPanel } from "../components/KnowledgeAdminPanel";

export function KnowledgeAgentPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Knowledge Agent</h1>
        <p className="text-gray-500 mt-1 text-sm">
          YouTube büyüme kaynakları ekle — AI Strategist bu bilgileri kullanarak daha iyi cevaplar üretir.
        </p>
      </div>
      <KnowledgeAdminPanel />
    </div>
  );
}
