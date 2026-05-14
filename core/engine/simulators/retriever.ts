import type { CorpusDocument, RetrievedChunk } from "../types"
import { CORPUS } from "../fixtures/corpus"
import { chunkText } from "./chunker"
import { embed } from "./embedder"
import { cosineSimilarity } from "../fixtures/embeddings"

export interface RetrieveOptions {
  topK?: number
  chunkSize?: number
  overlap?: number
  corpus?: CorpusDocument[]
}

export function retrieve(query: string, options: RetrieveOptions = {}): RetrievedChunk[] {
  const topK = options.topK ?? 3
  const chunkSize = options.chunkSize ?? 220
  const overlap = options.overlap ?? 40
  const corpus = options.corpus ?? CORPUS

  const queryVector = embed(query)
  const results: RetrievedChunk[] = []

  for (const doc of corpus) {
    const chunks = chunkText(doc.text, { strategy: "sentence", chunkSize, overlap })
    for (const chunk of chunks) {
      const chunkVector = embed(chunk.text)
      const score = cosineSimilarity(queryVector, chunkVector)
      results.push({ doc, chunk, score })
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, topK)
}

export function rank(chunks: RetrievedChunk[]): RetrievedChunk[] {
  return [...chunks].sort((a, b) => b.score - a.score)
}

export function buildPrompt(query: string, chunks: RetrievedChunk[]): string {
  const context = chunks
    .map((c, i) => `[${i + 1}] (${c.doc.title}) ${c.chunk.text.trim()}`)
    .join("\n\n")
  return `You are a helpful assistant. Use the context below to answer the question.\n\nContext:\n${context}\n\nQuestion: ${query}\n\nAnswer:`
}
