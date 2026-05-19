import Image from "next/image";
import { Users, Eye, Video, Globe, Calendar } from "lucide-react";
import type { ChannelInfo } from "../types";
import { formatNumber } from "../utils/formatters";

interface Props {
  channel: ChannelInfo;
  cached: boolean;
}

function StatBlock({ icon, label, value, accent }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex-1 flex flex-col gap-1 px-6 py-4 border-r border-stone-200 last:border-r-0">
      <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest ${accent} mb-1`}>
        {icon}
        {label}
      </div>
      <p className="text-3xl font-bold text-stone-900 leading-none">{value}</p>
    </div>
  );
}

export function ChannelOverview({ channel, cached }: Props) {
  const today = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">

      {/* ── Rapor başlığı ──────────────────────────────────────────────── */}
      <div className="flex items-start gap-5 p-6 pb-5">
        {/* Avatar */}
        {channel.thumbnailUrl && (
          <div className="shrink-0">
            <Image
              src={channel.thumbnailUrl}
              alt={channel.title}
              width={88}
              height={88}
              className="rounded-2xl border-2 border-stone-100 shadow-sm"
            />
          </div>
        )}

        {/* Kanal bilgisi */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1">
                Kanal Analiz Raporu
              </p>
              <h2 className="text-2xl font-bold text-stone-900 leading-tight">{channel.title}</h2>
              {channel.customUrl && (
                <p className="text-sm text-rose-500 font-medium mt-0.5">{channel.customUrl}</p>
              )}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {channel.country && (
                  <span className="inline-flex items-center gap-1 text-xs text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                    <Globe className="w-3 h-3" />
                    {channel.country}
                  </span>
                )}
                {cached && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
                    Önbellekten
                  </span>
                )}
              </div>
            </div>

            {/* Tarih */}
            <div className="text-right shrink-0">
              <div className="inline-flex items-center gap-1.5 text-xs text-stone-400">
                <Calendar className="w-3.5 h-3.5" />
                {today}
              </div>
            </div>
          </div>

          {/* Açıklama */}
          {channel.description && (
            <p className="text-sm text-stone-500 mt-3 line-clamp-2 leading-relaxed border-t border-stone-100 pt-3">
              {channel.description}
            </p>
          )}
        </div>
      </div>

      {/* ── Metrik satırı ─────────────────────────────────────────────── */}
      <div className="flex divide-x divide-stone-200 border-t border-stone-200 bg-stone-50/60">
        <StatBlock
          icon={<Users className="w-3 h-3" />}
          label="Abone"
          value={formatNumber(channel.subscriberCount)}
          accent="text-violet-600"
        />
        <StatBlock
          icon={<Eye className="w-3 h-3" />}
          label="Toplam Görüntüleme"
          value={formatNumber(channel.totalViewCount)}
          accent="text-blue-600"
        />
        <StatBlock
          icon={<Video className="w-3 h-3" />}
          label="Toplam Video"
          value={formatNumber(channel.videoCount)}
          accent="text-emerald-600"
        />
      </div>
    </div>
  );
}
