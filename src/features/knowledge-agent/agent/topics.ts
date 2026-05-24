export interface ResearchTopic {
  query: string;
  category: string;
  maxResults: number;
}

export interface StaticSource {
  url: string;
  category: string;
}

export const RESEARCH_TOPICS: ResearchTopic[] = [

  // ── Kanal Teşhisi & Audit ──────────────────────────────────────────────────
  { query: "youtube channel audit diagnose problems step by step", category: "audit", maxResults: 4 },
  { query: "youtube channel not growing reasons fix 2025", category: "audit", maxResults: 4 },
  { query: "youtube channel stuck plateau breakthrough strategy", category: "audit", maxResults: 4 },
  { query: "youtube channel health check metrics checklist", category: "audit", maxResults: 3 },
  { query: "youtube channel critique professional review", category: "audit", maxResults: 3 },
  { query: "youtube channel turnaround revival case study", category: "audit", maxResults: 3 },
  { query: "how to identify root cause youtube channel failure", category: "audit", maxResults: 3 },

  // ── CTR & Thumbnail ───────────────────────────────────────────────────────
  { query: "youtube low CTR diagnosis how to fix", category: "ctr", maxResults: 4 },
  { query: "youtube CTR benchmark by niche good bad average", category: "ctr", maxResults: 4 },
  { query: "youtube thumbnail psychology what makes people click", category: "ctr", maxResults: 4 },
  { query: "youtube thumbnail ab testing split test results", category: "ctr", maxResults: 3 },
  { query: "youtube thumbnail design principles high CTR", category: "ctr", maxResults: 3 },
  { query: "youtube title formula curiosity gap click", category: "ctr", maxResults: 3 },
  { query: "youtube title vs thumbnail which matters more CTR", category: "ctr", maxResults: 3 },

  // ── Retention & Watch Time ────────────────────────────────────────────────
  { query: "youtube audience retention drop off analysis fix", category: "retention", maxResults: 4 },
  { query: "youtube first 30 seconds hook retention techniques", category: "retention", maxResults: 4 },
  { query: "youtube average view duration benchmark by niche", category: "retention", maxResults: 3 },
  { query: "youtube video pacing editing techniques retention", category: "retention", maxResults: 3 },
  { query: "youtube pattern interrupt technique keep watching", category: "retention", maxResults: 3 },
  { query: "youtube open loop storytelling retention strategy", category: "retention", maxResults: 3 },
  { query: "youtube rewatch replayability content strategy", category: "retention", maxResults: 3 },

  // ── Algoritma & Dağıtım ───────────────────────────────────────────────────
  { query: "youtube algorithm not pushing my videos fix", category: "algorithm", maxResults: 4 },
  { query: "youtube search suggested browse traffic sources explained", category: "algorithm", maxResults: 4 },
  { query: "youtube impressions low why how to fix", category: "algorithm", maxResults: 4 },
  { query: "youtube video goes viral algorithm signals factors", category: "algorithm", maxResults: 4 },
  { query: "youtube homepage recommendation signals 2025", category: "algorithm", maxResults: 3 },
  { query: "youtube new video no views diagnosis", category: "algorithm", maxResults: 3 },
  { query: "youtube click through rate watch time algorithm relationship", category: "algorithm", maxResults: 3 },
  { query: "youtube session time impact recommendations", category: "algorithm", maxResults: 3 },

  // ── SEO & Keşfedilebilirlik ───────────────────────────────────────────────
  { query: "youtube SEO audit improve channel ranking 2025", category: "seo", maxResults: 4 },
  { query: "youtube keyword research tutorial find what people search", category: "seo", maxResults: 3 },
  { query: "youtube description optimization SEO best practices", category: "seo", maxResults: 3 },
  { query: "youtube tags relevance ranking factor 2025", category: "seo", maxResults: 3 },
  { query: "youtube chapter timestamps chapters SEO benefit", category: "seo", maxResults: 3 },
  { query: "youtube search ranking factors complete guide", category: "seo", maxResults: 3 },

  // ── İçerik Strateji ───────────────────────────────────────────────────────
  { query: "youtube content strategy improve plan professional", category: "strategy", maxResults: 4 },
  { query: "youtube content gap analysis beat competitors", category: "strategy", maxResults: 4 },
  { query: "youtube evergreen vs trending content balance strategy", category: "strategy", maxResults: 3 },
  { query: "youtube niche authority building content pillars", category: "strategy", maxResults: 3 },
  { query: "youtube pillar content series playlist strategy watch time", category: "strategy", maxResults: 3 },
  { query: "youtube topic ideation research what audience wants", category: "strategy", maxResults: 3 },
  { query: "youtube content calendar batch filming system", category: "strategy", maxResults: 3 },

  // ── Rakip Analizi ─────────────────────────────────────────────────────────
  { query: "youtube competitor analysis framework how to", category: "competitor", maxResults: 4 },
  { query: "youtube analyze competitor best performing videos pattern", category: "competitor", maxResults: 4 },
  { query: "youtube find content gaps underserved topics", category: "competitor", maxResults: 3 },
  { query: "youtube reverse engineer viral competitor video", category: "competitor", maxResults: 3 },

  // ── Büyüme Planı & Vaka Çalışmaları ──────────────────────────────────────
  { query: "youtube channel growth 0 to 100k case study", category: "growth", maxResults: 4 },
  { query: "youtube channel transformation success story breakdown", category: "growth", maxResults: 4 },
  { query: "youtube first 1000 subscribers actionable step by step", category: "growth", maxResults: 3 },
  { query: "youtube 10k to 100k subscribers strategy", category: "growth", maxResults: 3 },
  { query: "youtube growth plan template small channel", category: "growth", maxResults: 3 },
  { query: "youtube underrated growth tactics small channels", category: "growth", maxResults: 3 },

  // ── Analitik & Veri Okuma ─────────────────────────────────────────────────
  { query: "youtube analytics deep dive expert guide 2025", category: "analytics", maxResults: 4 },
  { query: "youtube studio analytics read interpret data", category: "analytics", maxResults: 3 },
  { query: "youtube traffic source analysis optimize strategy", category: "analytics", maxResults: 3 },
  { query: "youtube subscriber conversion rate benchmark optimize", category: "analytics", maxResults: 3 },
  { query: "youtube revenue per mille RPM optimize niche", category: "analytics", maxResults: 3 },

  // ── Abone Psikolojisi & Engagement ───────────────────────────────────────
  { query: "youtube subscribe psychology why people subscribe", category: "engagement", maxResults: 3 },
  { query: "youtube comment engagement boost algorithm", category: "engagement", maxResults: 3 },
  { query: "youtube community building loyal audience strategy", category: "engagement", maxResults: 3 },
  { query: "youtube end screen cards click rate optimization", category: "engagement", maxResults: 3 },

  // ── Shorts Stratejisi ─────────────────────────────────────────────────────
  { query: "youtube shorts funnel subscribers to long form", category: "shorts", maxResults: 3 },
  { query: "youtube shorts vs long form channel strategy 2025", category: "shorts", maxResults: 3 },
  { query: "youtube shorts algorithm maximize views 2025", category: "shorts", maxResults: 3 },

  // ── Monetizasyon ──────────────────────────────────────────────────────────
  { query: "youtube monetization optimize RPM CPM high value", category: "monetization", maxResults: 3 },
  { query: "youtube high RPM niche content strategy", category: "monetization", maxResults: 3 },
  { query: "youtube brand deal sponsorship pitch strategy", category: "monetization", maxResults: 3 },

  // ── Üretim & Format ───────────────────────────────────────────────────────
  { query: "youtube optimal video length by niche data 2025", category: "production", maxResults: 3 },
  { query: "youtube intro optimization stop viewers leaving", category: "production", maxResults: 3 },
  { query: "youtube storytelling framework structure script", category: "production", maxResults: 3 },
  { query: "youtube emotional connection audience retention", category: "production", maxResults: 3 },
];

