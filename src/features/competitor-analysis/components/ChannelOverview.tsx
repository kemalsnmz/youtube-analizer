import Image from "next/image";
import { Users, Eye, Video, Globe } from "lucide-react";
import type { ChannelInfo } from "../types";
import { formatNumber } from "../utils/formatters";

interface Props {
  channel: ChannelInfo;
  cached: boolean;
}

export function ChannelOverview({ channel, cached }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start gap-5">
        {channel.thumbnailUrl && (
          <Image
            src={channel.thumbnailUrl}
            alt={channel.title}
            width={80}
            height={80}
            className="rounded-full border-2 border-gray-100 flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900 truncate">{channel.title}</h2>
            {cached && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                Önbellekten
              </span>
            )}
            {channel.country && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {channel.country}
              </span>
            )}
          </div>
          {channel.customUrl && (
            <p className="text-sm text-red-500 mt-0.5">{channel.customUrl}</p>
          )}
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{channel.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <StatCard icon={<Users className="w-4 h-4" />} label="Abone" value={formatNumber(channel.subscriberCount)} />
        <StatCard icon={<Eye className="w-4 h-4" />} label="Toplam Görüntüleme" value={formatNumber(channel.totalViewCount)} />
        <StatCard icon={<Video className="w-4 h-4" />} label="Toplam Video" value={formatNumber(channel.videoCount)} />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 text-center">
      <div className="flex justify-center text-red-500 mb-1">{icon}</div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
