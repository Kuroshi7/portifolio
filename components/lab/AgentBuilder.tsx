"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
} from "reactflow"
import "reactflow/dist/style.css"
import { nanoid } from "nanoid"
import { Play, RotateCcw, Trash2, Info, ChevronDown } from "lucide-react"
import { useLabStore, attachEventBus } from "@/stores/labStore"
import { runGraph } from "@/core/engine/executor"
import type { GraphEdge, GraphNode, NodeType } from "@/core/engine/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import TracingTimeline from "./TracingTimeline"
import StateViewer from "./StateViewer"

interface NodeMeta {
  type: NodeType
  label: string
  color: string
  description: string
  whenToUse: string
}

const NODE_TYPES: NodeMeta[] = [
  {
    type: "input",
    label: "Input",
    color: "border-gray-400 text-gray-200",
    description: "Entry point. Captures the user's query and feeds it into the graph.",
    whenToUse: "Place it first. Every run starts here.",
  },
  {
    type: "chunker",
    label: "Chunker",
    color: "border-cyan-400 text-cyan-200",
    description: "Splits text into smaller pieces. Useful when a node downstream needs short, focused passages.",
    whenToUse: "After Input (for long queries) or after a Tool that returned a big blob of text.",
  },
  {
    type: "embedder",
    label: "Embedder",
    color: "border-fuchsia-400 text-fuchsia-200",
    description: "Turns text into a vector so it can be compared by meaning, not by exact words.",
    whenToUse: "Before a Retriever — the Retriever needs vectors to do similarity search.",
  },
  {
    type: "retriever",
    label: "Retriever",
    color: "border-lime-400 text-lime-200",
    description: "Searches the document corpus and returns the chunks most similar to the query.",
    whenToUse: "The heart of RAG. Usually right after Input (or Embedder), before Prompt.",
  },
  {
    type: "ranker",
    label: "Ranker",
    color: "border-yellow-400 text-yellow-200",
    description: "Re-orders retrieved chunks by score. In real systems this is often a cross-encoder; here it sorts by similarity.",
    whenToUse: "Between Retriever and Prompt when you want a second pass on relevance.",
  },
  {
    type: "prompt",
    label: "Prompt",
    color: "border-orange-400 text-orange-200",
    description: "Builds the final prompt by stitching the query together with the retrieved context.",
    whenToUse: "After Retriever (or Ranker), right before LLM.",
  },
  {
    type: "llm",
    label: "LLM",
    color: "border-emerald-400 text-emerald-200",
    description: "Generates the answer from the assembled prompt. In the Lab this is a deterministic template, not a real model.",
    whenToUse: "After Prompt. Can also follow Tool or Reflection in agent loops.",
  },
  {
    type: "tool",
    label: "Tool",
    color: "border-blue-400 text-blue-200",
    description: "Calls an external function — search, calculator, API. The result feeds back into the graph.",
    whenToUse: "When the LLM needs information or actions it can't produce on its own. Usually followed by LLM again.",
  },
  {
    type: "memory",
    label: "Memory",
    color: "border-pink-400 text-pink-200",
    description: "Writes the current state into long-term memory so future runs can recall it.",
    whenToUse: "After LLM or before Output, to persist what was decided or said.",
  },
  {
    type: "router",
    label: "Router",
    color: "border-violet-400 text-violet-200",
    description: "Picks one of several outgoing branches based on the state. The 'switch statement' of an agent graph.",
    whenToUse: "When the same input can lead to different sub-flows (e.g. RAG vs. tool use vs. direct answer).",
  },
  {
    type: "conditional",
    label: "Conditional",
    color: "border-amber-400 text-amber-200",
    description: "Evaluates a true/false check before continuing. Used to loop or short-circuit.",
    whenToUse: "Inside agent loops: 'is the answer good enough yet? if not, loop back to LLM'.",
  },
  {
    type: "reflection",
    label: "Reflection",
    color: "border-rose-400 text-rose-200",
    description: "Self-critique pass. The agent inspects its own output and decides whether to refine it.",
    whenToUse: "After LLM, before Output — typically paired with a Conditional that loops back on failure.",
  },
  {
    type: "output",
    label: "Output",
    color: "border-gray-400 text-gray-200",
    description: "Terminal node. Marks the final answer that leaves the graph.",
    whenToUse: "Place it last. The run ends when execution reaches Output (or runs out of edges).",
  },
]

