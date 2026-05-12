export interface ResearchTopic {
  query: string;
  category: string;
  maxResults: number;
}

export const RESEARCH_TOPICS: ResearchTopic[] = [
  // Algorithm & Discovery
  { query: "youtube algorithm how it works 2024", category: "algorithm", maxResults: 4 },
  { query: "youtube suggested videos ranking factors", category: "algorithm", maxResults: 4 },

  // Retention
  { query: "youtube audience retention optimization tips", category: "retention", maxResults: 4 },
  { query: "youtube watch time increase strategies", category: "retention", maxResults: 4 },

  // Thumbnail & CTR
  { query: "youtube thumbnail design click through rate", category: "thumbnail", maxResults: 4 },
  { query: "youtube thumbnail best practices 2024", category: "thumbnail", maxResults: 3 },

  // Title & Hook
  { query: "youtube title optimization formula", category: "title", maxResults: 4 },
  { query: "youtube video hook first 30 seconds retention", category: "hook", maxResults: 4 },
  { query: "youtube clickbait titles that work", category: "title", maxResults: 3 },

  // Shorts
  { query: "youtube shorts strategy grow channel", category: "shorts", maxResults: 4 },
  { query: "youtube shorts vs long form content strategy", category: "shorts", maxResults: 3 },

  // Upload & Consistency
  { query: "youtube upload frequency consistency growth", category: "upload", maxResults: 3 },
  { query: "best time to post on youtube", category: "upload", maxResults: 3 },

  // Analytics
  { query: "youtube analytics metrics beginners guide", category: "analytics", maxResults: 4 },
  { query: "youtube studio impressions click through rate", category: "analytics", maxResults: 3 },

  // SEO
  { query: "youtube seo optimization 2024 guide", category: "seo", maxResults: 4 },
  { query: "youtube description tags keywords strategy", category: "seo", maxResults: 3 },

  // Content Strategy
  { query: "youtube content strategy grow channel fast", category: "strategy", maxResults: 4 },
  { query: "youtube niche selection channel growth", category: "strategy", maxResults: 3 },

  // Monetization
  { query: "youtube monetization strategy adsense rpm", category: "monetization", maxResults: 3 },
];

export const TOTAL_ESTIMATED_INGESTS = RESEARCH_TOPICS.reduce(
  (sum, t) => sum + t.maxResults,
  0
);
