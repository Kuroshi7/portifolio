"use client"

import { useEffect, useRef, useState } from "react"

type Service = { name: string; state: string }

const services: Service[] = [
  { name: "ingestion-queue", state: "OPERATIONAL" },
  { name: "banking-integrations", state: "OPERATIONAL" },
  { name: "rag-engine", state: "OPERATIONAL" },
  { name: "vector-store", state: "OPERATIONAL" },
  { name: "k8s-workers", state: "OPERATIONAL" },
]

export default function SystemStatus() {
  const [events, setEvents] = useState(1284973)
  const [rps, setRps] = useState(342)
  const [origin, setOrigin] = useState<string | null>(null)
  const seed = useRef(1)

  // Illustrative, deterministic-ish telemetry animation
  useEffect(() => {
    const id = setInterval(() => {
      seed.current = (seed.current * 9301 + 49297) % 233280
      const rnd = seed.current / 233280
      setEvents((e) => e + Math.floor(6 + rnd * 40))
      setRps(300 + Math.floor(rnd * 120))
    }, 1400)
    return () => clearInterval(id)
  }, [])

  // Subtle "we see you" — inbound connection origin
  useEffect(() => {
    fetch("https://ipinfo.io/json")
      .then((r) => r.json())
      .then((d) => setOrigin([d.city, d.region].filter(Boolean).join(", ") || d.country))
      .catch(() => setOrigin(null))
  }, [])

  return (
    <div className="frame-brackets bg-gray-950/80 border border-lime-900/50 rounded-sm p-4 md:p-5 font-mono-tech text-sm shadow-2xl shadow-lime-950/40">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-lime-900/40 pb-3 mb-3">
        <div className="flex items-center gap-2 text-lime-300">
          <span className="status-dot" />
          <span className="tracking-wider text-xs">system.status</span>
        </div>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-lime-900" />
          <span className="w-2.5 h-2.5 rounded-full bg-lime-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-lime-500" />
        </div>
      </div>

      {/* Live counters */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-black/50 border border-lime-900/30 rounded-sm px-3 py-2">
          <div className="text-[10px] text-gray-500 tracking-widest">EVENTS PROCESSED</div>
          <div className="text-lg text-lime-300 tabular-nums">{events.toLocaleString("en-US")}</div>
        </div>
        <div className="bg-black/50 border border-lime-900/30 rounded-sm px-3 py-2">
          <div className="text-[10px] text-gray-500 tracking-widest">THROUGHPUT</div>
          <div className="text-lg text-lime-300 tabular-nums">
            {rps}
            <span className="text-xs text-gray-500"> msg/s</span>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="space-y-1.5">
        {services.map((s) => (
          <div key={s.name} className="flex items-center justify-between text-xs">
            <span className="text-gray-400">{s.name}</span>
            <span className="flex items-center gap-2 text-lime-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-lime-400 shadow-[0_0_6px_rgba(164,198,57,0.9)]" />
              {s.state}
            </span>
          </div>
        ))}
      </div>

      {/* Footer readout */}
      <div className="mt-4 pt-3 border-t border-lime-900/40 text-[11px] text-gray-500 leading-relaxed">
        <span className="text-lime-500">$</span> inbound connection{" "}
        {origin ? (
          <span className="text-gray-300">from {origin}</span>
        ) : (
          <span className="text-gray-600">resolving…</span>
        )}
        <br />
        <span className="text-gray-600">// simulated telemetry — architecture is real</span>
      </div>
    </div>
  )
}
