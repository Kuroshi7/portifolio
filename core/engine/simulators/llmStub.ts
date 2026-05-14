import type { ExecutionContext, LLMSimulator } from "../types"

export class TemplateLLM implements LLMSimulator {
  async complete(_prompt: string, ctx: ExecutionContext): Promise<string> {
    if (ctx.retrieved.length === 0) {
      return `I don't have enough context to answer "${ctx.query}" confidently. Try expanding the corpus or rephrasing the query.`
    }
    const top = ctx.retrieved[0]
    const supporting = ctx.retrieved.slice(0, 2).map((r, i) => `[${i + 1}]`).join(" ")
    const summary = top.chunk.text.replace(/\s+/g, " ").trim()
    const trimmed = summary.length > 240 ? summary.slice(0, 237) + "..." : summary
    return `Based on the retrieved context ${supporting}: ${trimmed}`
  }
}

export const templateLLM = new TemplateLLM()
