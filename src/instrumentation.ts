export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { scheduleBackgroundResearch } = await import(
    "./features/knowledge-agent/agent/backgroundResearch"
  );
  scheduleBackgroundResearch();
}
