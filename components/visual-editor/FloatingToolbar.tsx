"use client"

import type { PerLineStyle } from "@/types/resume"
import { ArrowUp, ArrowDown, Bold, Italic, Trash2, Underline } from "lucide-react"

/**
 * Contextual toolbar floating above the selected element. Per-line formatting
 * (whole-line bold / italic / underline / color — exports cleanly) plus section
 * quick-actions. No per-character formatting (can't export from pdf-lib).
 */
export function FloatingToolbar({
  rect,
  label,
  lineStyle,
  onLine,
  onUp,
  onDown,
  onDelete,
}: {
  rect: DOMRect | null
  label: string
  lineStyle?: PerLineStyle
  onLine?: (patch: Partial<PerLineStyle>) => void
  onUp?: () => void
  onDown?: () => void
  onDelete?: () => void
}) {
  if (!rect) return null
  const top = Math.max(8, rect.top - 44)
  const left = rect.left
  const btn = "flex h-7 w-7 items-center justify-center rounded-md text-white/90 hover:bg-white/15"
  const on = "bg-white/20 text-white"

  return (
    <div
      className="fixed z-40 flex items-center gap-0.5 rounded-lg bg-gray-900 px-1.5 py-1 shadow-xl"
      style={{ top, left }}
      contentEditable={false}
      onMouseDown={(e) => e.preventDefault()}
    >
      <span className="px-1.5 text-[11px] font-medium uppercase tracking-wide text-white/55">{label}</span>

      {onLine && (
        <>
          <button className={`${btn} ${lineStyle?.bold ? on : ""}`} title="Bold" onClick={() => onLine({ bold: !lineStyle?.bold })}><Bold className="h-3.5 w-3.5" /></button>
          <button className={`${btn} ${lineStyle?.italic ? on : ""}`} title="Italic" onClick={() => onLine({ italic: !lineStyle?.italic })}><Italic className="h-3.5 w-3.5" /></button>
          <button className={`${btn} ${lineStyle?.underline ? on : ""}`} title="Underline" onClick={() => onLine({ underline: !lineStyle?.underline })}><Underline className="h-3.5 w-3.5" /></button>
          <label className={`${btn} relative cursor-pointer`} title="Text colour">
            <span className="h-3.5 w-3.5 rounded-sm border border-white/40" style={{ background: lineStyle?.color ? (lineStyle.color.startsWith("#") ? lineStyle.color : `#${lineStyle.color}`) : "#ffffff" }} />
            <input type="color" className="absolute inset-0 cursor-pointer opacity-0" value={lineStyle?.color ? (lineStyle.color.startsWith("#") ? lineStyle.color : `#${lineStyle.color}`) : "#000000"} onChange={(e) => onLine({ color: e.target.value })} />
          </label>
        </>
      )}

      {(onUp || onDown || onDelete) && onLine && <span className="mx-0.5 h-4 w-px bg-white/20" />}
      {onUp && <button className={btn} title="Move section up" onClick={onUp}><ArrowUp className="h-3.5 w-3.5" /></button>}
      {onDown && <button className={btn} title="Move section down" onClick={onDown}><ArrowDown className="h-3.5 w-3.5" /></button>}
      {onDelete && <button className={`${btn} hover:bg-red-500`} title="Delete section" onClick={onDelete}><Trash2 className="h-3.5 w-3.5" /></button>}
    </div>
  )
}

export default FloatingToolbar
