"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/** Snapshots kept per editor session. Edits land on blur, so this is generous. */
const HISTORY_LIMIT = 100

/**
 * Lightweight undo/redo for the resume editor. Snapshots the controlled value
 * whenever it changes (edits land on blur, so this is per-field granularity),
 * and ignores the change it triggers itself when applying undo/redo.
 *
 * The stacks are state rather than refs. They were refs plus a forced re-render,
 * which meant canUndo/canRedo were read from a ref during render — a value React
 * has no way to know changed, so the forced render was load-bearing. As state
 * they simply participate in rendering.
 *
 * `applying` and `last` stay refs on purpose: they are control flags read inside
 * callbacks and effects, never during render, and they must update synchronously.
 */
export function useEditorHistory<T>(value: T, setValue: (v: T) => void) {
  const [history, setHistory] = useState<{ past: T[]; future: T[] }>({ past: [], future: [] })
  const applying = useRef(false)
  const last = useRef<T>(value)

  useEffect(() => {
    // This change came from undo/redo itself — record nothing.
    if (applying.current) {
      applying.current = false
      last.current = value
      return
    }
    if (value === last.current) return

    const previous = last.current
    last.current = value
    setHistory((h) => ({
      past: [...h.past, previous].slice(-HISTORY_LIMIT),
      future: [],
    }))
  }, [value])

  const undo = useCallback(() => {
    if (!history.past.length) return

    const restored = history.past[history.past.length - 1]
    const current = last.current

    applying.current = true
    last.current = restored
    setHistory({ past: history.past.slice(0, -1), future: [...history.future, current] })
    setValue(restored)
  }, [history, setValue])

  const redo = useCallback(() => {
    if (!history.future.length) return

    const restored = history.future[history.future.length - 1]
    const current = last.current

    applying.current = true
    last.current = restored
    setHistory({ past: [...history.past, current], future: history.future.slice(0, -1) })
    setValue(restored)
  }, [history, setValue])

  return { undo, redo, canUndo: history.past.length > 0, canRedo: history.future.length > 0 }
}
