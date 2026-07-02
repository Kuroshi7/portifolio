import Link from "next/link"
import { Scissors, Sparkles, Workflow, Network } from "lucide-react"

const modules = [
  {
    href: "/lab/chunking",
    title: "Chunking Playground",
    desc: "Paste any text, change strategy and size, see chunks reflow in real time.",
    Icon: Scissors,
    accent: "from-lime-700/40 to-lime-900/10",
  },
  {
    href: "/lab/embeddings",
    title: "Embeddings Visualizer",
    desc: "Add phrases, watch them land in semantic clusters, inspect cosine similarity.",
    Icon: Sparkles,
    accent: "from-cyan-700/30 to-cyan-900/10",
  },
  {
    href: "/lab/rag",
    title: "RAG Simulator",
    desc: "Step through a full RAG pipeline — chunking, retrieval, ranking, prompt, response — with live tracing.",
    Icon: Workflow,
    accent: "from-purple-700/30 to-purple-900/10",
  },
  {
    href: "/lab/builder",
    title: "Agent Graph Builder",
    desc: "Drag LangGraph-style nodes onto a canvas, connect them, run the graph, watch execution flow.",
    Icon: Network,
    accent: "from-yellow-700/30 to-yellow-900/10",
  },
]

export default function LabOverview() {
  return (
    <section className="relative">
      <div className="absolute inset-0 -z-10 grid-bg-fine mask-fade opacity-40 pointer-events-none" />
      <header className="text-center mb-10">
        <div className="font-mono-tech text-xs tracking-[0.3em] text-lime-500/80 mb-3">
          // INTERACTIVE PLAYGROUND
        </div>
        <h1 className="text-3xl md:text-4xl font-bold acid-glow tracking-wider mb-3">
          AI LAB
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A visual debugger for agentic AI pipelines. No real LLM calls — every step is deterministic and offline,
          so you can <span className="text-lime-300">see</span> how RAG and agent graphs actually work, frame by frame.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map(({ href, title, desc, Icon, accent }, i) => (
          <Link
            key={href}
            href={href}
            className={`group relative clip-notch frame-brackets block p-6 border border-lime-900/40 bg-gradient-to-br ${accent} hover:border-lime-500 transition-all duration-300 hover:-translate-y-1`}
          >
            <span className="absolute top-4 right-5 font-mono-tech text-[11px] tracking-widest text-lime-500/60">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-sm bg-black/50 border border-lime-900/50 group-hover:border-lime-500/60 transition-colors">
                <Icon className="h-6 w-6 text-lime-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-lime-300 mb-1 group-hover:acid-glow transition-all">{title}</h2>
                <p className="text-sm text-gray-400">{desc}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 font-mono-tech text-[11px] text-lime-500/70 opacity-0 group-hover:opacity-100 transition-opacity">
              open module <span aria-hidden>→</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 clip-notch p-5 border border-lime-900/30 bg-gray-950/60 text-sm text-gray-400">
        <p className="mb-2 text-lime-300 font-mono-tech text-xs tracking-wider">// WHY NO REAL LLM?</p>
        <p>
          Real model calls add latency, cost, and noise. The point of the Lab is to <em>see</em> the pipeline,
          not call an API. Every chunker, embedder, retriever and "LLM" here is deterministic and runs entirely in your
          browser. The architecture has a clean swap point — <code className="text-lime-300">LLMSimulator</code> in{" "}
          <code className="text-lime-300">core/engine/types.ts</code> — so a real model can drop in later.
        </p>
      </div>
    </section>
  )
}
