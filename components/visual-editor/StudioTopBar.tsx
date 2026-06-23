"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { TemplatePickerDrawer } from "@/components/template-picker-drawer"
import { Check, Download, Eye, LayoutTemplate, ListChecks, Redo2, Sparkles, Undo2 } from "lucide-react"

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-sm font-extrabold text-white">C</span>
      <span className="text-[15px] font-extrabold tracking-tight text-gray-900">
        Create<span className="text-primary">FreeCV</span>
      </span>
    </div>
  )
}

export function StudioTopBar({
  templateId,
  onSelectTemplate,
  onAI,
  onExport,
  onTogglePreview,
  isPreview,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExit,
}: {
  templateId: string
  onSelectTemplate: (id: string) => void
  onAI: () => void
  onExport: () => void
  onTogglePreview: () => void
  isPreview: boolean
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  onExit: () => void
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-white px-4">
      <div className="flex items-center gap-2">
        <Brand />
        {/* Mode switcher — your step-form (Guided) UI is preserved; toggle any time */}
        <div className="ml-1 flex items-center gap-0.5 rounded-lg bg-gray-100 p-1" title="Switch editing mode">
          <button onClick={onExit} className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-white hover:text-gray-900" title="Switch to the step-by-step form editor">
            <ListChecks className="h-4 w-4" /> Guided
          </button>
          <button className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm" aria-current="true" title="You're in the visual editor">
            <LayoutTemplate className="h-4 w-4" /> Visual
          </button>
        </div>
        <div className="mx-1 h-5 w-px bg-gray-200" />
        <TemplatePickerDrawer selectedId={templateId} onSelect={onSelectTemplate} triggerClassName="!h-8 !px-3 !border-0 !rounded-md text-gray-700 hover:bg-gray-100" />
        <Button variant="ghost" size="sm" className="gap-1.5 text-gray-700" onClick={onAI}>
          <Sparkles className="h-4 w-4 text-primary" /> AI Assistant
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onUndo} disabled={!canUndo} aria-label="Undo">
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRedo} disabled={!canRedo} aria-label="Redo">
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1 text-xs text-gray-400 sm:flex">
          <Check className="h-3.5 w-3.5 text-emerald-500" /> All changes saved
        </span>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={onTogglePreview}>
          <Eye className="h-4 w-4" /> {isPreview ? "Editing" : "Preview"}
        </Button>
        <Button size="sm" className="gap-1.5" onClick={onExport}>
          <Download className="h-4 w-4" /> Download
        </Button>
        <span className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">S</span>
      </div>
    </header>
  )
}

export default StudioTopBar
