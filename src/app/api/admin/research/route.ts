import { runResearchAgent, type AgentEvent } from "@/features/knowledge-agent/agent/researchAgent";

export async function POST(): Promise<Response> {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (event: AgentEvent) => {
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
      };

      try {
        await runResearchAgent(emit);
      } catch (err) {
        emit({
          type: "error",
          message: err instanceof Error ? err.message : "Bilinmeyen hata.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