export const STATIC_SOURCES: StaticSource[] = [
  // ── YouTube Resmi ─────────────────────────────────────────────────────────
  { url: "https://support.google.com/youtube/answer/141805", category: "analytics" },
  { url: "https://support.google.com/youtube/answer/72851", category: "seo" },
  { url: "https://support.google.com/youtube/answer/2797468", category: "analytics" },
  { url: "https://support.google.com/youtube/answer/157177", category: "seo" },

  // ── Backlinko ─────────────────────────────────────────────────────────────
  { url: "https://backlinko.com/grow-youtube-channel", category: "strategy" },
  { url: "https://backlinko.com/youtube-ranking-factors", category: "seo" },

  // ── Hootsuite ─────────────────────────────────────────────────────────────
  { url: "https://blog.hootsuite.com/youtube-analytics/", category: "analytics" },
  { url: "https://blog.hootsuite.com/youtube-algorithm/", category: "algorithm" },
  { url: "https://blog.hootsuite.com/youtube-seo/", category: "seo" },
  { url: "https://blog.hootsuite.com/youtube-marketing/", category: "strategy" },
  { url: "https://blog.hootsuite.com/youtube-shorts/", category: "shorts" },
  { url: "https://blog.hootsuite.com/youtube-live/", category: "engagement" },

  // ── Sprout Social ────────────────────────────────────────────────────────
  { url: "https://sproutsocial.com/insights/youtube-marketing/", category: "strategy" },
  { url: "https://sproutsocial.com/insights/youtube-analytics/", category: "analytics" },
  { url: "https://sproutsocial.com/insights/youtube-seo/", category: "seo" },
  { url: "https://sproutsocial.com/insights/youtube-algorithm/", category: "algorithm" },
  { url: "https://sproutsocial.com/insights/youtube-shorts/", category: "shorts" },
  { url: "https://sproutsocial.com/insights/youtube-stats/", category: "analytics" },

  // ── Buffer ───────────────────────────────────────────────────────────────
  { url: "https://buffer.com/resources/youtube-seo/", category: "seo" },

  // ── VidIQ ────────────────────────────────────────────────────────────────
  { url: "https://vidiq.com/blog/post/youtube-channel-audit/", category: "audit" },
  { url: "https://vidiq.com/blog/post/youtube-thumbnail-tips/", category: "ctr" },
  { url: "https://vidiq.com/blog/post/youtube-keyword-research/", category: "seo" },
  { url: "https://vidiq.com/blog/post/youtube-end-screens/", category: "engagement" },
  { url: "https://vidiq.com/blog/post/youtube-playlists/", category: "strategy" },

  // ── TubeBuddy ────────────────────────────────────────────────────────────
  { url: "https://www.tubebuddy.com/blog/youtube-seo/", category: "seo" },
  { url: "https://www.tubebuddy.com/blog/youtube-algorithm/", category: "algorithm" },
  { url: "https://www.tubebuddy.com/blog/youtube-analytics/", category: "analytics" },
  { url: "https://www.tubebuddy.com/blog/youtube-thumbnails/", category: "ctr" },
  { url: "https://www.tubebuddy.com/blog/youtube-seo-tips/", category: "seo" },
  { url: "https://www.tubebuddy.com/blog/youtube-channel-growth/", category: "growth" },
  { url: "https://www.tubebuddy.com/blog/youtube-shorts/", category: "shorts" },
  { url: "https://www.tubebuddy.com/blog/youtube-keyword-research/", category: "seo" },
  { url: "https://www.tubebuddy.com/blog/youtube-title-optimization/", category: "ctr" },

  // ── HubSpot ──────────────────────────────────────────────────────────────
  { url: "https://blog.hubspot.com/marketing/youtube-seo", category: "seo" },
  { url: "https://blog.hubspot.com/marketing/youtube-analytics", category: "analytics" },
  { url: "https://blog.hubspot.com/marketing/youtube-shorts", category: "shorts" },
  { url: "https://blog.hubspot.com/marketing/youtube-algorithm", category: "algorithm" },

  // ── Semrush ──────────────────────────────────────────────────────────────
  { url: "https://www.semrush.com/blog/youtube-seo/", category: "seo" },
  { url: "https://www.semrush.com/blog/youtube-marketing/", category: "strategy" },
  { url: "https://www.semrush.com/blog/video-marketing/", category: "strategy" },

  // ── Ahrefs ───────────────────────────────────────────────────────────────
  { url: "https://ahrefs.com/blog/youtube-seo/", category: "seo" },
  { url: "https://ahrefs.com/blog/youtube-keyword-research/", category: "seo" },
  { url: "https://ahrefs.com/blog/video-seo/", category: "seo" },

  // ── Influencer Marketing Hub ──────────────────────────────────────────────
  { url: "https://influencermarketinghub.com/youtube-seo/", category: "seo" },
  { url: "https://influencermarketinghub.com/youtube-analytics/", category: "analytics" },
  { url: "https://influencermarketinghub.com/youtube-shorts/", category: "shorts" },
  { url: "https://influencermarketinghub.com/youtube-thumbnail/", category: "ctr" },
  { url: "https://influencermarketinghub.com/youtube-monetization/", category: "monetization" },

  // ── Later ────────────────────────────────────────────────────────────────
  { url: "https://later.com/blog/youtube-marketing/", category: "strategy" },
  { url: "https://later.com/blog/youtube-shorts/", category: "shorts" },

  // ── WordStream ───────────────────────────────────────────────────────────
  { url: "https://www.wordstream.com/blog/ws/youtube-marketing", category: "strategy" },
  { url: "https://www.wordstream.com/blog/ws/youtube-seo", category: "seo" },
  { url: "https://www.wordstream.com/blog/ws/youtube-advertising", category: "monetization" },

  // ── Social Media Examiner ─────────────────────────────────────────────────
  { url: "https://www.socialmediaexaminer.com/youtube-content-strategy/", category: "strategy" },
  { url: "https://www.socialmediaexaminer.com/youtube-video-strategy/", category: "strategy" },

  // ── Think with Google ─────────────────────────────────────────────────────
  { url: "https://www.thinkwithgoogle.com/marketing-strategies/video/youtube-marketing-strategy/", category: "strategy" },

  // ── Wyzowl ───────────────────────────────────────────────────────────────
  { url: "https://www.wyzowl.com/youtube-marketing/", category: "strategy" },
  { url: "https://www.wyzowl.com/video-marketing-statistics/", category: "analytics" },

  // ── Shopify ──────────────────────────────────────────────────────────────
  { url: "https://www.shopify.com/blog/youtube-marketing", category: "strategy" },

  // ── Descript ─────────────────────────────────────────────────────────────
  { url: "https://www.descript.com/blog/article/youtube-seo", category: "seo" },

  // ── Content Marketing Institute ───────────────────────────────────────────
  { url: "https://contentmarketinginstitute.com/articles/youtube-content-strategy/", category: "strategy" },
  { url: "https://contentmarketinginstitute.com/articles/video-content-marketing/", category: "strategy" },

  // ── Google Developers ────────────────────────────────────────────────────
  { url: "https://developers.google.com/youtube/analytics?hl=tr", category: "analytics" },
  { url: "https://developers.google.com/youtube/analytics/channel_reports?hl=tr", category: "analytics" },
  { url: "https://developers.google.com/youtube/analytics/audience_retention?hl=tr", category: "retention" },
  { url: "https://developers.google.com/youtube/v3/getting-started?hl=tr", category: "analytics" },
];

export const TOTAL_ESTIMATED_INGESTS =
  RESEARCH_TOPICS.reduce((sum, t) => sum + t.maxResults, 0) + STATIC_SOURCES.length;
