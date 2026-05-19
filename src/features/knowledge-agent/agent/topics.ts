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
  // ── Google / YouTube Resmi ─────────────────────────────────────────────────
  { url: "https://support.google.com/youtube/answer/9314404", category: "algorithm" },
  { url: "https://support.google.com/youtube/answer/141805", category: "analytics" },
  { url: "https://support.google.com/youtube/answer/72851", category: "seo" },
  { url: "https://support.google.com/youtube/answer/1714173", category: "monetization" },
  { url: "https://support.google.com/youtube/answer/2797468", category: "analytics" },
  { url: "https://support.google.com/youtube/answer/9607986", category: "algorithm" },
  { url: "https://support.google.com/youtube/answer/6309116", category: "engagement" },

  // ── Backlinko ─────────────────────────────────────────────────────────────
  { url: "https://backlinko.com/youtube-seo", category: "seo" },
  { url: "https://backlinko.com/grow-youtube-channel", category: "strategy" },
  { url: "https://backlinko.com/youtube-ranking-factors", category: "seo" },

  // ── Neil Patel ────────────────────────────────────────────────────────────
  { url: "https://neilpatel.com/blog/youtube-seo/", category: "seo" },
  { url: "https://neilpatel.com/blog/youtube-marketing/", category: "strategy" },
  { url: "https://neilpatel.com/blog/youtube-algorithm/", category: "algorithm" },
  { url: "https://neilpatel.com/blog/grow-youtube-channel/", category: "growth" },
  { url: "https://neilpatel.com/blog/youtube-analytics/", category: "analytics" },

  // ── Hootsuite ─────────────────────────────────────────────────────────────
  { url: "https://blog.hootsuite.com/how-to-grow-youtube-channel/", category: "strategy" },
  { url: "https://blog.hootsuite.com/youtube-analytics/", category: "analytics" },
  { url: "https://blog.hootsuite.com/youtube-algorithm/", category: "algorithm" },
  { url: "https://blog.hootsuite.com/youtube-seo/", category: "seo" },
  { url: "https://blog.hootsuite.com/youtube-marketing/", category: "strategy" },

  // ── Social Media Examiner ─────────────────────────────────────────────────
  { url: "https://www.socialmediaexaminer.com/youtube-algorithm/", category: "algorithm" },
  { url: "https://www.socialmediaexaminer.com/youtube-content-strategy/", category: "strategy" },

  // ── Think with Google ─────────────────────────────────────────────────────
  { url: "https://www.thinkwithgoogle.com/marketing-strategies/video/youtube-marketing-strategy/", category: "strategy" },

  // ── Sprout Social ────────────────────────────────────────────────────────
  { url: "https://sproutsocial.com/insights/youtube-marketing/", category: "strategy" },
  { url: "https://sproutsocial.com/insights/youtube-analytics/", category: "analytics" },
  { url: "https://sproutsocial.com/insights/youtube-seo/", category: "seo" },
  { url: "https://sproutsocial.com/insights/youtube-algorithm/", category: "algorithm" },

  // ── Buffer ───────────────────────────────────────────────────────────────
  { url: "https://buffer.com/resources/youtube-marketing/", category: "strategy" },
  { url: "https://buffer.com/resources/youtube-seo/", category: "seo" },

  // ── VidIQ ────────────────────────────────────────────────────────────────
  { url: "https://vidiq.com/blog/post/how-youtube-algorithm-works/", category: "algorithm" },
  { url: "https://vidiq.com/blog/post/youtube-seo-tips/", category: "seo" },
  { url: "https://vidiq.com/blog/post/get-more-views-on-youtube/", category: "growth" },
  { url: "https://vidiq.com/blog/post/youtube-channel-audit/", category: "audit" },
  { url: "https://vidiq.com/blog/post/youtube-analytics-guide/", category: "analytics" },
  { url: "https://vidiq.com/blog/post/youtube-ctr/", category: "ctr" },
  { url: "https://vidiq.com/blog/post/youtube-thumbnail-tips/", category: "ctr" },

  // ── TubeBuddy ────────────────────────────────────────────────────────────
  { url: "https://www.tubebuddy.com/blog/youtube-seo/", category: "seo" },
  { url: "https://www.tubebuddy.com/blog/youtube-algorithm/", category: "algorithm" },
  { url: "https://www.tubebuddy.com/blog/youtube-analytics/", category: "analytics" },
  { url: "https://www.tubebuddy.com/blog/youtube-thumbnails/", category: "ctr" },

  // ── HubSpot ──────────────────────────────────────────────────────────────
  { url: "https://blog.hubspot.com/marketing/youtube-seo", category: "seo" },
  { url: "https://blog.hubspot.com/marketing/how-to-grow-youtube-channel", category: "growth" },
  { url: "https://blog.hubspot.com/marketing/youtube-analytics", category: "analytics" },

  // ── Semrush / Ahrefs ─────────────────────────────────────────────────────
  { url: "https://www.semrush.com/blog/youtube-seo/", category: "seo" },
  { url: "https://www.semrush.com/blog/youtube-marketing/", category: "strategy" },
  { url: "https://ahrefs.com/blog/youtube-seo/", category: "seo" },

  // ── Influencer Marketing Hub ──────────────────────────────────────────────
  { url: "https://influencermarketinghub.com/grow-youtube-channel/", category: "growth" },
  { url: "https://influencermarketinghub.com/youtube-seo/", category: "seo" },
  { url: "https://influencermarketinghub.com/youtube-analytics/", category: "analytics" },
  { url: "https://influencermarketinghub.com/youtube-algorithm/", category: "algorithm" },
  { url: "https://influencermarketinghub.com/youtube-shorts/", category: "shorts" },

  // ── Later ────────────────────────────────────────────────────────────────
  { url: "https://later.com/blog/youtube-marketing/", category: "strategy" },
  { url: "https://later.com/blog/youtube-algorithm/", category: "algorithm" },

  // ── WordStream ───────────────────────────────────────────────────────────
  { url: "https://www.wordstream.com/blog/ws/youtube-marketing", category: "strategy" },
  { url: "https://www.wordstream.com/blog/ws/youtube-seo", category: "seo" },

  // ── VidIQ (ek) ──────────────────────────────────────────────────────────
  { url: "https://vidiq.com/blog/post/youtube-title-tips/", category: "ctr" },
  { url: "https://vidiq.com/blog/post/youtube-shorts-strategy/", category: "shorts" },
  { url: "https://vidiq.com/blog/post/youtube-keyword-research/", category: "seo" },
  { url: "https://vidiq.com/blog/post/youtube-video-tags/", category: "seo" },
  { url: "https://vidiq.com/blog/post/youtube-end-screens/", category: "engagement" },
  { url: "https://vidiq.com/blog/post/youtube-playlists/", category: "strategy" },
  { url: "https://vidiq.com/blog/post/youtube-monetization/", category: "monetization" },
  { url: "https://vidiq.com/blog/post/how-to-get-more-subscribers/", category: "growth" },
  { url: "https://vidiq.com/blog/post/youtube-views/", category: "growth" },
  { url: "https://vidiq.com/blog/post/youtube-shorts-views/", category: "shorts" },

  // ── TubeBuddy (ek) ──────────────────────────────────────────────────────
  { url: "https://www.tubebuddy.com/blog/youtube-seo-tips/", category: "seo" },
  { url: "https://www.tubebuddy.com/blog/youtube-channel-growth/", category: "growth" },
  { url: "https://www.tubebuddy.com/blog/youtube-shorts/", category: "shorts" },
  { url: "https://www.tubebuddy.com/blog/youtube-keyword-research/", category: "seo" },
  { url: "https://www.tubebuddy.com/blog/youtube-title-optimization/", category: "ctr" },

  // ── Backlinko (ek) ───────────────────────────────────────────────────────
  { url: "https://backlinko.com/youtube-views", category: "growth" },
  { url: "https://backlinko.com/youtube-subscribers", category: "growth" },
  { url: "https://backlinko.com/hub/youtube/youtube-algorithm", category: "algorithm" },
  { url: "https://backlinko.com/hub/youtube/youtube-seo", category: "seo" },

  // ── Neil Patel (ek) ──────────────────────────────────────────────────────
  { url: "https://neilpatel.com/blog/youtube-keyword-research/", category: "seo" },
  { url: "https://neilpatel.com/blog/youtube-thumbnails/", category: "ctr" },
  { url: "https://neilpatel.com/blog/youtube-shorts/", category: "shorts" },
  { url: "https://neilpatel.com/blog/youtube-channel-tips/", category: "strategy" },
  { url: "https://neilpatel.com/blog/video-marketing/", category: "strategy" },

  // ── Hootsuite (ek) ───────────────────────────────────────────────────────
  { url: "https://blog.hootsuite.com/youtube-shorts/", category: "shorts" },
  { url: "https://blog.hootsuite.com/youtube-thumbnails/", category: "ctr" },
  { url: "https://blog.hootsuite.com/youtube-channel-ideas/", category: "strategy" },
  { url: "https://blog.hootsuite.com/youtube-keywords/", category: "seo" },
  { url: "https://blog.hootsuite.com/youtube-stats/", category: "analytics" },
  { url: "https://blog.hootsuite.com/youtube-live/", category: "engagement" },

  // ── HubSpot (ek) ─────────────────────────────────────────────────────────
  { url: "https://blog.hubspot.com/marketing/youtube-channel", category: "strategy" },
  { url: "https://blog.hubspot.com/marketing/youtube-thumbnail", category: "ctr" },
  { url: "https://blog.hubspot.com/marketing/youtube-shorts", category: "shorts" },
  { url: "https://blog.hubspot.com/marketing/youtube-video-ideas", category: "strategy" },
  { url: "https://blog.hubspot.com/marketing/youtube-algorithm", category: "algorithm" },

  // ── Sprout Social (ek) ───────────────────────────────────────────────────
  { url: "https://sproutsocial.com/insights/youtube-shorts/", category: "shorts" },
  { url: "https://sproutsocial.com/insights/youtube-stats/", category: "analytics" },
  { url: "https://sproutsocial.com/insights/youtube-keywords/", category: "seo" },

  // ── Buffer (ek) ──────────────────────────────────────────────────────────
  { url: "https://buffer.com/resources/youtube-algorithm/", category: "algorithm" },
  { url: "https://buffer.com/resources/youtube-analytics/", category: "analytics" },
  { url: "https://buffer.com/resources/youtube-shorts/", category: "shorts" },
  { url: "https://buffer.com/resources/youtube-strategy/", category: "strategy" },

  // ── Semrush (ek) ─────────────────────────────────────────────────────────
  { url: "https://www.semrush.com/blog/youtube-keyword-research/", category: "seo" },
  { url: "https://www.semrush.com/blog/youtube-analytics/", category: "analytics" },
  { url: "https://www.semrush.com/blog/youtube-channel-growth/", category: "growth" },
  { url: "https://www.semrush.com/blog/youtube-shorts/", category: "shorts" },
  { url: "https://www.semrush.com/blog/video-marketing/", category: "strategy" },

  // ── Ahrefs (ek) ──────────────────────────────────────────────────────────
  { url: "https://ahrefs.com/blog/youtube-keyword-research/", category: "seo" },
  { url: "https://ahrefs.com/blog/grow-youtube-channel/", category: "growth" },
  { url: "https://ahrefs.com/blog/video-seo/", category: "seo" },

  // ── Social Media Examiner (ek) ───────────────────────────────────────────
  { url: "https://www.socialmediaexaminer.com/youtube-shorts-strategy/", category: "shorts" },
  { url: "https://www.socialmediaexaminer.com/youtube-seo-tips/", category: "seo" },
  { url: "https://www.socialmediaexaminer.com/youtube-video-strategy/", category: "strategy" },
  { url: "https://www.socialmediaexaminer.com/youtube-analytics-guide/", category: "analytics" },
  { url: "https://www.socialmediaexaminer.com/youtube-channel-strategy/", category: "strategy" },

  // ── Later (ek) ───────────────────────────────────────────────────────────
  { url: "https://later.com/blog/youtube-seo/", category: "seo" },
  { url: "https://later.com/blog/youtube-shorts/", category: "shorts" },
  { url: "https://later.com/blog/youtube-analytics/", category: "analytics" },
  { url: "https://later.com/blog/youtube-thumbnail/", category: "ctr" },

  // ── Influencer Marketing Hub (ek) ────────────────────────────────────────
  { url: "https://influencermarketinghub.com/youtube-thumbnail/", category: "ctr" },
  { url: "https://influencermarketinghub.com/youtube-monetization/", category: "monetization" },
  { url: "https://influencermarketinghub.com/youtube-keyword-research/", category: "seo" },
  { url: "https://influencermarketinghub.com/youtube-live-stream/", category: "engagement" },
  { url: "https://influencermarketinghub.com/youtube-channel-audit/", category: "audit" },

  // ── WordStream (ek) ──────────────────────────────────────────────────────
  { url: "https://www.wordstream.com/blog/ws/youtube-algorithm", category: "algorithm" },
  { url: "https://www.wordstream.com/blog/ws/youtube-analytics", category: "analytics" },
  { url: "https://www.wordstream.com/blog/ws/youtube-advertising", category: "monetization" },

  // ── Wyzowl ───────────────────────────────────────────────────────────────
  { url: "https://www.wyzowl.com/youtube-marketing/", category: "strategy" },
  { url: "https://www.wyzowl.com/video-marketing-statistics/", category: "analytics" },
  { url: "https://www.wyzowl.com/youtube-video-marketing-statistics/", category: "analytics" },

  // ── CoSchedule ───────────────────────────────────────────────────────────
  { url: "https://coschedule.com/blog/youtube-marketing/", category: "strategy" },
  { url: "https://coschedule.com/blog/youtube-seo/", category: "seo" },
  { url: "https://coschedule.com/blog/youtube-algorithm/", category: "algorithm" },

  // ── Social Media Today ────────────────────────────────────────────────────
  { url: "https://www.socialmediatoday.com/marketing/youtube-algorithm/", category: "algorithm" },
  { url: "https://www.socialmediatoday.com/marketing/youtube-seo/", category: "seo" },

  // ── Convince & Convert ────────────────────────────────────────────────────
  { url: "https://www.convinceandconvert.com/social-media-strategy/youtube-strategy/", category: "strategy" },
  { url: "https://www.convinceandconvert.com/content-marketing/youtube-content-marketing/", category: "strategy" },

  // ── Content Marketing Institute ───────────────────────────────────────────
  { url: "https://contentmarketinginstitute.com/articles/youtube-content-strategy/", category: "strategy" },
  { url: "https://contentmarketinginstitute.com/articles/video-content-marketing/", category: "strategy" },

  // ── Shopify Blog ─────────────────────────────────────────────────────────
  { url: "https://www.shopify.com/blog/youtube-marketing", category: "strategy" },

  // ── Vidyard ──────────────────────────────────────────────────────────────
  { url: "https://www.vidyard.com/blog/youtube-marketing/", category: "strategy" },
  { url: "https://www.vidyard.com/blog/video-seo/", category: "seo" },

  // ── Lemonlight ───────────────────────────────────────────────────────────
  { url: "https://www.lemonlight.com/blog/youtube-marketing-guide/", category: "strategy" },
  { url: "https://www.lemonlight.com/blog/youtube-seo/", category: "seo" },

  // ── Animoto ──────────────────────────────────────────────────────────────
  { url: "https://animoto.com/blog/business/youtube-marketing-guide/", category: "strategy" },
  { url: "https://animoto.com/blog/business/youtube-seo/", category: "seo" },

  // ── Tubics ───────────────────────────────────────────────────────────────
  { url: "https://www.tubics.com/blog/youtube-seo-guide/", category: "seo" },
  { url: "https://www.tubics.com/blog/youtube-ranking-factors/", category: "seo" },
  { url: "https://www.tubics.com/blog/youtube-tags/", category: "seo" },

  // ── Renderforest ─────────────────────────────────────────────────────────
  { url: "https://www.renderforest.com/blog/youtube-marketing", category: "strategy" },
  { url: "https://www.renderforest.com/blog/youtube-seo", category: "seo" },

  // ── Venngage ─────────────────────────────────────────────────────────────
  { url: "https://venngage.com/blog/youtube-marketing/", category: "strategy" },
  { url: "https://venngage.com/blog/youtube-thumbnail/", category: "ctr" },

  // ── Descript ─────────────────────────────────────────────────────────────
  { url: "https://www.descript.com/blog/article/youtube-seo", category: "seo" },
  { url: "https://www.descript.com/blog/article/how-to-grow-youtube-channel", category: "growth" },
  { url: "https://www.descript.com/blog/article/youtube-algorithm", category: "algorithm" },

  // ── Riverside.fm ─────────────────────────────────────────────────────────
  { url: "https://riverside.fm/blog/youtube-seo", category: "seo" },
  { url: "https://riverside.fm/blog/youtube-algorithm", category: "algorithm" },
  { url: "https://riverside.fm/blog/how-to-grow-on-youtube", category: "growth" },

  // ── Epidemic Sound Blog ───────────────────────────────────────────────────
  { url: "https://www.epidemicsound.com/blog/youtube-seo/", category: "seo" },
  { url: "https://www.epidemicsound.com/blog/how-to-grow-your-youtube-channel/", category: "growth" },

  // ── YouTube Resmi Destek (ek) ─────────────────────────────────────────────
  { url: "https://support.google.com/youtube/answer/9405894", category: "algorithm" },
  { url: "https://support.google.com/youtube/answer/157177", category: "seo" },
  { url: "https://support.google.com/youtube/answer/3220160", category: "analytics" },
  { url: "https://support.google.com/youtube/answer/6162060", category: "monetization" },
  { url: "https://support.google.com/youtube/answer/7675353", category: "shorts" },

  // ── Google Developers — YouTube Analytics & Reporting ─────────────────────
  { url: "https://developers.google.com/youtube/analytics?hl=tr", category: "analytics" },
  { url: "https://developers.google.com/youtube/analytics/channel_reports?hl=tr", category: "analytics" },
  { url: "https://developers.google.com/youtube/analytics/video_reports?hl=tr", category: "analytics" },
  { url: "https://developers.google.com/youtube/analytics/audience_retention?hl=tr", category: "retention" },
  { url: "https://developers.google.com/youtube/analytics/metrics?hl=tr", category: "analytics" },
  { url: "https://developers.google.com/youtube/analytics/dimensions?hl=tr", category: "analytics" },
  { url: "https://developers.google.com/youtube/reporting/v1/reports/channel_reports?hl=tr", category: "analytics" },
  { url: "https://developers.google.com/youtube/v3/docs/videos/list?hl=tr", category: "analytics" },
  { url: "https://developers.google.com/youtube/v3/guides/quota_usage?hl=tr", category: "analytics" },
  { url: "https://developers.google.com/youtube/v3/getting-started?hl=tr", category: "analytics" },
];

export const TOTAL_ESTIMATED_INGESTS =
  RESEARCH_TOPICS.reduce((sum, t) => sum + t.maxResults, 0) + STATIC_SOURCES.length;
