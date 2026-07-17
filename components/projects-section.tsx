"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Trash2, Edit2, X, ArrowUp, ArrowDown } from "lucide-react"
import { SectionVisibilityToggle } from "@/components/section-visibility-toggle"
import { SectionHiddenBanner } from "@/components/section-hidden-banner"
import type { ResumeData, ProjectsSection as IProjectsSection, Project } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"

interface ProjectsSectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

const EMPTY_PROJECT: Project = { name: "", link: "", repo: "", description: [], startDate: "", endDate: "" }

export function ProjectsSection({ data, onUpdate }: ProjectsSectionProps) {
  const sectionIndex = data.sections.findIndex((s) => s.type === SECTION_TYPES.PROJECTS)
  const projectsSection = (sectionIndex !== -1 ? data.sections[sectionIndex] : {
    id: "projects",
    title: "Projects",
    type: SECTION_TYPES.PROJECTS,
    items: [] as Project[]
  }) as IProjectsSection

  const isHidden = projectsSection?.hidden || false

  const toggleVisibility = () => {
    const updated = data.sections.map((s) => {
      if (s.type === SECTION_TYPES.PROJECTS) return { ...s, hidden: !s.hidden }
      return s
    })
    onUpdate({ sections: updated })
  }

  // editingIndex === null && !isModalOpen -> modal closed
  // editingIndex === -1 -> adding a new project
  // editingIndex >= 0 -> editing that project
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number>(-1)
  const [formValue, setFormValue] = useState<Project>(EMPTY_PROJECT)

  const openAddModal = () => {
    setEditingIndex(-1)
    setFormValue(EMPTY_PROJECT)
    setIsModalOpen(true)
  }

  const openEditModal = (idx: number) => {
    setEditingIndex(idx)
    setFormValue(projectsSection.items[idx])
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  // Reset form state after the close animation finishes so the fields don't
  // visibly flash back to empty while the dialog is fading out.
  useEffect(() => {
    if (isModalOpen) return
    const timeout = setTimeout(() => {
      setEditingIndex(-1)
      setFormValue(EMPTY_PROJECT)
    }, 200)
    return () => clearTimeout(timeout)
  }, [isModalOpen])

  const updateFormField = (field: keyof Project, value: string) => {
    setFormValue((p) => ({ ...p, [field]: value }))
  }

  const updateFormDescription = (dIdx: number, value: string) => {
    setFormValue((p) => {
      const next = [...(p.description || [])]
      next[dIdx] = value
      return { ...p, description: next }
    })
  }

  const removeFormDescription = (dIdx: number) => {
    setFormValue((p) => ({
      ...p,
      description: (p.description || []).filter((_, i) => i !== dIdx)
    }))
  }

  const addFormDescriptionPoint = () => {
    setFormValue((p) => ({ ...p, description: [...(p.description || []), ""] }))
  }

  const updateSection = (items: Project[]) => {
    if (sectionIndex === -1) {
      onUpdate({ sections: [...data.sections, { ...projectsSection, items }] })
    } else {
      const updated = data.sections.map((s, idx) => idx === sectionIndex ? { ...(s as IProjectsSection), items } : s)
      onUpdate({ sections: updated })
    }
  }

  const saveProject = () => {
    const name = (formValue.name || "").trim()
    if (!name) return
    const sanitized: Project = {
      name,
      link: formValue.link?.trim() || undefined,
      repo: formValue.repo?.trim() || undefined,
      description: (formValue.description || []).map((d) => (d || "").trim()).filter(Boolean),
      startDate: formValue.startDate?.trim() || undefined,
      endDate: formValue.endDate?.trim() || undefined,
    }

    if (editingIndex === -1) {
      updateSection([...(projectsSection.items || []), sanitized])
    } else {
      const next = [...projectsSection.items]
      next[editingIndex] = sanitized
      updateSection(next)
    }
    closeModal()
  }

  const removeProject = (idx: number) => {
    const next = (projectsSection.items || []).filter((_, i) => i !== idx)
    updateSection(next)
  }

  const moveProject = (from: number, to: number) => {
    const arr = [...(projectsSection.items || [])]
    if (to < 0 || to >= arr.length) return
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    updateSection(arr)
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-base">Projects</CardTitle>
          <SectionVisibilityToggle isHidden={isHidden} onToggle={toggleVisibility} />
        </CardHeader>
        {isHidden && <SectionHiddenBanner />}
        <CardContent className="space-y-4">
          <Button onClick={openAddModal} className="gap-1" disabled={isHidden}>
            <Plus className="w-4 h-4" />New Project
          </Button>

          <div className="space-y-3">
            {(projectsSection.items || []).map((proj, idx) => (
              <div key={idx} className="rounded-md border p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{proj.name}</div>
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" onClick={() => moveProject(idx, idx - 1)} disabled={idx === 0 || isHidden}>
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => moveProject(idx, idx + 1)} disabled={idx === (projectsSection.items?.length || 0) - 1 || isHidden}>
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEditModal(idx)} disabled={isHidden}><Edit2 className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => removeProject(idx)} disabled={isHidden}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  {(proj.link || proj.repo) && (
                    <div className="flex flex-wrap gap-2">
                      {proj.link && (
                        <a className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-xs" href={proj.link} target="_blank" rel="noreferrer">
                          Link
                        </a>
                      )}
                      {proj.repo && (
                        <a className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-xs" href={proj.repo} target="_blank" rel="noreferrer">
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
                  <div className="space-y-1">
                    {(proj.description || []).map((d, i) => (
                      <div key={i} className="text-sm leading-tight">• {d}</div>
                    ))}
                    {(proj.description || []).length === 0 && (
                      <div className="text-xs text-muted-foreground">No description yet</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {(!projectsSection.items || projectsSection.items.length === 0) && (
              <div className="text-sm text-muted-foreground">No projects added yet.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={(o) => { if (!o) closeModal() }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingIndex === -1 ? "Add Project" : "Edit Project"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Project name</label>
              <Input
                value={formValue.name}
                onChange={(e) => updateFormField('name', e.target.value)}
                placeholder="e.g., Resume Builder"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Start Date (if any)</label>
                <Input
                  value={formValue.startDate || ""}
                  onChange={(e) => updateFormField('startDate', e.target.value)}
                  placeholder="2023-01"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">End Date (if any)</label>
                <Input
                  value={formValue.endDate || ""}
                  onChange={(e) => updateFormField('endDate', e.target.value)}
                  placeholder="2023-12 or Present"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Project link</label>
              <Input
                value={formValue.link || ""}
                onChange={(e) => updateFormField('link', e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">GitHub repo</label>
              <Input
                value={formValue.repo || ""}
                onChange={(e) => updateFormField('repo', e.target.value)}
                placeholder="https://github.com/user/repo"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Description points</label>
              <div className="space-y-2">
                {(formValue.description || []).map((d, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2">
                    <span className="text-sm pt-2">•</span>
                    <Input
                      value={d}
                      onChange={(e) => updateFormDescription(dIdx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addFormDescriptionPoint()
                        }
                      }}
                    />
                    <Button size="icon" variant="ghost" onClick={() => removeFormDescription(dIdx)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={addFormDescriptionPoint}>Add description point</Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button onClick={saveProject} disabled={!formValue.name.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
