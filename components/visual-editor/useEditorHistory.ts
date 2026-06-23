"use client"

import { useCallback, useEffect, useReducer, useRef } from "react"

/**
 * Lightweight undo/redo for the resume editor. Snapshots the controlled value
 * whenever it changes (edits land on blur, so this is per-field granularity),
 * and ignores the change it triggers itself when applying undo/redo.
 */
export function useEditorHistory<T>(value: T, setValue: (v: T) => void) {
  const past = useRef<T[]>([])
  const future = useRef<T[]>([])
  const applying = useRef(false)
  const last = useRef<T>(value)
  const [, force] = useReducer((x: number) => x + 1, 0)

  useEffect(() => {
    if (applying.current) {
      applying.current = false
      last.current = value
      return
    }
    if (value === last.current) return
    past.current.push(last.current)
    if (past.current.length > 100) past.current.shift()
    future.current = []
    last.current = value
    force()
  }, [value])

  const undo = useCallback(() => {
    if (!past.current.length) return
    const prev = past.current.pop() as T
    future.current.push(last.current)
    applying.current = true
    last.current = prev
    setValue(prev)
    force()
  }, [setValue])

  const redo = useCallback(() => {
    if (!future.current.length) return
    const next = future.current.pop() as T
    past.current.push(last.current)
    applying.current = true
    last.current = next
    setValue(next)
    force()
  }, [setValue])

  return { undo, redo, canUndo: past.current.length > 0, canRedo: future.current.length > 0 }
}
