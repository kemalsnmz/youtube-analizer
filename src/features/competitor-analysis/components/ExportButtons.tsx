"use client";

import { Download } from "lucide-react";
import type { CompetitorReport } from "../types";
import { exportToJson, exportToCsv } from "../exports/exportUtils";

interface Props {
  report: CompetitorReport;
}

export function ExportButtons({ report }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500">Dışa Aktar:</span>
      <button
        onClick={() => exportToCsv(report)}
        className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
      >
        <Download className="w-4 h-4" />
        CSV
      </button>
      <button
        onClick={() => exportToJson(report)}
        className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
      >
        <Download className="w-4 h-4" />
        JSON
      </button>
    </div>
  );
}
