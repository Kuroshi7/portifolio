"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Scissors, Database, ArrowDownNarrowWide, FileText, Sparkles, Play, RotateCcw, StepForward } from "lucide-react"
import { useLabStore, attachEventBus, type RagStep } from "@/stores/labStore"
import { eventBus } from "@/core/engine/eventBus"
import { retrieve, rank, buildPrompt } from "@/core/engine/simulators/retriever"
import { templateLLM } from "@/core/engine/simulators/llmStub"
import { chunkText } from "@/core/engine/simulators/chunker"
import { CORPUS } from "@/core/engine/fixtures/corpus"
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

// Plain-language explanation of what each stage is doing — the educational core.
const STEP_INFO: Record<string, { title: string; text: string }> = {
  idle: {
    title: "Ready",
    text: "RAG = Retrieval-Augmented Generation. Instead of answering from memory, the model first retrieves relevant passages from a knowledge base, then answers using only those. Press Step to walk through it, or Auto-run to watch it flow.",
  },
  input: {
    title: "1 · Input",
    text: "Your question enters the pipeline. The model will never see the whole knowledge base — only the chunks the retriever pulls for this exact query. Garbage query in, garbage context out.",
  },
  chunking: {
    title: "2 · Chunking",
    text: "At index time every document is pre-split into small passages, so the retriever can match at the sentence level instead of whole documents. Those chunks are what we search over.",
  },
  retrieval: {
    title: "3 · Retrieval",
    text: "Every chunk is scored against your query with a hybrid of lexical overlap (shared words) + semantic similarity. The best few are pulled. The matched terms below show exactly why each chunk was chosen.",
  },
  ranking: {
    title: "4 · Ranking",
    text: "Retrieved chunks are re-ordered best-first. Production systems often add a heavier cross-encoder reranker here; we just sort by the blended score.",
  },
  prompt: {
    title: "5 · Prompt assembly",
    text: "The winning chunks are stitched into the prompt as context, wrapped around your question. This injection is the 'Augmented' in Retrieval-Augmented Generation.",
  },
  response: {
    title: "6 · Generation",
    text: "The model answers using only the injected context. Strong retrieval → a grounded, traceable answer. Weak retrieval → it should refuse instead of hallucinating.",
  },
  done: {
    title: "Done",
    text: "That's one full RAG pass. Notice the answer traces straight back to the retrieved chunks — change the query and watch which chunks (and which answer) change.",
  },
}

