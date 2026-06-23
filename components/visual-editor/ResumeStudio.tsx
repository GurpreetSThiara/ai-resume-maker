"use client"

import { memo, useEffect, useState } from "react"
import type { ResumeData, ResumeTemplate } from "@/types/resume"
import { StudioTopBar } from "./StudioTopBar"
import { StudioLeftRail } from "./StudioLeftRail"
import { StudioCanvas } from "./StudioCanvas"
import { StudioRightPanel } from "./StudioRightPanel"
import { useEditorHistory } from "./useEditorHistory"
import type { Selection } from "./studio-shared"

/**
 * Full-screen WYSIWYG "Studio": top bar + left rail (pages/sections) + center
 * canvas (the editable resume) + contextual right properties panel. The resume
 * is the editing surface (inline content-editable via ConfigurableResume).
 */
function ResumeStudioImpl({
  resumeData,
  setResumeData,
  template,
  onSelectTemplate,
  onAI,
  onExport,
  onExit,
}: {
  resumeData: ResumeData
  setResumeData: (v: ResumeData | ((p: ResumeData) => ResumeData)) => void
  template: ResumeTemplate
  onSelectTemplate: (id: string) => void
  onAI: () => void
  onExport: () => void
  onExit: () => void
}) {
  const [selection, setSelection] = useState<Selection>({ kind: null })
  const [zoom, setZoom] = useState(1)
  const [pageCount, setPageCount] = useState(1)
  const [isPreview, setIsPreview] = useState(false)
  const { undo, redo, canUndo, canRedo } = useEditorHistory(resumeData, setResumeData)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey
      if (!mod) return
      const k = e.key.toLowerCase()
      if (k === "z") { e.preventDefault(); e.shiftKey ? redo() : undo() }
      else if (k === "y") { e.preventDefault(); redo() }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [undo, redo])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-100">
      <StudioTopBar
        templateId={template.id}
        onSelectTemplate={onSelectTemplate}
        onAI={onAI}
        onExport={onExport}
        onTogglePreview={() => setIsPreview((p) => !p)}
        isPreview={isPreview}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onExit={onExit}
      />
      <div className="flex min-h-0 flex-1">
        {!isPreview && <StudioLeftRail resumeData={resumeData} setResumeData={setResumeData} pageCount={pageCount} />}
        <StudioCanvas
          resumeData={resumeData}
          setResumeData={setResumeData}
          template={template}
          zoom={zoom}
          setZoom={setZoom}
          onSelect={setSelection}
          isPreview={isPreview}
          onPageCount={setPageCount}
        />
        {!isPreview && (
          <StudioRightPanel resumeData={resumeData} setResumeData={setResumeData} templateId={template.id} selection={selection} />
        )}
      </div>
    </div>
  )
}

export const ResumeStudio = memo(ResumeStudioImpl)

export default ResumeStudio
