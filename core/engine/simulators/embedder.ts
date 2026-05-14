import { cosineSimilarity, resolveEmbedding } from "../fixtures/embeddings"
import type { EmbeddingSource, PhraseVector } from "../fixtures/embeddings"

const WORST: Record<EmbeddingSource, number> = { fallback: 2, keyword: 1, index: 0 }

export function embed(text: string): PhraseVector {
  const phrase = text.trim().toLowerCase()
  const tokens = phrase.split(/\W+/).filter(Boolean)
  if (tokens.length === 0) return resolveEmbedding(phrase)

  const vectors = tokens.map((t) => resolveEmbedding(t))
  const x = vectors.reduce((acc, v) => acc + v.x, 0) / vectors.length
  const y = vectors.reduce((acc, v) => acc + v.y, 0) / vectors.length
  const source = vectors.reduce<EmbeddingSource>(
    (worst, v) => (WORST[v.source] > WORST[worst] ? v.source : worst),
    "index",
  )
  return { phrase: text, cluster: vectors[0].cluster, x, y, source }
}

export function similarity(a: string, b: string): number {
  return cosineSimilarity(embed(a), embed(b))
}
