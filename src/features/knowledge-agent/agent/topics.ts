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
  // Algorithm & Discovery
  { query: "youtube algorithm how it works 2025", category: "algorithm", maxResults: 4 },
  { query: "youtube suggested videos ranking factors", category: "algorithm", maxResults: 4 },

  // Retention
  { query: "youtube audience retention optimization tips", category: "retention", maxResults: 4 },
  { query: "youtube watch time increase strategies", category: "retention", maxResults: 4 },

  // Thumbnail & CTR
  { query: "youtube thumbnail design click through rate", category: "thumbnail", maxResults: 4 },
  { query: "youtube thumbnail best practices 2025", category: "thumbnail", maxResults: 3 },

  // Title & Hook
  { query: "youtube title optimization formula", category: "title", maxResults: 4 },
  { query: "youtube video hook first 30 seconds retention", category: "hook", maxResults: 4 },
  { query: "youtube clickbait titles that work", category: "title", maxResults: 3 },

  // Shorts
  { query: "youtube shorts strategy grow channel 2025", category: "shorts", maxResults: 4 },
  { query: "youtube shorts vs long form content strategy", category: "shorts", maxResults: 3 },

  // Upload & Consistency
  { query: "youtube upload frequency consistency growth", category: "upload", maxResults: 3 },
  { query: "best time to post on youtube 2025", category: "upload", maxResults: 3 },

  // Analytics
  { query: "youtube analytics metrics guide 2025", category: "analytics", maxResults: 4 },
  { query: "youtube studio impressions click through rate", category: "analytics", maxResults: 3 },

  // SEO
  { query: "youtube seo optimization 2025 guide", category: "seo", maxResults: 4 },
  { query: "youtube description tags keywords strategy", category: "seo", maxResults: 3 },

  // Content Strategy
  { query: "youtube content strategy grow channel fast", category: "strategy", maxResults: 4 },
  { query: "youtube niche selection channel growth", category: "strategy", maxResults: 3 },

  // Monetization
  { query: "youtube monetization strategy adsense rpm", category: "monetization", maxResults: 3 },

  // Community & Engagement
  { query: "youtube community posts engagement growth", category: "engagement", maxResults: 3 },
  { query: "youtube comments engagement algorithm boost", category: "engagement", maxResults: 3 },
];

// Sabit yüksek kaliteli web makaleleri ve PDF'ler — agent direkt ingest eder
export const STATIC_SOURCES: StaticSource[] = [
  // YouTube resmi kaynaklar
  { url: "https://support.google.com/youtube/answer/9314404", category: "algorithm" },
  { url: "https://support.google.com/youtube/answer/141805", category: "analytics" },
  { url: "https://support.google.com/youtube/answer/72851", category: "seo" },

  // Backlinko
  { url: "https://backlinko.com/youtube-seo", category: "seo" },
  { url: "https://backlinko.com/grow-youtube-channel", category: "strategy" },

  // Neil Patel
  { url: "https://neilpatel.com/blog/youtube-seo/", category: "seo" },
  { url: "https://neilpatel.com/blog/youtube-marketing/", category: "strategy" },

  // Hootsuite & Social Media Examiner
  { url: "https://blog.hootsuite.com/how-to-grow-youtube-channel/", category: "strategy" },
  { url: "https://www.socialmediaexaminer.com/youtube-algorithm/", category: "algorithm" },

  // Think with Google
  { url: "https://www.thinkwithgoogle.com/marketing-strategies/video/youtube-marketing-strategy/", category: "strategy" },
];

export const TOTAL_ESTIMATED_INGESTS =
  RESEARCH_TOPICS.reduce((sum, t) => sum + t.maxResults, 0) + STATIC_SOURCES.length;
