import Image from "next/image";
import { ExternalLink, Flame } from "lucide-react";
import type { VideoPerformance } from "../types";
import { formatNumber, formatDuration, formatDate } from "../utils/formatters";

interface Props {
  videos: VideoPerformance[];
}

export function ViralVideos({ videos }: Props) {
  if (videos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Viral Videolar</h3>
        <p className="text-sm text-gray-400">Bu kanalda viral video tespit edilmedi.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-red-500" />
        <h3 className="font-semibold text-gray-900">Viral Videolar</h3>
        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium ml-1">
          {videos.length} video
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.slice(0, 8).map((video) => (
          <a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 p-3 rounded-xl border border-gray-100 hover:border-red-200 hover:bg-red-50/30 transition-all group"
          >
            {video.thumbnailUrl && (
              <div className="relative flex-shrink-0">
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  width={100}
                  height={56}
                  className="rounded-lg object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                  {formatDuration(video.durationSeconds)}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                {video.title}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-xs font-bold text-red-600">
                  {formatNumber(video.viewCount)} görüntüleme
                </span>
                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-semibold">
                  {video.performanceScore}x
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{formatDate(video.publishedAt)}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-red-400 flex-shrink-0 mt-1 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}
