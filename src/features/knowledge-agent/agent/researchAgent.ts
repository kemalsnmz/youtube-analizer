import { RESEARCH_TOPICS } from "./topics";
import {
  TOOL_DEFINITIONS,
  executeSearchYoutube,
  executeIngestUrl,
  type ToolName,
} from "./agentTools";

// ─── Event Types (streamed to client) ─────────────────────────────────────────

export type AgentEvent =
  | { type: "start"; totalTopics: number }
  | { type: "thinking"; text: string }
  | { type: "search"; query: string }
  | { type: "results"; count: number; items: { title: string; url: string }[] }
  | { type: "ingest"; url: string; title: string; status: "ok" | "cached" | "error"; error?: string }
  | { type: "done"; summary: string; stats: ResearchStats }
  | { type: "error"; message: string };

export interface ResearchStats {
  ingested: number;
  cached: number;
  errors: number;
  toolCalls: number;
}

export type EmitFn = (event: AgentEvent) => void;

// ─── Anthropic API Types ───────────────────────────────────────────────────────

interface TextBlock {
  type: "text";
  text: string;
}

interface ToolUseBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
}

interface ToolResultBlock {
  type: "tool_result";
  tool_use_id: string;
  content: string;
}

type ContentBlock = TextBlock | ToolUseBlock;

interface AnthropicMessage {
  role: "user" | "assistant";
  content: string | ContentBlock[] | ToolResultBlock[];
}

interface AnthropicResponse {
  stop_reason: "end_turn" | "tool_use" | "max_tokens" | "stop_sequence";
  content: ContentBlock[];
}

// ─── Agent Runner ──────────────────────────────────────────────────────────────

const MAX_TOOL_CALLS = 60;

export async function runResearchAgent(emit: EmitFn): Promise<void> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    emit({ type: "error", message: "ANTHROPIC_API_KEY ortam değişkeni eksik." });
    return;
  }

  emit({ type: "start", totalTopics: RESEARCH_TOPICS.length });

  const stats: ResearchStats = { ingested: 0, cached: 0, errors: 0, toolCalls: 0 };

  const topicList = RESEARCH_TOPICS.map(
    (t, i) => `${i + 1}. [${t.category}] "${t.query}" (max ${t.maxResults} video)`
  ).join("\n");

  const systemPrompt = `Sen bir YouTube büyüme araştırma agentısın. Görevin YouTube kanal büyüme stratejileri hakkında kapsamlı bir bilgi kütüphanesi oluşturmak.

Adımlar:
1. Her konu için search_youtube ile video ara
2. Arama sonuçlarından konuyla gerçekten alakalı olanları ingest_url ile ekle
3. Alakasız, çok genel veya reklamsal içerikleri atlat
4. Tüm konuları bitirince finish_research çağır

Araştırılacak konular:
${topicList}

Kurallar:
- Her konuda en fazla ${RESEARCH_TOPICS[0].maxResults} video ingest et
- Eğitici ve veri destekli içerikleri tercih et
- "how to" ve rehber formatındaki videoları öncelikle al
- Toplam ${MAX_TOOL_CALLS} araç çağrısı limiti var, verimli çalış`;

  const messages: AnthropicMessage[] = [
    {
      role: "user",
      content: "Araştırmayı başlat. Tüm konuları kapsa.",
    },
  ];

  while (stats.toolCalls < MAX_TOOL_CALLS) {
    const response = await callAnthropic(apiKey, systemPrompt, messages);

    // Emit any text blocks (Claude's thinking)
    for (const block of response.content) {
      if (block.type === "text" && block.text.trim()) {
        emit({ type: "thinking", text: block.text.trim().slice(0, 200) });
      }
    }

    if (response.stop_reason === "end_turn") break;
    if (response.stop_reason !== "tool_use") break;

    // Collect tool use blocks
    const toolBlocks = response.content.filter(
      (b): b is ToolUseBlock => b.type === "tool_use"
    );

    if (toolBlocks.length === 0) break;

    // Add assistant turn
    messages.push({ role: "assistant", content: response.content });

    // Execute tools and collect results
    const toolResults: ToolResultBlock[] = [];
    let finished = false;

    for (const tool of toolBlocks) {
      stats.toolCalls++;
      const toolName = tool.name as ToolName;
      let result = "";

      if (toolName === "search_youtube") {
        const query = String(tool.input.query ?? "");
        const maxResults = Number(tool.input.max_results ?? 4);
        emit({ type: "search", query });

        result = await executeSearchYoutube(query, maxResults);

        try {
          const parsed = JSON.parse(result) as {
            results?: { title: string; url: string }[];
            count?: number;
          };
          if (parsed.results) {
            emit({
              type: "results",
              count: parsed.count ?? parsed.results.length,
              items: parsed.results.map((r) => ({ title: r.title, url: r.url })),
            });
          }
        } catch {
          // ignore parse error
        }
      } else if (toolName === "ingest_url") {
        const url = String(tool.input.url ?? "");
        result = await executeIngestUrl(url);

        try {
          const parsed = JSON.parse(result) as {
            success: boolean;
            title?: string;
            cached?: boolean;
            error?: string;
          };
          if (parsed.success) {
            const status = parsed.cached ? "cached" : "ok";
            if (parsed.cached) stats.cached++;
            else stats.ingested++;
            emit({ type: "ingest", url, title: parsed.title ?? url, status });
          } else {
            stats.errors++;
            emit({ type: "ingest", url, title: url, status: "error", error: parsed.error });
          }
        } catch {
          stats.errors++;
        }
      } else if (toolName === "finish_research") {
        const summary = String(tool.input.summary ?? "Araştırma tamamlandı.");
        emit({ type: "done", summary, stats });
        finished = true;
        result = JSON.stringify({ acknowledged: true });
      }

      toolResults.push({ type: "tool_result", tool_use_id: tool.id, content: result });
    }

    if (finished) break;

    messages.push({ role: "user", content: toolResults });
  }

  // If agent didn't call finish_research explicitly
  if (stats.toolCalls >= MAX_TOOL_CALLS || stats.ingested + stats.cached > 0) {
    emit({
      type: "done",
      summary: `Araştırma tamamlandı. ${stats.ingested} yeni kaynak eklendi, ${stats.cached} zaten mevcuttu.`,
      stats,
    });
  }
}

// ─── Anthropic API Call ────────────────────────────────────────────────────────

async function callAnthropic(
  apiKey: string,
  system: string,
  messages: AnthropicMessage[]
): Promise<AnthropicResponse> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system,
      tools: TOOL_DEFINITIONS,
      messages,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${body}`);
  }

  return (await res.json()) as AnthropicResponse;
}
