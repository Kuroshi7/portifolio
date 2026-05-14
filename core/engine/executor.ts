import type { ExecutionContext, GraphEdge, GraphNode } from "./types"
import { eventBus } from "./eventBus"
import { chunkText } from "./simulators/chunker"
import { retrieve, rank, buildPrompt } from "./simulators/retriever"
import { templateLLM } from "./simulators/llmStub"

export interface RunGraphOptions {
  onNodeStart?: (nodeId: string) => void
  onNodeEnd?: (nodeId: string) => void
  stepDelayMs?: number
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export function newContext(query = ""): ExecutionContext {
  return {
    startedAt: Date.now(),
    query,
    retrieved: [],
    prompt: "",
    response: "",
    scratch: {},
  }
}

function outgoing(edges: GraphEdge[], nodeId: string): GraphEdge[] {
  return edges.filter((e) => e.source === nodeId)
}

function findStart(nodes: GraphNode[]): GraphNode | undefined {
  return nodes.find((n) => n.type === "input") ?? nodes[0]
}

const TOOL_KEYWORDS = [
  "search", "lookup", "find", "fetch", "weather", "current", "today", "now",
  "latest", "news", "calculate", "compute", "convert", "stock", "price",
]

const MAX_LOOPS_PER_NODE = 2
const HARD_VISIT_CAP = 12

function pickNextEdge(
  current: GraphNode,
  out: GraphEdge[],
  nodes: GraphNode[],
  ctx: ExecutionContext,
  visits: Map<string, number>,
): GraphEdge | undefined {
  if (out.length === 0) return undefined
  if (out.length === 1) return out[0]

  if (current.type === "router") {
    const wantsTool = TOOL_KEYWORDS.some((kw) => ctx.query.toLowerCase().includes(kw))
    const toolEdge = out.find((e) => nodes.find((n) => n.id === e.target)?.type === "tool")
    const nonToolEdge = out.find((e) => nodes.find((n) => n.id === e.target)?.type !== "tool")
    const chosen = wantsTool && toolEdge ? toolEdge : nonToolEdge ?? out[0]
    eventBus.emit(
      current.id,
      current.type,
      `Router → ${wantsTool ? "tool branch" : "retrieval branch"} (matched on query)`,
      "info",
    )
    return chosen
  }

  if (current.type === "conditional") {
    const loopEdge = out.find((e) => e.kind === "loop")
    const exitEdge = out.find((e) => e.kind !== "loop")
    const seen = visits.get(current.id) ?? 0
    const shouldLoop = loopEdge && seen <= MAX_LOOPS_PER_NODE
    const chosen = shouldLoop ? loopEdge : exitEdge ?? out[0]
    eventBus.emit(
      current.id,
      current.type,
      shouldLoop ? `Loop iteration ${seen}/${MAX_LOOPS_PER_NODE} → refine` : "Condition satisfied → exit",
      "info",
    )
    return chosen
  }

  return out[0]
}

export async function runNode(
  node: GraphNode,
  ctx: ExecutionContext,
): Promise<ExecutionContext> {
  eventBus.emit(node.id, node.type, `${node.label} started`, "info")

  switch (node.type) {
    case "input":
      eventBus.emit(node.id, node.type, `Query received: "${ctx.query}"`, "success")
      break
    case "chunker": {
      const chunks = chunkText(ctx.query, { strategy: "sentence", chunkSize: 200, overlap: 40 })
      ctx.scratch.chunks = chunks
      eventBus.emit(node.id, node.type, `Built ${chunks.length} chunk(s)`, "success", { count: chunks.length })
      break
    }
    case "embedder":
      eventBus.emit(node.id, node.type, "Embedded query into vector space", "success")
      break
    case "retriever": {
      const results = retrieve(ctx.query, { topK: 3 })
      ctx.retrieved = results
      eventBus.emit(node.id, node.type, `Retrieved ${results.length} chunk(s) (top score ${results[0]?.score.toFixed(3) ?? "n/a"})`, "success", {
        ids: results.map((r) => r.doc.id),
      })
      break
    }
    case "ranker": {
      ctx.retrieved = rank(ctx.retrieved)
      eventBus.emit(node.id, node.type, `Ranked ${ctx.retrieved.length} chunk(s)`, "success")
      break
    }
    case "prompt": {
      ctx.prompt = buildPrompt(ctx.query, ctx.retrieved)
      eventBus.emit(node.id, node.type, `Prompt assembled (${ctx.prompt.length} chars)`, "success", { length: ctx.prompt.length })
      break
    }
    case "llm": {
      const out = await templateLLM.complete(ctx.prompt, ctx)
      ctx.response = out
      eventBus.emit(node.id, node.type, `LLM responded`, "success", { length: out.length })
      break
    }
    case "tool":
      ctx.scratch.toolResult = `tool(${node.label}) → ok`
      eventBus.emit(node.id, node.type, `Tool ${node.label} executed`, "success")
      break
    case "memory":
      ctx.scratch.memory = (ctx.scratch.memory as string[] | undefined) ?? []
      ;(ctx.scratch.memory as string[]).push(ctx.query)
      eventBus.emit(node.id, node.type, "Wrote query to memory", "success")
      break
    case "router":
      eventBus.emit(node.id, node.type, "Routed to next branch", "info")
      break
    case "conditional":
      eventBus.emit(node.id, node.type, "Condition evaluated", "info")
      break
    case "reflection":
      eventBus.emit(node.id, node.type, "Self-critique pass", "info")
      break
    case "output":
      eventBus.emit(node.id, node.type, "Final answer ready", "success")
      break
  }

  eventBus.emit(node.id, node.type, `${node.label} done`, "info")
  return ctx
}

export async function runGraph(
  nodes: GraphNode[],
  edges: GraphEdge[],
  query: string,
  options: RunGraphOptions = {},
): Promise<ExecutionContext> {
  eventBus.reset()
  const ctx = newContext(query)
  const start = findStart(nodes)
  if (!start) return ctx

  const visits = new Map<string, number>()
  let current: GraphNode | undefined = start
  let totalSteps = 0

  while (current) {
    const here: GraphNode = current
    const seen = visits.get(here.id) ?? 0
    if (seen >= MAX_LOOPS_PER_NODE + 1 || totalSteps >= HARD_VISIT_CAP) {
      eventBus.emit(here.id, here.type, "Loop cap reached — stopping", "warn")
      break
    }
    visits.set(here.id, seen + 1)
    totalSteps += 1

    options.onNodeStart?.(here.id)
    await runNode(here, ctx)
    options.onNodeEnd?.(here.id)
    if (options.stepDelayMs) await sleep(options.stepDelayMs)

    const out = outgoing(edges, here.id)
    const nextEdge = pickNextEdge(here, out, nodes, ctx, visits)
    if (!nextEdge) break
    const nextNode = nodes.find((n: GraphNode) => n.id === nextEdge.target)
    if (nextNode) {
      const arrow = nextEdge.kind === "loop" ? "↺" : "→"
      eventBus.emit(
        here.id,
        here.type,
        `${arrow} ${here.label} ${arrow} ${nextNode.label}`,
        nextEdge.kind === "loop" ? "warn" : "info",
      )
    }
    current = nextNode
  }

  return ctx
}
