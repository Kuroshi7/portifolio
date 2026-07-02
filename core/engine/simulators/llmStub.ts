import type { ExecutionContext, LLMSimulator, RetrievedChunk } from "../types"

// Below this blended score the top match is too weak to trust — the teachable
// moment where RAG either refuses or risks hallucinating.
const WEAK_THRESHOLD = 0.35

function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

// Pick the sentence from the top chunk that best answers the query — the one
// containing the most matched query terms (falls back to the first sentence).
function bestSentence(top: RetrievedChunk, query: string): string {
  const qterms = query.toLowerCase().match(/[a-z0-9]{3,}/g) ?? []
  const sents = sentences(top.chunk.text)
  if (sents.length === 0) return top.chunk.text.trim()
  let best = sents[0]
  let bestHits = -1
  for (const s of sents) {
    const lower = s.toLowerCase()
    const hits = qterms.reduce((n, t) => n + (lower.includes(t) ? 1 : 0), 0)
    if (hits > bestHits) {
      bestHits = hits
      best = s
    }
  }
  return best
}

export class TemplateLLM implements LLMSimulator {
  async complete(_prompt: string, ctx: ExecutionContext): Promise<string> {
    const top = ctx.retrieved[0]

    // No context at all, or the best match is too weak to ground an answer.
    if (!top || top.score < WEAK_THRESHOLD) {
      const bestScore = top ? top.score.toFixed(2) : "0.00"
      return (
        `⚠ Weak retrieval — the best match scored only ${bestScore}/1.00, below the ${WEAK_THRESHOLD} trust threshold. ` +
        `Nothing in the knowledge base clearly answers "${ctx.query}", so a grounded model refuses instead of guessing. ` +
        `This is exactly why retrieval quality decides answer quality in RAG. ` +
        `Try a question about the indexed topics: RAG, embeddings, chunking, agents, tools, or LangChain.`
      )
    }

    const answer = bestSentence(top, ctx.query)
    // Only cite chunks that are actually relevant — never credit a weak semantic-only
    // filler (that's what made answers cite unrelated docs like "Index investing").
    const relevant = ctx.retrieved.filter(
      (r) => r.score >= WEAK_THRESHOLD || (r.matchedTerms?.length ?? 0) > 0,
    )
    const sources = Array.from(new Set((relevant.length ? relevant : [top]).slice(0, 2).map((r) => r.doc.title)))
    const cites = sources.map((s) => `“${s}”`).join(" + ")
    const matched = top.matchedTerms && top.matchedTerms.length > 0 ? top.matchedTerms.join(", ") : "semantic similarity"

    return (
      `${answer} ` +
      `\n\n— Grounded in ${cites} (matched on: ${matched}). ` +
      `The answer is copied from the retrieved context above, not invented — that traceability is the whole point of RAG.`
    )
  }
}

export const templateLLM = new TemplateLLM()
