# Engine

Framework-agnostic TypeScript that powers the AI Lab. No React imports here.

## Why deterministic simulation?

The Lab is a teaching tool. Real LLM calls add latency, cost, and flakiness — none of which help when the goal is to *see* a pipeline run frame by frame. Every "AI" call is deterministic and offline:

- **chunker** — pure text splitters
- **embedder** — pre-baked 2D dictionary + hash-based fallback (`fixtures/embeddings.ts`)
- **retriever** — cosine similarity over `fixtures/corpus.ts`
- **llmStub** — template responses keyed off the retrieved context

## Swap point for a real model

`LLMSimulator` (in `types.ts`) is the interface. To plug in a real provider later, implement it and pass the instance through `runGraph`/`runNode`. Nothing else needs to change.

## Event flow

`runNode` calls `eventBus.emit(...)` for every step. The Zustand store subscribes once in `stores/labStore.ts` and pushes events into `tracing.events`. UI panels (TracingTimeline, StateViewer) read from there.
