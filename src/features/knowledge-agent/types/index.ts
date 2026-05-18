export type SourceType = "youtube" | "article" | "pdf" | "manual";
export type ProcessingStatus = "pending" | "processing" | "ready" | "error";

export interface KnowledgeChunk {
  id: string;
  sourceId: string;
  text: string;
  index: number;
  embedding: number[];
}

export interface KnowledgeSource {
  id: string;
  url: string;
  sourceType: SourceType;
  title: string;
  rawText: string;
  summary: string;
  tags: string[];
  chunks: KnowledgeChunk[];
  status: ProcessingStatus;
  errorMessage?: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeSourcePreview {
  id: string;
  url: string;
  sourceType: SourceType;
  title: string;
  summary: string;
  tags: string[];
  status: ProcessingStatus;
  errorMessage?: string;
  wordCount: number;
  chunkCount: number;
  rawText: string;
  createdAt: string;
  updatedAt: string;
}

export interface IngestRequest {
  url: string;
  sourceType?: SourceType;
}

export interface IngestResponse {
  source: KnowledgeSource;
  cached: boolean;
}

export interface SearchQuery {
  query: string;
  limit?: number;
  minScore?: number;
}

export interface SearchResult {
  chunk: KnowledgeChunk;
  source: KnowledgeSourcePreview;
  score: number;
}

export interface KnowledgeStore {
  sources: KnowledgeSource[];
  updatedAt: string;
  lastResearchAt: string | null;
}

export interface ResearchStatus {
  sourceCount: number;
  isEmpty: boolean;
  isStale: boolean;
  lastResearchAt: string | null;
  daysSinceLast: number | null;
  staleThresholdDays: number;
  shouldAutoTrigger: boolean;
}
