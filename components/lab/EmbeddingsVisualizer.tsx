"use client"

import { useMemo, useState } from "react"
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts"
import { X, Plus } from "lucide-react"
import { useLabStore } from "@/stores/labStore"
import { embed } from "@/core/engine/simulators/embedder"
import { cosineSimilarity } from "@/core/engine/fixtures/embeddings"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const CLUSTER_COLOR: Record<string, string> = {
  tech: "#a4c639",
  food: "#fbbf24",
  emotion: "#f472b6",
  nature: "#34d399",
  music: "#a78bfa",
  finance: "#60a5fa",
  sport: "#fb7185",
  travel: "#22d3ee",
}

export default function EmbeddingsVisualizer() {
  const phrases = useLabStore((s) => s.phrases)
  const addPhrase = useLabStore((s) => s.addPhrase)
  const removePhrase = useLabStore((s) => s.removePhrase)
  const [draft, setDraft] = useState("")

  const points = useMemo(
    () =>
      phrases.map((phrase) => {
        const v = embed(phrase)
        return { phrase, x: v.x, y: v.y, cluster: v.cluster, source: v.source }
      }),
    [phrases],
  )

  const matrix = useMemo(() => {
    return points.map((row) =>
      points.map((col) => cosineSimilarity(embed(row.phrase), embed(col.phrase))),
    )
  }, [points])

  const submit = () => {
    const v = draft.trim()
    if (!v) return
    addPhrase(v.toLowerCase())
    setDraft("")
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#a4c639] text-shadow-neon mb-1">Embeddings Visualizer</h1>
        <p className="text-sm text-gray-400">
          Each phrase is mapped to a 2D vector. Semantically similar phrases cluster together.
          Try adding <span className="text-lime-300">crypto</span>, <span className="text-lime-300">sushi</span>, or any word.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="add a phrase…"
              className="bg-black/60 border-lime-900/50 text-gray-200"
            />
            <Button onClick={submit} variant="outline" size="icon" className="border-lime-800 hover:bg-lime-900/30 hover:text-lime-300">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <ul className="border border-lime-900/40 rounded-sm bg-black/60 p-2 max-h-[260px] overflow-y-auto space-y-1">
            {phrases.length === 0 && <li className="text-gray-600 italic text-sm">No phrases — add some.</li>}
            {phrases.map((p) => {
              const v = embed(p)
              const sourceTag =
                v.source === "index"
                  ? { text: "exact", title: "Found directly in the pre-baked dictionary.", className: "text-lime-300/80" }
                  : v.source === "keyword"
                  ? { text: "by keyword", title: "Cluster guessed via keyword match — the position is approximate.", className: "text-yellow-300/80" }
                  : { text: "guess", title: "No keyword matched — cluster picked by hash. The simulator is guessing.", className: "text-rose-300/80" }
              return (
                <li key={p} className="flex items-center justify-between text-sm group">
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: CLUSTER_COLOR[v.cluster] ?? "#999" }}
                    />
                    <span className="text-gray-200 truncate">{p}</span>
                    <span className="text-gray-600 text-xs">{v.cluster}</span>
                    <span title={sourceTag.title} className={`text-[10px] uppercase tracking-wider ${sourceTag.className}`}>
                      {sourceTag.text}
                    </span>
                  </span>
                  <button
                    onClick={() => removePhrase(p)}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity shrink-0"
                    aria-label={`remove ${p}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="text-[11px] text-gray-500 leading-relaxed border-t border-lime-900/30 pt-2 mt-2">
            No real embedding model runs here. Phrases are matched against a small dictionary, then a keyword list, then a deterministic hash. Words tagged{" "}
            <span className="text-rose-300/80 uppercase tracking-wider">guess</span> fell through all checks — the cluster is essentially random.
          </div>
        </div>

        <div className="border border-lime-900/40 rounded-sm bg-black/60 p-3 h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <XAxis type="number" dataKey="x" domain={[-1, 1]} tick={{ fill: "#666", fontSize: 11 }} axisLine={{ stroke: "#333" }} tickLine={{ stroke: "#333" }} />
              <YAxis type="number" dataKey="y" domain={[-1, 1]} tick={{ fill: "#666", fontSize: 11 }} axisLine={{ stroke: "#333" }} tickLine={{ stroke: "#333" }} />
              <ZAxis range={[120, 120]} />
              <ReferenceLine x={0} stroke="#222" />
              <ReferenceLine y={0} stroke="#222" />
              <Tooltip
                cursor={{ stroke: "#a4c639", strokeOpacity: 0.3 }}
                contentStyle={{ background: "#0a0a0a", border: "1px solid #3f3f0f", borderRadius: 2, fontSize: 12 }}
                labelStyle={{ color: "#a4c639" }}
                formatter={(v: unknown, name: string) => [String(v), name]}
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null
                  const d = payload[0].payload as { phrase: string; cluster: string; x: number; y: number }
                  return (
                    <div className="bg-black border border-lime-900/60 px-2 py-1 text-xs font-mono">
                      <div className="text-lime-300">{d.phrase}</div>
                      <div className="text-gray-500">cluster: {d.cluster}</div>
                      <div className="text-gray-500">
                        ({d.x.toFixed(2)}, {d.y.toFixed(2)})
                      </div>
                    </div>
                  )
                }}
              />
              <Scatter
                data={points}
                shape={(props: any) => {
                  const { cx, cy, payload } = props
                  const color = CLUSTER_COLOR[payload.cluster] ?? "#999"
                  return (
                    <g>
                      <circle cx={cx} cy={cy} r={6} fill={color} stroke="#000" strokeWidth={1.5} />
                      <text x={cx + 9} y={cy + 3} fill="#d1d5db" fontSize={11} fontFamily="monospace">
                        {payload.phrase}
                      </text>
                    </g>
                  )
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {points.length > 1 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs uppercase tracking-wider text-lime-300">Cosine Similarity Matrix</h2>
            <span className="text-xs text-gray-500">brighter = more similar</span>
          </div>
          <div className="border border-lime-900/40 rounded-sm bg-black/60 p-3 overflow-x-auto">
            <table className="text-xs font-mono">
              <thead>
                <tr>
                  <th className="p-1"></th>
                  {points.map((p) => (
                    <th key={p.phrase} className="p-1 text-gray-400 text-left">
                      {p.phrase}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrix.map((row, i) => (
                  <tr key={i}>
                    <td className="p-1 text-gray-400 pr-3">{points[i].phrase}</td>
                    {row.map((sim, j) => {
                      const intensity = Math.max(0, sim)
                      const alpha = (0.1 + intensity * 0.85).toFixed(2)
                      return (
                        <td
                          key={j}
                          className="p-1 text-center text-gray-200 border border-black/40 tabular-nums"
                          style={{ backgroundColor: `rgba(164, 198, 57, ${alpha})` }}
                          title={`${points[i].phrase} ↔ ${points[j].phrase} = ${sim.toFixed(3)}`}
                        >
                          {sim.toFixed(2)}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}
