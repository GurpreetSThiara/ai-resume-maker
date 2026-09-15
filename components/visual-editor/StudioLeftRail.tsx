"use client"

import { useState } from "react"
import type { ResumeData, Section } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"
import { reorderSections } from "@/utils/sectionOrdering"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Award, Briefcase, Eye, EyeOff, FileText, FolderGit2, Globe, GraduationCap, GripVertical, Plus, Trash2, Wrench,
} from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { Button } from "@/components/ui/button"
import DeleteConfirmModal from "@/components/appUI/modals/DeleteConfirmModal"

const ICON: Record<string, any> = {
  [SECTION_TYPES.EXPERIENCE]: Briefcase,
  [SECTION_TYPES.EDUCATION]: GraduationCap,
  [SECTION_TYPES.SKILLS]: Wrench,
  [SECTION_TYPES.PROJECTS]: FolderGit2,
  [SECTION_TYPES.LANGUAGES]: Globe,
  [SECTION_TYPES.CERTIFICATIONS]: Award,
  [SECTION_TYPES.CUSTOM]: FileText,
}
const ADD_TYPES = [
  { t: SECTION_TYPES.EXPERIENCE, label: "Experience" },
  { t: SECTION_TYPES.EDUCATION, label: "Education" },
  { t: SECTION_TYPES.PROJECTS, label: "Projects" },
  { t: SECTION_TYPES.SKILLS, label: "Skills" },
  { t: SECTION_TYPES.LANGUAGES, label: "Languages" },
  { t: SECTION_TYPES.CERTIFICATIONS, label: "Certifications" },
  { t: SECTION_TYPES.CUSTOM, label: "Custom" },
]

const newSection = (type: string, order: number): Section => {
  const id = `sec-${Math.random().toString(36).slice(2, 9)}`
  const base: any = { id, title: ADD_TYPES.find((x) => x.t === type)?.label || "Section", type, order, hidden: false }
  if (type === SECTION_TYPES.CUSTOM) return { ...base, content: [""] }
  if (type === SECTION_TYPES.SKILLS) return { ...base, items: [], groups: [{ id: id + "g", title: "General", skills: [""] }] }
  if (type === SECTION_TYPES.LANGUAGES || type === SECTION_TYPES.CERTIFICATIONS) return { ...base, items: [""] }
  return { ...base, items: [] }
}

export function StudioLeftRail({
  resumeData,
  setResumeData,
  pageCount,
}: {
  resumeData: ResumeData
  setResumeData: (v: ResumeData | ((p: ResumeData) => ResumeData)) => void
  pageCount: number
}) {
  const sections = resumeData.sections || []
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)

  const drop = (to: number) => {
    if (dragIdx === null || dragIdx === to) return setDragIdx(null)
    setResumeData((prev) => ({ ...prev, sections: reorderSections(prev.sections, dragIdx, to) }))
    setDragIdx(null)
    setOverIdx(null)
  }
  const toggleHidden = (id: string) =>
    setResumeData((prev) => ({ ...prev, sections: prev.sections.map((s) => (s.id === id ? { ...s, hidden: !s.hidden } : s)) }))
  const remove = (id: string) => setResumeData((prev) => ({ ...prev, sections: prev.sections.filter((s) => s.id !== id) }))
  const add = (type: string) => setResumeData((prev) => ({ ...prev, sections: [...prev.sections, newSection(type, prev.sections.length)] }))
  const scrollTo = (id: string) => {
    const el = document.querySelector(`[data-sid="${id}"]`)
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const confirmSection = sections.find((s) => s.id === confirmId)

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r bg-white">
      {/* Pages */}
      <div className="border-b p-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Pages</p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: Math.max(1, pageCount) }).map((_, i) => (
            <div key={i} className="flex h-20 w-[58px] flex-col items-center justify-center rounded border border-gray-200 bg-gray-50 text-[10px] text-gray-400 shadow-sm">
              <FileText className="mb-1 h-4 w-4 text-gray-300" />
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="flex min-h-0 flex-1 flex-col p-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Sections</p>
        <div className="flex-1 space-y-1 overflow-auto">
          {sections.map((s, i) => {
            const Icon = ICON[s.type] || FileText
            return (
              <div
                key={s.id}
                draggable
                onDragStart={() => setDragIdx(i)}
                onDragOver={(e) => { e.preventDefault(); setOverIdx(i) }}
                onDrop={() => drop(i)}
                onDragEnd={() => { setDragIdx(null); setOverIdx(null) }}
                onClick={() => scrollTo(s.id)}
                className={`group flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-2 text-sm transition ${
                  overIdx === i && dragIdx !== null ? "border-primary bg-primary/5" : "border-transparent hover:bg-gray-50"
                } ${dragIdx === i ? "opacity-40" : ""}`}
              >
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-gray-300" />
                <Icon className="h-4 w-4 shrink-0 text-primary" />
                <span className={`flex-1 truncate ${s.hidden ? "text-gray-400 line-through" : "text-gray-700"}`}>{s.title}</span>
                <IconButton
                  size="sm"
                  label={s.hidden ? `Show ${s.title}` : `Hide ${s.title}`}
                  className="opacity-0 group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); toggleHidden(s.id) }}
                >
                  {s.hidden ? <EyeOff /> : <Eye />}
                </IconButton>
                <IconButton
                  variant="danger"
                  size="sm"
                  label={`Delete ${s.title}`}
                  className="opacity-0 group-hover:opacity-100"
                  onClick={(e) => { e.stopPropagation(); setConfirmId(s.id) }}
                >
                  <Trash2 />
                </IconButton>
              </div>
            )
          })}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="mt-3 w-full border-dashed border-gray-300 text-gray-600 hover:border-primary hover:text-primary"
            >
              <Plus /> Add Section
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {ADD_TYPES.map((x) => (
              <DropdownMenuItem key={x.t} onClick={() => add(x.t)} className="cursor-pointer">{x.label}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteConfirmModal
        open={!!confirmSection}
        onOpenChange={(open) => { if (!open) setConfirmId(null) }}
        onConfirm={() => { if (confirmSection) remove(confirmSection.id) }}
        title="Delete this section?"
        description={
          confirmSection
            ? `The \u201C${confirmSection.title}\u201D section and its content will be removed. You can bring it back with Undo (Ctrl+Z).`
            : ""
        }
      />
    </aside>
  )
}

export default StudioLeftRail
