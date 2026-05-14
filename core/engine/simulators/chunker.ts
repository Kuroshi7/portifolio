import type { Chunk, ChunkStrategy } from "../types"

export interface ChunkOptions {
  strategy: ChunkStrategy
  chunkSize: number
  overlap: number
}

export function chunkText(input: string, options: ChunkOptions): Chunk[] {
  const text = input ?? ""
  if (!text.trim()) return []

  switch (options.strategy) {
    case "fixed-char":
      return chunkFixedChar(text, options.chunkSize, options.overlap)
    case "fixed-token":
      return chunkFixedToken(text, options.chunkSize, options.overlap)
    case "sentence":
      return chunkBySentence(text, options.chunkSize, options.overlap)
    case "paragraph":
      return chunkByParagraph(text)
  }
}

function chunkFixedChar(text: string, size: number, overlap: number): Chunk[] {
  const step = Math.max(1, size - overlap)
  const chunks: Chunk[] = []
  let i = 0
  let n = 0
  while (i < text.length) {
    const end = Math.min(i + size, text.length)
    chunks.push({ id: `c-${n}`, text: text.slice(i, end), start: i, end })
    n += 1
    if (end === text.length) break
    i += step
  }
  return chunks
}

function chunkFixedToken(text: string, sizeInTokens: number, overlapTokens: number): Chunk[] {
  const tokens = text.split(/(\s+)/)
  const words: { token: string; start: number; end: number }[] = []
  let pos = 0
  for (const t of tokens) {
    if (t.trim().length > 0) words.push({ token: t, start: pos, end: pos + t.length })
    pos += t.length
  }
  const step = Math.max(1, sizeInTokens - overlapTokens)
  const chunks: Chunk[] = []
  let i = 0
  let n = 0
  while (i < words.length) {
    const slice = words.slice(i, i + sizeInTokens)
    if (slice.length === 0) break
    const start = slice[0].start
    const end = slice[slice.length - 1].end
    chunks.push({ id: `c-${n}`, text: text.slice(start, end), start, end })
    n += 1
    if (i + sizeInTokens >= words.length) break
    i += step
  }
  return chunks
}

function chunkBySentence(text: string, targetChars: number, overlap: number): Chunk[] {
  const sentenceRegex = /[^.!?\n]+[.!?]+(\s|$)/g
  const matches = Array.from(text.matchAll(sentenceRegex))
  if (matches.length === 0) return chunkFixedChar(text, targetChars, overlap)

  const sentences = matches.map((m) => ({
    text: m[0],
    start: m.index ?? 0,
    end: (m.index ?? 0) + m[0].length,
  }))

  const chunks: Chunk[] = []
  let n = 0
  let buf: typeof sentences = []
  let bufLen = 0
  for (const s of sentences) {
    if (bufLen + s.text.length > targetChars && buf.length > 0) {
      const start = buf[0].start
      const end = buf[buf.length - 1].end
      chunks.push({ id: `c-${n}`, text: text.slice(start, end), start, end })
      n += 1
      const overlapSentences = Math.max(0, overlap > 0 ? Math.min(buf.length, Math.ceil(buf.length / 3)) : 0)
      buf = buf.slice(buf.length - overlapSentences)
      bufLen = buf.reduce((acc, x) => acc + x.text.length, 0)
    }
    buf.push(s)
    bufLen += s.text.length
  }
  if (buf.length > 0) {
    const start = buf[0].start
    const end = buf[buf.length - 1].end
    chunks.push({ id: `c-${n}`, text: text.slice(start, end), start, end })
  }
  return chunks
}

function chunkByParagraph(text: string): Chunk[] {
  const chunks: Chunk[] = []
  let pos = 0
  const parts = text.split(/\n{2,}/)
  let n = 0
  for (const p of parts) {
    if (!p.trim()) {
      pos += p.length + 2
      continue
    }
    const start = pos
    const end = pos + p.length
    chunks.push({ id: `c-${n}`, text: p, start, end })
    n += 1
    pos = end + 2
  }
  return chunks
}
