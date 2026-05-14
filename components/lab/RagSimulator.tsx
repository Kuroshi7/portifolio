"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Scissors, Database, ArrowDownNarrowWide, FileText, Sparkles, Play, RotateCcw, StepForward } from "lucide-react"
import { useLabStore, attachEventBus, type RagStep } from "@/stores/labStore"
import { eventBus } from "@/core/engine/eventBus"
import { retrieve, rank, buildPrompt } from "@/core/engine/simulators/retriever"
import { templateLLM } from "@/core/engine/simulators/llmStub"
import { chunkText } from "@/core/engine/simulators/chunker"
import PipelineStepIndicator, { type PipelineStep } from "./PipelineStepIndicator"
import TracingTimeline from "./TracingTimeline"
import StateViewer from "./StateViewer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const STEPS: PipelineStep[] = [
  { id: "input", label: "Input", Icon: Search },
  { id: "chunking", label: "Chunking", Icon: Scissors },
  { id: "retrieval", label: "Retrieval", Icon: Database },
  { id: "ranking", label: "Ranking", Icon: ArrowDownNarrowWide },
  { id: "prompt", label: "Prompt", Icon: FileText },
  { id: "response", label: "Response", Icon: Sparkles },
]

const ORDER: RagStep[] = ["input", "chunking", "retrieval", "ranking", "prompt", "response", "done"]

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export default function RagSimulator() {
  const query = useLabStore((s) => s.query)
  const setQuery = useLabStore((s) => s.setQuery)
  const step = useLabStore((s) => s.step)
  const setStep = useLabStore((s) => s.setStep)
  const retrieved = useLabStore((s) => s.retrieved)
  const setRetrieved = useLabStore((s) => s.setRetrieved)
  const prompt = useLabStore((s) => s.prompt)
  const setPrompt = useLabStore((s) => s.setPrompt)
  const response = useLabStore((s) => s.response)
  const setResponse = useLabStore((s) => s.setResponse)
  const resetRun = useLabStore((s) => s.resetRun)
  const [autorun, setAutorun] = useState(false)

  useEffect(() => {
    attachEventBus()
  }, [])

  const completedIds = useMemo(() => {
    const idx = ORDER.indexOf(step)
    const set = new Set<string>()
    if (idx > 0) for (let i = 0; i < idx; i++) set.add(ORDER[i])
    return set
  }, [step])

  const activeId = step === "idle" || step === "done" ? null : step

  const doStep = async (next: RagStep) => {
    setStep(next)
    switch (next) {
      case "input":
        eventBus.emit("input", "input", `Query received: "${query}"`, "success")
        break
      case "chunking": {
        const chunks = chunkText(query, { strategy: "sentence", chunkSize: 200, overlap: 40 })
        eventBus.emit("chunker", "chunker", `Query chunked into ${chunks.length} piece(s)`, "success", { count: chunks.length })
        break
      }
      case "retrieval": {
        const results = retrieve(query, { topK: 3 })
        setRetrieved(results)
        eventBus.emit(
          "retriever",
          "retriever",
          `Retrieved ${results.length} chunk(s) (top score ${results[0]?.score.toFixed(3) ?? "n/a"})`,
          "success",
          { docs: results.map((r) => r.doc.id) },
        )
        break
      }
      case "ranking": {
        const ranked = rank(retrieved)
        setRetrieved(ranked)
        eventBus.emit("ranker", "ranker", `Ranked ${ranked.length} chunk(s) by score`, "success")
        break
      }
      case "prompt": {
        const p = buildPrompt(query, retrieved)
        setPrompt(p)
        eventBus.emit("prompt", "prompt", `Assembled prompt (${p.length} chars)`, "success", { length: p.length })
        break
      }
      case "response": {
        const out = await templateLLM.complete(prompt, {
          startedAt: Date.now(),
          query,
          retrieved,
          prompt,
          response: "",
          scratch: {},
        })
        setResponse(out)
        eventBus.emit("llm", "llm", "LLM responded", "success")
        break
      }
      case "done":
        break
    }
  }

  const advance = async () => {
    const idx = ORDER.indexOf(step)
    if (idx < ORDER.length - 1) await doStep(ORDER[idx + 1])
  }

  const reset = () => {
    resetRun()
    setAutorun(false)
  }

  useEffect(() => {
    if (!autorun) return
    let cancelled = false
    const run = async () => {
      while (!cancelled) {
        const s = useLabStore.getState().step
        const idx = ORDER.indexOf(s)
        if (idx >= ORDER.length - 1) {
          setAutorun(false)
          return
        }
        await doStep(ORDER[idx + 1])
        await sleep(600)
      }
    }
    run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autorun])

  const startAutorun = () => {
    resetRun()
    setAutorun(true)
  }

  const state = {
    query,
    step,
    retrievedCount: retrieved.length,
    topDoc: retrieved[0]?.doc.title ?? null,
    topScore: retrieved[0]?.score ?? null,
    promptChars: prompt.length,
    response: response || null,
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#a4c639] text-shadow-neon mb-1">RAG Simulator</h1>
        <p className="text-sm text-gray-400">
          Step through the full Retrieval-Augmented Generation pipeline. Watch each stage light up.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question…"
          className="bg-black/60 border-lime-900/50 text-gray-200"
        />
        <div className="flex gap-2">
          <Button onClick={advance} disabled={autorun || step === "done"} className="bg-lime-900/70 hover:bg-lime-800 text-gray-100">
            <StepForward className="h-4 w-4 mr-2" />
            Step
          </Button>
          <Button onClick={startAutorun} disabled={autorun} variant="outline" className="border-lime-800 hover:bg-lime-900/30 hover:text-lime-300">
            <Play className="h-4 w-4 mr-2" />
            Auto-run
          </Button>
          <Button onClick={reset} variant="outline" className="border-lime-800 hover:bg-lime-900/30 hover:text-lime-300">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="border border-lime-900/40 rounded-sm bg-black/60 p-4">
        <PipelineStepIndicator steps={STEPS} activeId={activeId} completedIds={completedIds} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TracingTimeline />
        <StateViewer title="Pipeline state" state={state} />
      </div>

      {retrieved.length > 0 && (
        <div className="border border-lime-900/40 rounded-sm bg-black/60 p-4">
          <h2 className="text-xs uppercase tracking-wider text-lime-300 mb-3">Retrieved chunks</h2>
          <ul className="space-y-2">
            {retrieved.map((r, i) => (
              <li key={i} className="text-sm">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <span className="px-1.5 py-0.5 rounded-sm bg-lime-900/40 text-lime-300 font-mono">
                    {r.score.toFixed(3)}
                  </span>
                  <span className="text-lime-200">{r.doc.title}</span>
                </div>
                <p className="text-gray-300">{r.chunk.text.trim()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {response && (
        <div className="border border-lime-700/60 rounded-sm bg-lime-950/30 p-4">
          <h2 className="text-xs uppercase tracking-wider text-lime-300 mb-2">Response</h2>
          <p className="text-gray-100">{response}</p>
        </div>
      )}
    </section>
  )
}
