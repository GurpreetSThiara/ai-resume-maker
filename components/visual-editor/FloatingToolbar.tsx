"use client"

import type { PerLineStyle } from "@/types/resume"
import { ArrowUp, ArrowDown, Bold, Italic, Trash2, Underline } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { ColorInput } from "@/components/ui/color-input"

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
          <IconButton variant="toolbar" size="sm" label="Bold" active={!!lineStyle?.bold} onClick={() => onLine({ bold: !lineStyle?.bold })}><Bold /></IconButton>
          <IconButton variant="toolbar" size="sm" label="Italic" active={!!lineStyle?.italic} onClick={() => onLine({ italic: !lineStyle?.italic })}><Italic /></IconButton>
          <IconButton variant="toolbar" size="sm" label="Underline" active={!!lineStyle?.underline} onClick={() => onLine({ underline: !lineStyle?.underline })}><Underline /></IconButton>
          <ColorInput
            label="Text colour"
            value={lineStyle?.color ?? "#000000"}
            onValueChange={(color) => onLine({ color })}
            className="h-7 w-7 border-white/40"
          />
        </>
      )}

      {(onUp || onDown || onDelete) && onLine && <span className="mx-0.5 h-4 w-px bg-white/20" />}
      {onUp && <IconButton variant="toolbar" size="sm" label="Move section up" onClick={onUp}><ArrowUp /></IconButton>}
      {onDown && <IconButton variant="toolbar" size="sm" label="Move section down" onClick={onDown}><ArrowDown /></IconButton>}
      {onDelete && <IconButton variant="toolbar" size="sm" label="Delete section" onClick={onDelete} className="hover:bg-red-500"><Trash2 /></IconButton>}
    </div>
  )
}

export default FloatingToolbar
