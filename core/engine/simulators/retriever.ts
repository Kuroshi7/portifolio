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

// Words too common to carry meaning — ignored when matching query ↔ chunk.
const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being", "of", "to", "and", "or",
  "in", "on", "for", "with", "as", "by", "at", "from", "that", "this", "these", "those", "it",
  "its", "i", "you", "we", "they", "he", "she", "do", "does", "did", "can", "could", "will",
  "would", "should", "what", "which", "who", "how", "why", "when", "where", "about", "into",
  "use", "used", "using", "than", "then", "there", "here", "some", "any", "more", "most",
])

function terms(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t))
}

// Crude singularization so "embeddings" matches "embedding", "chunks" matches "chunk".
function normalize(t: string): string {
  if (t.length > 4 && t.endsWith("s")) return t.slice(0, -1)
  return t
}

/**
 * Hybrid retrieval: a lexical term-overlap score (how many query words appear in the
 * chunk) blended with the toy cluster embedding's semantic similarity. Lexical dominates
 * so results are actually relevant AND explainable — every hit reports which terms matched.
 */
export function retrieve(query: string, options: RetrieveOptions = {}): RetrievedChunk[] {
  const topK = options.topK ?? 3
  const chunkSize = options.chunkSize ?? 220
  const overlap = options.overlap ?? 40
  const corpus = options.corpus ?? CORPUS

  const queryVector = embed(query)
  const queryTerms = terms(query)
  const queryNorm = new Map(queryTerms.map((t) => [normalize(t), t]))
  const results: RetrievedChunk[] = []

  for (const doc of corpus) {
    const chunks = chunkText(doc.text, { strategy: "sentence", chunkSize, overlap })
    for (const chunk of chunks) {
      // Semantic component, mapped from cosine [-1,1] to [0,1].
      const chunkVector = embed(chunk.text)
      const semantic = (cosineSimilarity(queryVector, chunkVector) + 1) / 2

      // Lexical component: fraction of query terms present in the chunk.
      const chunkNorm = new Set(terms(chunk.text).map(normalize))
      const matchedTerms: string[] = []
      for (const [norm, original] of queryNorm) {
        if (chunkNorm.has(norm)) matchedTerms.push(original)
      }
      const lexical = queryNorm.size === 0 ? 0 : matchedTerms.length / queryNorm.size

      const score = 0.7 * lexical + 0.3 * semantic
      results.push({ doc, chunk, score, lexical, semantic, matchedTerms })
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
