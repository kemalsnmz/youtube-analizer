"use client";

import { useState } from "react";
import Image from "next/image";
import { ExternalLink, ChevronUp, ChevronDown } from "lucide-react";
import type { VideoPerformance } from "../types";
import { formatNumber, formatDuration, formatDate } from "../utils/formatters";

interface Props {
  videos: VideoPerformance[];
}

type SortKey = "viewCount" | "performanceScore" | "publishedAt" | "likeCount";

export function VideoTable({ videos }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("viewCount");
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else { setSortKey(key); setSortAsc(false); }
    setPage(0);
  }

  const sorted = [...videos].sort((a, b) => {
    const diff = (a[sortKey] as number) > (b[sortKey] as number) ? 1 : -1;
    return sortAsc ? diff : -diff;
  });

  const pageVideos = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return null;
    return sortAsc ? <ChevronUp className="w-3 h-3 inline ml-1" /> : <ChevronDown className="w-3 h-3 inline ml-1" />;
  }

  function Th({ k, label }: { k: SortKey; label: string }) {
    return (
      <th
        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide cursor-pointer hover:text-gray-800 select-none"
        onClick={() => toggleSort(k)}
      >
        {label}
        <SortIcon k={k} />
      </th>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Video Tablosu</h3>
        <p className="text-sm text-gray-500 mt-0.5">{videos.length} video — başlığa tıklayıp sıralayabilirsin</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Video</th>
              <Th k="viewCount" label="Görüntüleme" />
              <Th k="likeCount" label="Beğeni" />
              <Th k="performanceScore" label="Perf. Skoru" />
              <Th k="publishedAt" label="Tarih" />
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Süre</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Format</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {pageVideos.map((video) => (
              <tr key={video.id} className={`hover:bg-gray-50 transition-colors ${video.isViral ? "bg-red-50/30" : ""}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 max-w-xs">
                    {video.thumbnailUrl && (
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        width={64}
                        height={36}
                        className="rounded-md object-cover flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 line-clamp-2 text-xs leading-tight">{video.title}</p>
                      {video.isViral && (
                        <span className="inline-block mt-1 text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">Viral</span>
                      )}
                      {video.isShort && (
                        <span className="inline-block mt-1 ml-1 text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-medium">Short</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900">{formatNumber(video.viewCount)}</td>
                <td className="px-4 py-3 text-gray-600">{formatNumber(video.likeCount)}</td>
                <td className="px-4 py-3">
                  <span className={`font-bold ${video.performanceScore >= 3 ? "text-red-600" : video.performanceScore >= 1.5 ? "text-amber-600" : "text-gray-500"}`}>
                    {video.performanceScore}x
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(video.publishedAt)}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{formatDuration(video.durationSeconds)}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{video.format}</span>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Sayfa {page + 1} / {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Önceki
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Sonraki
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
