# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Dev server (port 3000) — uses --max-old-space-size=4096
npm run build    # Production build
npm run lint     # ESLint
npm run test     # Jest
npm run test:watch

# Standalone knowledge ingestion (no dev server needed)
npx tsx --tsconfig tsconfig.json scripts/ingest-docs.ts

# One-time migration: store.json → SQLite (idempotent, skips existing)
npx tsx --tsconfig tsconfig.json scripts/migrate-to-sqlite.ts
```

## Architecture

### Feature Modules (`src/features/`)

Three independent feature modules, each self-contained with its own types, API clients, analysis logic, components, and hooks:

**`competitor-analysis/`** — Original channel analysis engine. Fetches channel data via YouTube Data API v3, runs metrics/title/opportunity analysis. Entry: `api/analyzer.ts`.

**`youtube-growth/`** — Growth intelligence layer built on top of competitor-analysis. Adds outlier detection, upload frequency analysis, channel health scoring, growth diagnosis, and AI-powered outputs (90-day plan, strategist chat). Entry: `api/analyzer.ts` → `analysis/*`. AI calls in `ai/growthStrategist.ts` use `claude-sonnet-4-6`.

**`knowledge-agent/`** — RAG knowledge library. Pipeline:
1. **Collect**: `collectors/` — YouTube transcripts via yt-dlp + Groq Whisper (`youtubeCollector.ts`), web articles (`articleCollector.ts`), PDFs with lazy `require("pdf-parse")` (`pdfCollector.ts`)
2. **Process**: `processors/` — clean, chunk, summarize (Haiku)
3. **Store**: `embeddings/vectorStore.ts` + `db/` — SQLite at `data/knowledge/knowledge.db` via `better-sqlite3`. Schema in `db/schema.ts` (sources, chunks, embeddings, FTS5 chunks_fts, metadata). Singleton connection via `db/client.ts` (`globalThis.__knowledgeDb`). FTS5 kept in sync with `chunks` via INSERT/DELETE triggers.
4. **Retrieve**: `retriever/` — TF-IDF embeddings + cosine similarity (`semanticSearch.ts`), context assembly (`contextBuilder.ts`)
5. **Agent**: `agent/researchAgent.ts` — agentic loop (MAX_TOOL_CALLS=120) calling Anthropic with `search_youtube` + `ingest_url` + `finish_research` tools. Topics defined in `agent/topics.ts`.

### API Routes (`src/app/api/`)

| Route | Purpose |
|-------|---------|
| `competitor-analysis/` | Channel fetch + full analysis |
| `youtube-growth/analyze-channel/` | Growth analysis (wraps competitor-analysis) |
| `youtube-growth/ask-strategist/` | AI chat with channel context |
| `youtube-growth/generate-plan/` | 90-day plan via RAG |
| `knowledge/ingest/` | Single URL ingest |
| `knowledge/search/` | Semantic search |
| `knowledge/sources/` | CRUD on knowledge store |
| `admin/research/` | Stream research agent (NDJSON) |
| `admin/research/status/` | Research status |

### Key Conventions

- **SQLite DB** — `data/knowledge/knowledge.db` is the knowledge store. `better-sqlite3` is listed in `serverExternalPackages` in `next.config.ts`. Never drop tables or delete the DB file; use `deleteSource(id)` to remove individual sources. `store.json` is legacy (migrated via `migrate-to-sqlite.ts`).
- **Path alias** — `@/` maps to `src/`. Use `npx tsx --tsconfig tsconfig.json` for standalone scripts.
- **Env vars** — `ANTHROPIC_API_KEY`, `YOUTUBE_API_KEY`, `GROQ_API_KEY`, `OBSIDIAN_VAULT_PATH` (optional) in `.env.local`.
- **yt-dlp** — Binary at `bin/yt-dlp.exe`, called via `execFile` with `--js-runtimes node -f worstaudio` (no ffmpeg needed).
- **Obsidian sync** — `collectors/obsidianWriter.ts` writes notes + MOC hub files to `OBSIDIAN_VAULT_PATH` when set. MOC files are navigation-only (not content).
- **Research agent trigger** — Background research auto-starts on server init (`instrumentation.ts`) if `lastResearchAt` is null in store.
