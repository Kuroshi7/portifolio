export type NodeType =
  | "input"
  | "chunker"
  | "embedder"
  | "retriever"
  | "ranker"
  | "prompt"
  | "llm"
  | "tool"
  | "memory"
  | "router"
  | "conditional"
  | "reflection"
  | "output"

export type EventSeverity = "info" | "success" | "warn" | "error"

export interface TraceEvent {
  id: string
  tStartMs: number
  nodeId: string
  nodeType: NodeType
  message: string
  severity: EventSeverity
  payload?: Record<string, unknown>
}

export interface Chunk {
  id: string
  text: string
  start: number
  end: number
}

export interface CorpusDocument {
  id: string
  title: string
  text: string
  topic: string
}

export interface RetrievedChunk {
  doc: CorpusDocument
  chunk: Chunk
  score: number
  /** lexical term-overlap component (0..1) — how many query words appear in the chunk */
  lexical?: number
  /** semantic similarity component (0..1) — from the toy cluster embedding */
  semantic?: number
  /** which query terms were found in this chunk (explains *why* it was retrieved) */
  matchedTerms?: string[]
}

export type ChunkStrategy = "fixed-char" | "fixed-token" | "sentence" | "paragraph"

export interface GraphNode {
  id: string
  type: NodeType
  label: string
  config?: Record<string, unknown>
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  condition?: string
  kind?: "forward" | "loop"
}

export interface ExecutionContext {
  startedAt: number
  query: string
  retrieved: RetrievedChunk[]
  prompt: string
  response: string
  scratch: Record<string, unknown>
}

export interface LLMSimulator {
  complete(prompt: string, ctx: ExecutionContext): Promise<string>
}
