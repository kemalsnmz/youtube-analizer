"use client";

import Image from "next/image";
import type { OutlierVideo } from "../types";

const LEVEL_STYLES: Record<string, { badge: string; label: string }> = {
  ViralOutlier:   { badge: "bg-red-500 text-white",    label: "Viral" },
  StrongOutlier:  { badge: "bg-orange-500 text-white",  label: "Güçlü Outlier" },
  Outlier:        { badge: "bg-yellow-400 text-black",  label: "Outlier" },
  AboveAverage:   { badge: "bg-blue-500 text-white",    label: "Ortalamanın Üstü" },
};

interface Props {
  outliers: OutlierVideo[];
}

export function OutlierVideosGrid({ outliers }: Props) {
  const notable = outliers.filter((o) => o.outlierLevel !== "Normal").slice(0, 6);
  if (notable.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Outlier Videolar</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notable.map((o) => {
          const style = LEVEL_STYLES[o.outlierLevel];
          return (
            <a
              key={o.video.id}
              href={`https://www.youtube.com/watch?v=${o.video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <div className="relative aspect-video bg-gray-100">
                {o.video.thumbnailUrl && (
                  <Image
                    src={o.video.thumbnailUrl}
                    alt={o.video.title}
                    fill
                    className="object-cover"
                  />
                )}
                <span
                  className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${style.badge}`}
                >
                  {style.label}
                </span>
              </div>
              <div className="p-3 bg-white">
                <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">{o.video.title}</p>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{o.video.viewCount.toLocaleString("tr-TR")} izlenme</span>
                  <span className="font-semibold text-red-500">{o.outlierScore.toFixed(1)}x medyan</span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