const EXAMPLES = [
  "What is retrieval augmented generation?",
  "How does chunking improve recall?",
  "LangChain vs LangGraph?",
  "How do I cook carbonara?",
  "What's the weather in Tokyo?",
]

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

  // How many chunks the retriever searches over (corpus is pre-chunked at index time).
  const corpusChunkCount = useMemo(
    () =>
      CORPUS.reduce(
        (n, doc) => n + chunkText(doc.text, { strategy: "sentence", chunkSize: 220, overlap: 40 }).length,
        0,
      ),
    [],
  )

  const completedIds = useMemo(() => {
    const idx = ORDER.indexOf(step)
    const set = new Set<string>()
    if (idx > 0) for (let i = 0; i < idx; i++) set.add(ORDER[i])
    return set
  }, [step])

  const activeId = step === "idle" || step === "done" ? null : step

  // IMPORTANT: read the latest values from the store (getState) rather than the
  // closed-over selector values. During Auto-run the loop's closure would otherwise
  // capture stale `retrieved`/`prompt` (=[] right after reset) and the LLM would always
  // report "no context". getState() always returns what the previous step just wrote.
  const doStep = async (next: RagStep) => {
    setStep(next)
    const q = useLabStore.getState().query
    switch (next) {
      case "input":
        eventBus.emit("input", "input", `Query received: "${q}"`, "success")
        break
      case "chunking": {
        eventBus.emit(
          "chunker",
          "chunker",
          `Knowledge base: ${CORPUS.length} docs → ${corpusChunkCount} searchable chunks`,
          "success",
          { docs: CORPUS.length, chunks: corpusChunkCount },
        )
        break
      }
      case "retrieval": {
        const results = retrieve(q, { topK: 3 })
        setRetrieved(results)
        const topScore = results[0]?.score.toFixed(3) ?? "n/a"
        eventBus.emit(
          "retriever",
          "retriever",
          `Retrieved ${results.length} chunk(s) · top score ${topScore}`,
          results[0] && results[0].score >= 0.35 ? "success" : "warn",
          { docs: results.map((r) => r.doc.id) },
        )
        break
      }
      case "ranking": {
        const ranked = rank(useLabStore.getState().retrieved)
        setRetrieved(ranked)
        eventBus.emit("ranker", "ranker", `Ranked ${ranked.length} chunk(s) best-first`, "success")
        break
      }
      case "prompt": {
        const p = buildPrompt(q, useLabStore.getState().retrieved)
        setPrompt(p)
        eventBus.emit("prompt", "prompt", `Assembled prompt (${p.length} chars)`, "success", { length: p.length })
        break
      }
      case "response": {
        const s = useLabStore.getState()
        const out = await templateLLM.complete(s.prompt, {
          startedAt: Date.now(),
          query: s.query,
          retrieved: s.retrieved,
          prompt: s.prompt,
          response: "",
          scratch: {},
        })
        setResponse(out)
        const grounded = (s.retrieved[0]?.score ?? 0) >= 0.35
        eventBus.emit("llm", "llm", grounded ? "LLM answered from context" : "LLM refused — weak retrieval", grounded ? "success" : "warn")
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
        await sleep(700)
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

  const runExample = (ex: string) => {
    resetRun()
    setAutorun(false)
    setQuery(ex)
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

  const info = STEP_INFO[step] ?? STEP_INFO.idle
  const weakTop = retrieved.length > 0 && (retrieved[0]?.score ?? 0) < 0.35

  return (
    <section className="space-y-6">
      <header>
        <div className="font-mono-tech text-[10px] tracking-[0.3em] text-lime-500/70 mb-1">
          // RETRIEVAL-AUGMENTED GENERATION
        </div>
        <h1 className="text-2xl font-bold acid-glow mb-1">RAG Simulator</h1>
        <p className="text-sm text-gray-400">
          Walk a question through the full RAG pipeline — retrieve, rank, augment, generate — and see
          exactly why each chunk was picked and how it shapes the answer.
        </p>
      </header>

      {/* Live explanation of the current stage */}
      <div className="clip-notch border border-lime-900/40 bg-lime-950/10 p-4">
        <div className="font-mono-tech text-xs tracking-wider text-lime-300 mb-1">{info.title}</div>
        <p className="text-sm text-gray-300 leading-relaxed">{info.text}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question…"
          className="bg-black/60 border-lime-900/50 text-gray-200 font-mono-tech"
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

      {/* Example queries */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono-tech text-[10px] uppercase tracking-wider text-gray-500">Try</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => runExample(ex)}
            className="font-mono-tech text-[11px] px-2.5 py-1 rounded-sm border border-lime-900/50 bg-black/50 text-gray-300 hover:border-lime-600 hover:text-lime-200 transition-colors"
          >
            {ex}
          </button>
        ))}
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
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs uppercase tracking-wider text-lime-300">Retrieved chunks</h2>
            <span className="font-mono-tech text-[10px] text-gray-500">score = 0.7·lexical + 0.3·semantic</span>
          </div>
          <ul className="space-y-3">
            {retrieved.map((r, i) => (
              <li key={i} className="clip-notch border border-lime-900/30 bg-gray-950/50 p-3">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="font-mono-tech text-[10px] text-gray-600">#{i + 1}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-sm font-mono-tech text-xs ${
                      r.score >= 0.35 ? "bg-lime-900/40 text-lime-300" : "bg-yellow-900/40 text-yellow-300"
                    }`}
                  >
                    {r.score.toFixed(3)}
                  </span>
                  <span className="text-lime-200 text-sm">{r.doc.title}</span>
                  {typeof r.lexical === "number" && (
                    <span className="font-mono-tech text-[10px] text-gray-500">
                      lex {r.lexical.toFixed(2)} · sem {(r.semantic ?? 0).toFixed(2)}
                    </span>
                  )}
                </div>
                {r.matchedTerms && r.matchedTerms.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                    <span className="font-mono-tech text-[10px] text-gray-500">matched:</span>
                    {r.matchedTerms.map((t) => (
                      <span key={t} className="font-mono-tech text-[10px] px-1.5 py-0.5 rounded-sm bg-lime-900/30 text-lime-300 border border-lime-800/50">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="font-mono-tech text-[10px] text-yellow-500/80 mb-1.5">no shared words — matched on semantic similarity only</div>
                )}
                <p className="text-gray-300 text-sm">{r.chunk.text.trim()}</p>
              </li>
            ))}
          </ul>
          {weakTop && (
            <p className="mt-3 font-mono-tech text-[11px] text-yellow-400/90">
              ⚠ Top score is below the 0.35 trust threshold — the retriever found nothing clearly relevant. Watch the model refuse instead of guess.
            </p>
          )}
        </div>
      )}

      {prompt && (
        <div className="border border-lime-900/40 rounded-sm bg-black/60 p-4">
          <h2 className="text-xs uppercase tracking-wider text-lime-300 mb-2">Assembled prompt <span className="text-gray-600 normal-case">— context + question sent to the model</span></h2>
          <pre className="font-mono-tech text-[11px] text-gray-300 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">{prompt}</pre>
        </div>
      )}

      {response && (
        <div className={`clip-notch border p-4 ${weakTop ? "border-yellow-700/60 bg-yellow-950/20" : "border-lime-700/60 bg-lime-950/30"}`}>
          <h2 className="text-xs uppercase tracking-wider text-lime-300 mb-2">Response</h2>
          <p className="text-gray-100 whitespace-pre-line leading-relaxed">{response}</p>
        </div>
      )}
    </section>
  )
}
