"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useLabStore } from "@/stores/labStore"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ChunkStrategy } from "@/core/engine/types"

const CHUNK_COLORS = [
  "bg-lime-900/40 border-lime-500/60 text-lime-100",
  "bg-cyan-900/40 border-cyan-500/60 text-cyan-100",
  "bg-fuchsia-900/40 border-fuchsia-500/60 text-fuchsia-100",
  "bg-amber-900/40 border-amber-500/60 text-amber-100",
  "bg-emerald-900/40 border-emerald-500/60 text-emerald-100",
  "bg-rose-900/40 border-rose-500/60 text-rose-100",
]

export default function ChunkingPlayground() {
  const input = useLabStore((s) => s.input)
  const strategy = useLabStore((s) => s.strategy)
  const chunkSize = useLabStore((s) => s.chunkSize)
  const overlap = useLabStore((s) => s.overlap)
  const chunks = useLabStore((s) => s.chunks)
  const setInput = useLabStore((s) => s.setInput)
  const setStrategy = useLabStore((s) => s.setStrategy)
  const setChunkSize = useLabStore((s) => s.setChunkSize)
  const setOverlap = useLabStore((s) => s.setOverlap)

  const totalChars = chunks.reduce((acc, c) => acc + c.text.length, 0)
  const avg = chunks.length ? Math.round(totalChars / chunks.length) : 0

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[#a4c639] text-shadow-neon mb-1">Chunking Playground</h1>
        <p className="text-sm text-gray-400">
          Paste text, pick a strategy, drag the sliders. See chunks reflow live.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-lime-300 mb-2 block">Input</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[240px] bg-black/60 border-lime-900/50 text-gray-200 font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-lime-300 mb-2 block">Strategy</label>
              <Select value={strategy} onValueChange={(v) => setStrategy(v as ChunkStrategy)}>
                <SelectTrigger className="bg-black/60 border-lime-900/50 text-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-950 border-lime-900/50 text-gray-200">
                  <SelectItem value="fixed-char">Fixed (chars)</SelectItem>
                  <SelectItem value="fixed-token">Fixed (tokens)</SelectItem>
                  <SelectItem value="sentence">Sentence-aware</SelectItem>
                  <SelectItem value="paragraph">Paragraph</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="uppercase tracking-wider text-lime-300">Chunk size</span>
                  <span className="text-gray-400">{chunkSize}</span>
                </div>
                <Slider
                  value={[chunkSize]}
                  onValueChange={([v]) => setChunkSize(v)}
                  min={40}
                  max={600}
                  step={10}
                  disabled={strategy === "paragraph"}
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="uppercase tracking-wider text-lime-300">Overlap</span>
                  <span className="text-gray-400">{overlap}</span>
                </div>
                <Slider
                  value={[overlap]}
                  onValueChange={([v]) => setOverlap(v)}
                  min={0}
                  max={Math.max(0, Math.floor(chunkSize / 2))}
                  step={5}
                  disabled={strategy === "paragraph"}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-gray-400 border-t border-lime-900/20 pt-3">
            <span>
              chunks: <span className="text-lime-300 font-mono">{chunks.length}</span>
            </span>
            <span>
              avg size: <span className="text-lime-300 font-mono">{avg}</span>
            </span>
            <span>
              total chars: <span className="text-lime-300 font-mono">{totalChars}</span>
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-lime-300 mb-2 block">Chunks</label>
          <div className="border border-lime-900/40 rounded-sm bg-black/60 p-3 min-h-[400px] max-h-[600px] overflow-y-auto">
            <AnimatePresence mode="popLayout">
              <motion.div layout className="flex flex-col gap-2">
                {chunks.map((chunk, i) => (
                  <motion.div
                    key={chunk.id + "-" + chunk.start + "-" + chunk.end}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className={`border rounded-sm p-2 font-mono text-xs whitespace-pre-wrap ${
                      CHUNK_COLORS[i % CHUNK_COLORS.length]
                    }`}
                  >
                    <div className="text-[10px] opacity-70 mb-1">
                      #{i} · [{chunk.start}–{chunk.end}] · {chunk.text.length} chars
                    </div>
                    {chunk.text}
                  </motion.div>
                ))}
                {chunks.length === 0 && (
                  <div className="text-gray-600 italic text-sm">No chunks yet — type something.</div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
