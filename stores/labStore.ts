import { create } from "zustand"
import type { Chunk, ChunkStrategy, GraphEdge, GraphNode, RetrievedChunk, TraceEvent } from "@/core/engine/types"
import { chunkText } from "@/core/engine/simulators/chunker"
import { eventBus } from "@/core/engine/eventBus"

export type RagStep = "idle" | "input" | "chunking" | "retrieval" | "ranking" | "prompt" | "response" | "done"

interface ChunkingSlice {
  input: string
  strategy: ChunkStrategy
  chunkSize: number
  overlap: number
  chunks: Chunk[]
  setInput: (s: string) => void
  setStrategy: (s: ChunkStrategy) => void
  setChunkSize: (n: number) => void
  setOverlap: (n: number) => void
  recompute: () => void
}

interface EmbeddingsSlice {
  phrases: string[]
  addPhrase: (p: string) => void
  removePhrase: (p: string) => void
  reset: () => void
}

interface RagSlice {
  query: string
  step: RagStep
  retrieved: RetrievedChunk[]
  prompt: string
  response: string
  setQuery: (s: string) => void
  setStep: (s: RagStep) => void
  setRetrieved: (r: RetrievedChunk[]) => void
  setPrompt: (p: string) => void
  setResponse: (r: string) => void
  resetRun: () => void
}

interface BuilderSlice {
  nodes: GraphNode[]
  edges: GraphEdge[]
  currentNodeId: string | null
  isRunning: boolean
  setGraph: (nodes: GraphNode[], edges: GraphEdge[]) => void
  setCurrentNode: (id: string | null) => void
  setRunning: (b: boolean) => void
}

interface TracingSlice {
  events: TraceEvent[]
  pushEvent: (e: TraceEvent) => void
  clearEvents: () => void
}

export interface LabStore extends ChunkingSlice, EmbeddingsSlice, RagSlice, BuilderSlice, TracingSlice {}

const DEFAULT_TEXT = `Retrieval-Augmented Generation (RAG) combines a retriever and a generator. The retriever fetches relevant documents from a vector store. The generator uses those documents as grounding context.

Chunking splits long documents into smaller pieces before embedding. Fixed-size chunks are simple but break sentences. Sentence-aware chunkers preserve grammar. Overlap between chunks improves recall.

An agent is an LLM in a loop with tools, memory, and a goal. LangGraph models this loop as a state machine with explicit nodes and conditional edges.`

export const useLabStore = create<LabStore>((set, get) => ({
  input: DEFAULT_TEXT,
  strategy: "sentence",
  chunkSize: 200,
  overlap: 40,
  chunks: chunkText(DEFAULT_TEXT, { strategy: "sentence", chunkSize: 200, overlap: 40 }),
  setInput: (s) => {
    set({ input: s })
    get().recompute()
  },
  setStrategy: (s) => {
    set({ strategy: s })
    get().recompute()
  },
  setChunkSize: (n) => {
    set({ chunkSize: n })
    get().recompute()
  },
  setOverlap: (n) => {
    set({ overlap: n })
    get().recompute()
  },
  recompute: () => {
    const { input, strategy, chunkSize, overlap } = get()
    set({ chunks: chunkText(input, { strategy, chunkSize, overlap }) })
  },

  phrases: ["code", "pizza", "happy", "guitar", "money"],
  addPhrase: (p) => set((s) => (p && !s.phrases.includes(p) ? { phrases: [...s.phrases, p] } : s)),
  removePhrase: (p) => set((s) => ({ phrases: s.phrases.filter((x) => x !== p) })),
  reset: () => set({ phrases: [] }),

  query: "What is retrieval augmented generation?",
  step: "idle",
  retrieved: [],
  prompt: "",
  response: "",
  setQuery: (s) => set({ query: s }),
  setStep: (s) => set({ step: s }),
  setRetrieved: (r) => set({ retrieved: r }),
  setPrompt: (p) => set({ prompt: p }),
  setResponse: (r) => set({ response: r }),
  resetRun: () => set({ step: "idle", retrieved: [], prompt: "", response: "", events: [] }),

  nodes: [],
  edges: [],
  currentNodeId: null,
  isRunning: false,
  setGraph: (nodes, edges) => set({ nodes, edges }),
  setCurrentNode: (id) => set({ currentNodeId: id }),
  setRunning: (b) => set({ isRunning: b }),

  events: [],
  pushEvent: (e) => set((s) => ({ events: [...s.events, e] })),
  clearEvents: () => set({ events: [] }),
}))

let busSubscribed = false
export function attachEventBus() {
  if (busSubscribed) return
  busSubscribed = true
  eventBus.on((event) => {
    useLabStore.getState().pushEvent(event)
  })
}
