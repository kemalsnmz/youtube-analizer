"use client";

import { ResearchAgentPanel } from "@/features/knowledge-agent/components/ResearchAgentPanel";
import { KnowledgeAdminPanel } from "@/features/knowledge-agent/components/KnowledgeAdminPanel";
import { Shield } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gray-900 rounded-xl">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-400">Knowledge Agent yönetimi — kullanıcılara gösterilmez</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Research Agent */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Otomatik Araştırma
            </h2>
            <ResearchAgentPanel />
          </section>

          {/* Manual + Source Management */}
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Manuel Yönetim
            </h2>
            <KnowledgeAdminPanel />
          </section>
        </div>
      </div>
    </div>
  );
}
