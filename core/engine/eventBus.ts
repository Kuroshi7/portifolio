import { nanoid } from "nanoid"
import type { EventSeverity, NodeType, TraceEvent } from "./types"

type Listener = (event: TraceEvent) => void

class EventBus {
  private listeners = new Set<Listener>()
  private startedAt = Date.now()

  reset() {
    this.startedAt = Date.now()
  }

  on(fn: Listener): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  emit(
    nodeId: string,
    nodeType: NodeType,
    message: string,
    severity: EventSeverity = "info",
    payload?: Record<string, unknown>,
  ): TraceEvent {
    const event: TraceEvent = {
      id: nanoid(8),
      tStartMs: Date.now() - this.startedAt,
      nodeId,
      nodeType,
      message,
      severity,
      payload,
    }
    for (const fn of this.listeners) fn(event)
    return event
  }
}

export const eventBus = new EventBus()