const COLOR_BY_TYPE = Object.fromEntries(NODE_TYPES.map((n) => [n.type, n.color])) as Record<NodeType, string>

const EDGE_STYLE = { animated: true, style: { stroke: "#a4c639" } } as const

const node = (id: string, x: number, y: number, type: NodeType, label: string): Node => ({
  id,
  type: "agent",
  position: { x, y },
  data: { label, nodeType: type },
})

const edge = (id: string, source: string, target: string): Edge => ({ id, source, target, ...EDGE_STYLE })

interface Preset {
  id: string
  label: string
  description: string
  useCases?: string[]
  nodes: Node[]
  edges: Edge[]
}

const PRESETS: Preset[] = [
  {
    id: "simple-rag",
    label: "Simple RAG",
    description: "The classic RAG pipeline: retrieve relevant chunks, stuff them into a prompt, ask the LLM.",
    useCases: [
      "FAQ chatbot grounded on a docs site",
      "Internal knowledge base Q&A",
      "Customer support over product manuals",
    ],
    nodes: [
      node("n-input", 40, 160, "input", "Input"),
      node("n-retriever", 230, 160, "retriever", "Retriever"),
      node("n-prompt", 430, 160, "prompt", "Prompt"),
      node("n-llm", 630, 160, "llm", "LLM"),
      node("n-output", 830, 160, "output", "Output"),
    ],
    edges: [
      edge("e1", "n-input", "n-retriever"),
      edge("e2", "n-retriever", "n-prompt"),
      edge("e3", "n-prompt", "n-llm"),
      edge("e4", "n-llm", "n-output"),
    ],
  },
  {
    id: "rag-rerank",
    label: "RAG + Reranker",
    description: "Two-pass retrieval: a fast retriever pulls candidates, a ranker re-orders them before prompting.",
    useCases: [
      "Legal / medical document search where wrong context = wrong answer",
      "High-precision research assistants",
      "Long-document Q&A with thousands of chunks",
    ],
    nodes: [
      node("n-input", 40, 160, "input", "Input"),
      node("n-retriever", 220, 160, "retriever", "Retriever"),
      node("n-ranker", 400, 160, "ranker", "Ranker"),
      node("n-prompt", 580, 160, "prompt", "Prompt"),
      node("n-llm", 760, 160, "llm", "LLM"),
      node("n-output", 940, 160, "output", "Output"),
    ],
    edges: [
      edge("e1", "n-input", "n-retriever"),
      edge("e2", "n-retriever", "n-ranker"),
      edge("e3", "n-ranker", "n-prompt"),
      edge("e4", "n-prompt", "n-llm"),
      edge("e5", "n-llm", "n-output"),
    ],
  },
  {
    id: "tool-use",
    label: "Agent + Tools",
    description: "The LLM decides to call a Tool, the Tool returns data, and the LLM is called again to answer.",
    useCases: [
      "Math + code assistants (calculator, Wolfram, Python sandbox)",
      "Live data fetching — weather, stocks, sports scores",
      "Function-calling agents (Stripe, GitHub, internal APIs)",
    ],
    nodes: [
      node("n-input", 40, 160, "input", "Input"),
      node("n-llm-1", 230, 160, "llm", "LLM (decide)"),
      node("n-tool", 430, 160, "tool", "Tool"),
      node("n-llm-2", 630, 160, "llm", "LLM (answer)"),
      node("n-output", 830, 160, "output", "Output"),
    ],
    edges: [
      edge("e1", "n-input", "n-llm-1"),
      edge("e2", "n-llm-1", "n-tool"),
      edge("e3", "n-tool", "n-llm-2"),
      edge("e4", "n-llm-2", "n-output"),
    ],
  },
  {
    id: "reflection",
    label: "Reflection Loop",
    description: "The agent self-critiques. A Conditional decides whether to refine (loop back) or finalize. The dashed red edge is the cycle — pure LangGraph territory.",
    useCases: [
      "Code generators that test and fix their output",
      "Writing assistants that critique and rewrite drafts",
      "Multi-step planners that re-evaluate before acting",
    ],
    nodes: [
      node("n-input", 40, 220, "input", "Input"),
      node("n-llm", 220, 220, "llm", "LLM"),
      node("n-reflection", 420, 220, "reflection", "Reflection"),
      node("n-cond", 620, 220, "conditional", "Good enough?"),
      node("n-output", 860, 220, "output", "Output"),
    ],
    edges: [
      edge("e1", "n-input", "n-llm"),
      edge("e2", "n-llm", "n-reflection"),
      edge("e3", "n-reflection", "n-cond"),
      {
        id: "e4",
        source: "n-cond",
        target: "n-output",
        animated: true,
        label: "✓ done",
        labelStyle: { fill: "#a4c639", fontWeight: 600, fontSize: 11 },
        labelBgStyle: { fill: "#0a0a0a", fillOpacity: 0.85 },
        style: { stroke: "#a4c639" },
      },
      {
        id: "e5",
        source: "n-cond",
        sourceHandle: "loop-out",
        target: "n-llm",
        targetHandle: "loop-in",
        animated: true,
        type: "smoothstep",
        label: "↺ refine",
        labelStyle: { fill: "#f43f5e", fontWeight: 600, fontSize: 11 },
        labelBgStyle: { fill: "#0a0a0a", fillOpacity: 0.85 },
        style: { stroke: "#f43f5e", strokeDasharray: "6 4", strokeWidth: 2 },
        pathOptions: { offset: 60, borderRadius: 16 },
      },
    ],
  },
  {
    id: "router",
    label: "Branching Router",
    description: "A Router picks one of several paths based on the query. Try a query with words like 'search', 'weather', 'today', or 'find' to hit the Tool branch — otherwise it goes RAG.",
    useCases: [
      "Customer service bots routing by intent (billing / technical / general)",
      "Multi-skill assistants picking tool-use vs retrieval vs direct answer",
      "Support ticket triage and auto-assignment",
    ],
    nodes: [
      node("n-input", 40, 160, "input", "Input"),
      node("n-router", 220, 160, "router", "Router"),
      node("n-retriever", 420, 70, "retriever", "Retriever"),
      node("n-prompt", 620, 70, "prompt", "Prompt"),
      node("n-tool", 420, 250, "tool", "Tool"),
      node("n-llm", 820, 160, "llm", "LLM"),
      node("n-output", 1020, 160, "output", "Output"),
    ],
    edges: [
      edge("e1", "n-input", "n-router"),
      edge("e2", "n-router", "n-retriever"),
      edge("e3", "n-router", "n-tool"),
      edge("e4", "n-retriever", "n-prompt"),
      edge("e5", "n-prompt", "n-llm"),
      edge("e6", "n-tool", "n-llm"),
      edge("e7", "n-llm", "n-output"),
    ],
  },
  {
    id: "self-improving",
    label: "Self-Improving Agent",
    description: "Full pipeline: chunk + embed the query, Router picks RAG vs Tool, retrieve + rank evidence, LLM answers, Reflection critiques, Conditional either commits to Memory (done) or loops back to refine the LLM. The dashed red edge is the LangGraph-style cycle.",
    useCases: [
      "Autonomous research agents that iterate until confident",
      "Coding assistants that verify, critique, and rewrite solutions",
      "Auto-grading or evaluation pipelines that retry until passing",
    ],
    nodes: [
      node("n-input", 40, 240, "input", "Input"),
      node("n-chunker", 200, 240, "chunker", "Chunker"),
      node("n-embedder", 360, 240, "embedder", "Embedder"),
      node("n-router", 520, 240, "router", "Router"),
      node("n-retriever", 700, 100, "retriever", "Retriever"),
      node("n-ranker", 880, 100, "ranker", "Ranker"),
      node("n-tool", 700, 380, "tool", "Tool"),
      node("n-prompt", 1080, 240, "prompt", "Prompt"),
      node("n-llm", 1260, 240, "llm", "LLM"),
      node("n-reflection", 1440, 240, "reflection", "Reflection"),
      node("n-cond", 1620, 240, "conditional", "Confident?"),
      node("n-memory", 1800, 240, "memory", "Memory"),
      node("n-output", 1960, 240, "output", "Output"),
    ],
    edges: [
      edge("e1", "n-input", "n-chunker"),
      edge("e2", "n-chunker", "n-embedder"),
      edge("e3", "n-embedder", "n-router"),
      {
        id: "e4", source: "n-router", target: "n-retriever",
        animated: true, label: "docs", labelStyle: { fill: "#a4c639", fontSize: 10 },
        labelBgStyle: { fill: "#0a0a0a", fillOpacity: 0.85 }, style: { stroke: "#a4c639" },
      },
      {
        id: "e5", source: "n-router", target: "n-tool",
        animated: true, label: "external", labelStyle: { fill: "#60a5fa", fontSize: 10 },
        labelBgStyle: { fill: "#0a0a0a", fillOpacity: 0.85 }, style: { stroke: "#60a5fa" },
      },
      edge("e6", "n-retriever", "n-ranker"),
      edge("e7", "n-ranker", "n-prompt"),
      edge("e8", "n-tool", "n-prompt"),
      edge("e9", "n-prompt", "n-llm"),
      edge("e10", "n-llm", "n-reflection"),
      edge("e11", "n-reflection", "n-cond"),
      {
        id: "e12", source: "n-cond", target: "n-memory",
        animated: true, label: "✓ done", labelStyle: { fill: "#a4c639", fontWeight: 600, fontSize: 11 },
        labelBgStyle: { fill: "#0a0a0a", fillOpacity: 0.85 }, style: { stroke: "#a4c639" },
      },
      edge("e13", "n-memory", "n-output"),
      {
        id: "e14", source: "n-cond", sourceHandle: "loop-out",
        target: "n-llm", targetHandle: "loop-in",
        animated: true, type: "smoothstep", label: "↺ refine",
        labelStyle: { fill: "#f43f5e", fontWeight: 600, fontSize: 11 },
        labelBgStyle: { fill: "#0a0a0a", fillOpacity: 0.85 },
        style: { stroke: "#f43f5e", strokeDasharray: "6 4", strokeWidth: 2 },
        pathOptions: { offset: 80, borderRadius: 16 },
      },
    ],
  },
  {
    id: "full-agent",
    label: "Full RAG Agent",
    description: "A production-shaped agent: memory bracket, router branching RAG vs Tool, reranking, reflection loop. Try query 'search latest news' to trigger the Tool branch, or 'what is RAG' for the retrieval branch.",
    useCases: [
      "Enterprise copilots with cross-session memory (Salesforce, M365)",
      "Specialized verticals — financial analyst, legal research, medical assistants",
      "Production chatbots needing high precision and tool access",
    ],
    nodes: [
      node("n-input",      40,   240, "input",       "Input"),
      node("n-mem-read",   200,  240, "memory",      "Memory (read)"),
      node("n-router",     380,  240, "router",      "Router"),
      // RAG branch (top)
      node("n-chunker",    580,  80,  "chunker",     "Chunker"),
      node("n-embedder",   740,  80,  "embedder",    "Embedder"),
      node("n-retriever",  900,  80,  "retriever",   "Retriever"),
      node("n-ranker",     1060, 80,  "ranker",      "Ranker"),
      // Tool branch (bottom)
      node("n-tool",       580,  400, "tool",        "Tool"),
      // Converge
      node("n-prompt",     1240, 240, "prompt",      "Prompt"),
      node("n-llm",        1400, 240, "llm",         "LLM"),
      node("n-reflection", 1560, 240, "reflection",  "Reflection"),
      node("n-cond",       1720, 240, "conditional", "Good enough?"),
      node("n-mem-write",  1880, 240, "memory",      "Memory (write)"),
      node("n-output",     2040, 240, "output",      "Output"),
    ],
    edges: [
      edge("e1",  "n-input",      "n-mem-read"),
      edge("e2",  "n-mem-read",   "n-router"),
      edge("e3",  "n-router",     "n-chunker"),
      edge("e4",  "n-router",     "n-tool"),
      edge("e5",  "n-chunker",    "n-embedder"),
      edge("e6",  "n-embedder",   "n-retriever"),
      edge("e7",  "n-retriever",  "n-ranker"),
      edge("e8",  "n-ranker",     "n-prompt"),
      edge("e9",  "n-tool",       "n-prompt"),
      edge("e10", "n-prompt",     "n-llm"),
      edge("e11", "n-llm",        "n-reflection"),
      edge("e12", "n-reflection", "n-cond"),
      {
        id: "e13",
        source: "n-cond",
        target: "n-mem-write",
        animated: true,
        label: "✓ done",
        labelStyle: { fill: "#a4c639", fontWeight: 600, fontSize: 11 },
        labelBgStyle: { fill: "#0a0a0a", fillOpacity: 0.85 },
        style: { stroke: "#a4c639" },
      },
      edge("e14", "n-mem-write",  "n-output"),
      {
        id: "e15",
        source: "n-cond",
        sourceHandle: "loop-out",
        target: "n-llm",
        targetHandle: "loop-in",
        animated: true,
        type: "smoothstep",
        label: "↺ refine",
        labelStyle: { fill: "#f43f5e", fontWeight: 600, fontSize: 11 },
        labelBgStyle: { fill: "#0a0a0a", fillOpacity: 0.85 },
        style: { stroke: "#f43f5e", strokeDasharray: "6 4", strokeWidth: 2 },
        pathOptions: { offset: 60, borderRadius: 16 },
      },
    ],
  },
  {
    id: "blank",
    label: "Blank",
    description: "Empty canvas. Build your own graph from scratch.",
    nodes: [],
    edges: [],
  },
]

