import {
  resolveChannelId,
  fetchChannelDetails,
  fetchChannelVideos,
} from "@/features/competitor-analysis/api/youtubeClient";
import { calculateChannelMetrics } from "@/features/competitor-analysis/analysis/metrics";
import { analyzeTitlePatterns } from "@/features/competitor-analysis/analysis/titleAnalyzer";
import { detectOutliers, getTopOutliers } from "../analysis/outlierDetection";
import { analyzeUploadFrequency } from "../analysis/uploadFrequency";
import { calculateChannelHealth } from "../analysis/channelHealth";
import { generateGrowthDiagnosis } from "../analysis/growthDiagnosis";
import { generateOpportunities } from "../analysis/opportunityEngine";
import { getCachedReport, setCachedReport } from "../utils/cache";
import type { GrowthAnalysisReport, GrowthAnalyzeRequest } from "../types";

export async function analyzeChannelGrowth(
  request: GrowthAnalyzeRequest
): Promise<{ report: GrowthAnalysisReport; cached: boolean }> {
  const { channelUrl, maxVideos = 50 } = request;

  const channelId = await resolveChannelId(channelUrl);

  const cached = getCachedReport(channelId);
  if (cached) return { report: cached, cached: true };

  const [channel, videos] = await Promise.all([
    fetchChannelDetails(channelId),
    fetchChannelVideos(channelId, maxVideos),
  ]);

  const metrics = calculateChannelMetrics(videos);
  const allOutliers = detectOutliers(videos, metrics);
  const topOutliers = getTopOutliers(allOutliers);
  const titlePatterns = analyzeTitlePatterns(videos);
  const uploadFrequency = analyzeUploadFrequency(videos);
  const channelHealth = calculateChannelHealth(metrics, allOutliers, uploadFrequency);
  const growthDiagnosis = generateGrowthDiagnosis(metrics, allOutliers, uploadFrequency, channelHealth);
  const opportunities = generateOpportunities(metrics, allOutliers, titlePatterns, uploadFrequency);

  const report: GrowthAnalysisReport = {
    channel,
    videos,
    metrics,
    topOutliers,
    allOutliers,
    titlePatterns,
    uploadFrequency,
    channelHealth,
    growthDiagnosis,
    opportunities,
    cachedAt: new Date().toISOString(),
  };

  setCachedReport(channelId, report);
  return { report, cached: false };
}
