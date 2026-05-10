import type { CompetitorReport } from "../types";
import { resolveChannelId, fetchChannelDetails, fetchChannelVideos } from "./youtubeClient";
import { calculateChannelMetrics, calculateVideoPerformance } from "../analysis/metrics";
import { analyzeTitlePatterns } from "../analysis/titleAnalyzer";
import { aggregateFormats } from "../analysis/contentClassifier";
import { detectOpportunities } from "../analysis/opportunityDetector";
import { getCachedReport, setCachedReport } from "../utils/cache";

export async function analyzeChannel(
  rawInput: string,
  maxVideos = 50
): Promise<{ report: CompetitorReport; cached: boolean }> {
  const channelId = await resolveChannelId(rawInput);

  const cached = getCachedReport(channelId);
  if (cached) return { report: cached, cached: true };

  const [channel, videos] = await Promise.all([
    fetchChannelDetails(channelId),
    fetchChannelVideos(channelId, maxVideos),
  ]);

  const metrics = calculateChannelMetrics(videos);
  const videoPerformance = calculateVideoPerformance(videos, metrics);
  const viralVideos = videoPerformance
    .filter((v) => v.isViral)
    .sort((a, b) => b.viewCount - a.viewCount);
  const titlePatterns = analyzeTitlePatterns(videos);
  const contentFormats = aggregateFormats(videos);
  const opportunities = detectOpportunities(metrics, titlePatterns, viralVideos, contentFormats);

  const report: CompetitorReport = {
    generatedAt: new Date().toISOString(),
    channel,
    metrics,
    videos: videoPerformance.sort((a, b) => b.viewCount - a.viewCount),
    viralVideos,
    titlePatterns,
    contentFormats,
    opportunities,
  };

  setCachedReport(channelId, report);
  return { report, cached: false };
}