function AgentNode({ data, id }: NodeProps<{ label: string; nodeType: NodeType }>) {
  const currentNodeId = useLabStore((s) => s.currentNodeId)
  const active = currentNodeId === id
  const color = COLOR_BY_TYPE[data.nodeType] ?? "border-gray-400 text-gray-200"
  return (
    <div
      className={`px-3 py-2 bg-black/80 border-2 rounded-sm shadow-md min-w-[120px] text-center transition-all duration-200 ${color} ${
        active ? "shadow-[0_0_18px_-2px_rgba(164,198,57,0.85)] scale-105" : ""
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-lime-500 !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-lime-500 !w-2 !h-2" />
      <div className="text-[10px] uppercase tracking-wider opacity-70">{data.nodeType}</div>
      <div className="text-sm font-semibold">{data.label}</div>
      <Handle
        id="loop-in"
        type="target"
        position={Position.Top}
        className="!bg-rose-500 !w-2 !h-2 !border !border-black"
        style={{ left: "30%" }}
        title="Loop in — drag here from another node's top-right handle to create a loop-back edge"
      />
      <Handle
        id="loop-out"
        type="source"
        position={Position.Top}
        className="!bg-rose-500 !w-2 !h-2 !border !border-black"
        style={{ left: "70%" }}
        title="Loop out — drag from here to another node's top-left handle to create a loop-back edge"
      />
    </div>
  )
}

const nodeTypesMap = { agent: AgentNode }

const DEFAULT_PRESET = PRESETS[0]

function BuilderInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(DEFAULT_PRESET.nodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(DEFAULT_PRESET.edges)
  const [presetId, setPresetId] = useState(DEFAULT_PRESET.id)
  const [query, setQuery] = useState("What is retrieval augmented generation?")
  const { fitView } = useReactFlow()
  const isRunning = useLabStore((s) => s.isRunning)
  const setRunning = useLabStore((s) => s.setRunning)
  const setCurrentNode = useLabStore((s) => s.setCurrentNode)
  const currentNodeId = useLabStore((s) => s.currentNodeId)
  const events = useLabStore((s) => s.events)
  const clearEvents = useLabStore((s) => s.clearEvents)

  useEffect(() => {
    attachEventBus()
  }, [])

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const isLoop = params.sourceHandle === "loop-out" && params.targetHandle === "loop-in"
      const styled: Edge = isLoop
        ? {
            ...(params as Edge),
            animated: true,
            type: "smoothstep",
            label: "↺ loop",
            labelStyle: { fill: "#f43f5e", fontWeight: 600, fontSize: 11 },
            labelBgStyle: { fill: "#0a0a0a", fillOpacity: 0.85 },
            style: { stroke: "#f43f5e", strokeDasharray: "6 4", strokeWidth: 2 },
            pathOptions: { offset: 60, borderRadius: 16 },
          }
        : { ...(params as Edge), animated: true, style: { stroke: "#a4c639" } }
      setEdges((eds) => addEdge(styled, eds))
    },
    [setEdges],
  )

  const onEdgeDoubleClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id))
    },
    [setEdges],
  )

  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setNodes((nds) => nds.filter((n) => n.id !== node.id))
      setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id))
    },
    [setNodes, setEdges],
  )

  const addNode = (type: NodeType, label: string) => {
    const id = `n-${type}-${nanoid(4)}`
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: "agent",
        position: { x: 200 + Math.random() * 300, y: 80 + Math.random() * 200 },
        data: { label, nodeType: type },
      },
    ])
  }

  const onRun = async () => {
    if (isRunning) return
    setRunning(true)
    clearEvents()
    const graphNodes: GraphNode[] = nodes.map((n) => ({
      id: n.id,
      type: n.data.nodeType as NodeType,
      label: n.data.label as string,
    }))
    const graphEdges: GraphEdge[] = edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      kind: e.sourceHandle === "loop-out" ? "loop" : "forward",
    }))
    await runGraph(graphNodes, graphEdges, query, {
      stepDelayMs: 350,
      onNodeStart: (id) => setCurrentNode(id),
      onNodeEnd: () => setCurrentNode(null),
    })
    setCurrentNode(null)
    setRunning(false)
  }

  const loadPreset = (preset: Preset) => {
    setPresetId(preset.id)
    setNodes(preset.nodes)
    setEdges(preset.edges)
    clearEvents()
    setCurrentNode(null)
    requestAnimationFrame(() => fitView({ padding: 0.15, duration: 400 }))
  }

  const reset = () => {
    const current = PRESETS.find((p) => p.id === presetId) ?? DEFAULT_PRESET
    loadPreset(current)
  }

  const clearCanvas = () => {
    setPresetId("blank")
    setNodes([])
    setEdges([])
    clearEvents()
  }

  const state = useMemo(() => {
    const currentNode = nodes.find((n) => n.id === currentNodeId)
    const lastEvent = events[events.length - 1]
    const nodesTouched = new Set(events.map((e) => e.nodeId))
    const status: "idle" | "running" | "done" =
      isRunning ? "running" : events.length === 0 ? "idle" : "done"
    const currentStep = currentNode
      ? `${(currentNode.data.label as string) ?? currentNodeId} [${currentNode.data.nodeType as string}]`
      : null

    const labelById = new Map(nodes.map((n) => [n.id, n.data.label as string]))
    const visited: string[] = []
    const seenStart = new Set<string>()
    let stepIdx = 0
    for (const ev of events) {
      if (ev.message.endsWith(" started") && !seenStart.has(ev.id)) {
        seenStart.add(ev.id)
        stepIdx += 1
        const label = labelById.get(ev.nodeId) ?? ev.nodeId
        visited.push(`${stepIdx}. ${label}`)
      }
    }
    if (currentNode && isRunning && visited.length === 0) {
      visited.push(`1. ${currentNode.data.label as string}`)
    }

    return {
      status,
      currentStep,
      stepsRun: `${nodesTouched.size} of ${nodes.length}`,
      elapsedMs: lastEvent?.tStartMs ?? 0,
      lastEvent: lastEvent ? `[${lastEvent.tStartMs}ms] ${lastEvent.message}` : null,
      path: visited,
      query,
      nodeCount: nodes.length,
      edgeCount: edges.length,
    }
  }, [query, nodes, edges.length, events, currentNodeId, isRunning])

  return (
    <section className="space-y-4">
      <header>
        <div className="font-mono-tech text-[10px] tracking-[0.3em] text-lime-500/70 mb-1">
          // LANGGRAPH-STYLE CANVAS
        </div>
        <h1 className="text-2xl font-bold acid-glow mb-1">Agent Graph Builder</h1>
        <p className="text-sm text-gray-400">
          Drop nodes, wire them up, hit Run. Each executed node pulses live.
        </p>
      </header>

      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <button className="group w-full flex items-center justify-between px-4 py-3 border border-lime-900/40 rounded-sm bg-lime-950/20 hover:bg-lime-900/20 transition-colors">
            <span className="flex items-center gap-2 text-sm text-lime-300">
              <Info className="h-4 w-4" />
              <span className="uppercase tracking-wider">How it works</span>
            </span>
            <ChevronDown className="h-4 w-4 text-lime-400 transition-transform group-data-[state=closed]:-rotate-90" />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="border border-t-0 border-lime-900/40 rounded-b-sm bg-black/60 p-4 space-y-3 text-sm text-gray-300">
          <p>
            Each node is one step in an agent pipeline. The executor starts at <span className="text-lime-300">Input</span>,
            runs that node, then follows the <em>first outgoing edge</em> to the next one — so the way you connect nodes is the way the
            graph runs.
          </p>
          <ol className="list-decimal list-inside space-y-1 marker:text-lime-400">
            <li>
              <span className="text-lime-300">Add a node</span> — click any button in the left sidebar. Hover a button to see what
              the node does and when to use it.
            </li>
            <li>
              <span className="text-lime-300">Connect nodes</span> — drag from the small lime dot on the right of a node to the lime
              dot on the left of another.
            </li>
            <li>
              <span className="text-lime-300">Set the query</span> — type your question in the field below.
            </li>
            <li>
              <span className="text-lime-300">Run</span> — every executed node pulses, every step shows up in the Tracing panel.
            </li>
            <li>
              <span className="text-lime-300">Remove</span> — double-click any node or edge to delete it. Or click to select, then press{" "}
              <kbd className="px-1 py-0.5 text-[10px] border border-lime-900/60 rounded-sm bg-black/60">Backspace</kbd> /{" "}
              <kbd className="px-1 py-0.5 text-[10px] border border-lime-900/60 rounded-sm bg-black/60">Delete</kbd>.
            </li>
          </ol>
          <div className="pt-2 border-t border-lime-900/30 text-xs text-gray-400">
            <span className="text-lime-300">Try this:</span> the starter graph is a classic RAG flow — Input → Retriever → Prompt → LLM
            → Output. Drop a <span className="text-rose-300">Reflection</span> between LLM and Output, or swap Retriever for a{" "}
            <span className="text-blue-300">Tool</span> to see how the trace changes.
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Query for this run…"
          className="bg-black/60 border-lime-900/50 text-gray-200"
        />
        <div className="flex gap-2">
          <Button onClick={onRun} disabled={isRunning} className="bg-lime-900/70 hover:bg-lime-800 text-gray-100">
            <Play className="h-4 w-4 mr-2" />
            Run graph
          </Button>
          <Button onClick={reset} variant="outline" className="border-lime-800 hover:bg-lime-900/30 hover:text-lime-300">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={clearCanvas} variant="outline" className="border-red-900/60 text-red-300 hover:bg-red-900/20">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase tracking-wider text-lime-300">Presets</span>
          <span className="text-[10px] text-gray-500">load a starter graph to see common patterns</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const active = p.id === presetId
            return (
              <button
                key={p.id}
                onClick={() => loadPreset(p)}
                title={p.description}
                className={`text-xs px-3 py-1.5 rounded-sm border transition-all duration-200 ${
                  active
                    ? "bg-lime-900/40 border-lime-500 text-lime-200"
                    : "bg-black/60 border-lime-900/40 text-gray-300 hover:border-lime-700 hover:text-lime-200"
                }`}
              >
                {p.label}
              </button>
            )
          })}
        </div>
        {(() => {
          const current = PRESETS.find((p) => p.id === presetId)
          if (!current) return null
          return (
            <div className="mt-2 space-y-1.5">
              <p className="text-xs text-gray-400 italic">{current.description}</p>
              {current.useCases && current.useCases.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-lime-300 mr-1">Use cases</span>
                  {current.useCases.map((uc) => (
                    <span
                      key={uc}
                      className="text-[11px] px-2 py-0.5 rounded-sm border border-lime-900/50 bg-black/60 text-gray-300"
                    >
                      {uc}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })()}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 border border-lime-900/40 rounded-sm bg-gray-950/60 px-3 py-2">
        <span className="text-lime-300 uppercase tracking-wider text-[10px]">Shortcuts</span>
        <span><kbd className="px-1.5 py-0.5 mr-1 text-[10px] border border-lime-900/60 rounded-sm bg-black/60">drag</kbd>node to move</span>
        <span><kbd className="px-1.5 py-0.5 mr-1 text-[10px] border border-lime-900/60 rounded-sm bg-black/60">drag</kbd>lime dot → lime dot (forward) · rose dot → rose dot (loop back)</span>
        <span><kbd className="px-1.5 py-0.5 mr-1 text-[10px] border border-lime-900/60 rounded-sm bg-black/60">double-click</kbd>node or edge to delete</span>
        <span>
          click then{" "}
          <kbd className="px-1.5 py-0.5 mx-1 text-[10px] border border-lime-900/60 rounded-sm bg-black/60">Backspace</kbd>or
          <kbd className="px-1.5 py-0.5 mx-1 text-[10px] border border-lime-900/60 rounded-sm bg-black/60">Delete</kbd>
        </span>
        <span><kbd className="px-1.5 py-0.5 mr-1 text-[10px] border border-lime-900/60 rounded-sm bg-black/60">scroll</kbd>to zoom</span>
        <span><kbd className="px-1.5 py-0.5 mr-1 text-[10px] border border-lime-900/60 rounded-sm bg-black/60">drag</kbd>empty space to pan</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-4">
        <aside className="border border-lime-900/40 rounded-sm bg-black/60 p-3 space-y-1 max-h-[520px] overflow-y-auto overflow-x-visible relative">
          <div className="text-xs uppercase tracking-wider text-lime-300 mb-1">Nodes</div>
          <div className="text-[10px] text-gray-500 mb-2">hover for details</div>
          {NODE_TYPES.map((n) => {
            const textColor = n.color.split(" ").find((c) => c.startsWith("text-")) ?? "text-gray-200"
            return (
              <div key={n.type} className="group relative">
                <button
                  onClick={() => addNode(n.type, n.label)}
                  title={`${n.description}\n\nWhen to use: ${n.whenToUse}`}
                  className={`w-full text-left px-2 py-1.5 text-xs border rounded-sm bg-black/60 hover:bg-lime-900/20 transition-colors ${n.color}`}
                >
                  + {n.label}
                </button>
                <div
                  className="pointer-events-none absolute left-full top-0 ml-2 w-72 p-3 bg-black border border-lime-900/60 rounded-sm shadow-lg text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50"
                  role="tooltip"
                >
                  <div className={`text-sm font-semibold mb-1 ${textColor}`}>{n.label}</div>
                  <p className="text-xs text-gray-300 mb-2">{n.description}</p>
                  <p className="text-xs text-gray-400">
                    <span className="text-lime-300">When to use: </span>
                    {n.whenToUse}
                  </p>
                </div>
              </div>
            )
          })}
        </aside>

        <div className="border border-lime-900/40 rounded-sm bg-black/60 h-[520px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeDoubleClick={onEdgeDoubleClick}
            onNodeDoubleClick={onNodeDoubleClick}
            deleteKeyCode={["Backspace", "Delete"]}
            nodeTypes={nodeTypesMap}
            fitView
            proOptions={{ hideAttribution: true }}
            className="bg-black"
          >
            <Background gap={16} color="#1f2937" />
            <Controls className="!bg-black/80 !border !border-lime-900/40" />
          </ReactFlow>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TracingTimeline />
        <StateViewer title="Graph state" state={state} />
      </div>
    </section>
  )
}

export default function AgentBuilder() {
  return (
    <ReactFlowProvider>
      <BuilderInner />
    </ReactFlowProvider>
  )
}
