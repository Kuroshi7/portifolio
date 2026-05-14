"use client"

export interface StateViewerProps {
  title?: string
  state: Record<string, unknown>
}

function format(value: unknown, depth = 0): string {
  if (value === null) return "null"
  if (value === undefined) return "undefined"
  if (typeof value === "string") return JSON.stringify(value)
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]"
    if (depth > 1) return `[ ${value.length} item(s) ]`
    return "[\n" + value.map((v) => "  ".repeat(depth + 1) + format(v, depth + 1)).join(",\n") + "\n" + "  ".repeat(depth) + "]"
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return "{}"
    if (depth > 2) return `{ ${entries.length} key(s) }`
    return "{\n" + entries.map(([k, v]) => "  ".repeat(depth + 1) + `"${k}": ${format(v, depth + 1)}`).join(",\n") + "\n" + "  ".repeat(depth) + "}"
  }
  return String(value)
}

export default function StateViewer({ title = "State", state }: StateViewerProps) {
  return (
    <div className="border border-lime-900/40 rounded-sm bg-black/70 backdrop-blur-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-lime-900/40 bg-gray-950/80">
        <span className="text-xs uppercase tracking-wider text-lime-300">{title}</span>
      </div>
      <pre className="h-64 overflow-auto p-3 text-xs font-mono text-gray-300 whitespace-pre">
        {format(state)}
      </pre>
    </div>
  )
}
