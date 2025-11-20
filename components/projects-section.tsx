"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Edit2, Save, Link as LinkIcon, Github, ArrowUp, ArrowDown, X } from "lucide-react"
import { SectionVisibilityToggle } from "@/components/section-visibility-toggle"
import { SectionHiddenBanner } from "@/components/section-hidden-banner"
import type { ResumeData, ProjectsSection as IProjectsSection, Project } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"

interface ProjectsSectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

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

  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newProject, setNewProject] = useState<Project>({ name: "", link: "", repo: "", description: [], startDate: "", endDate: "" })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<Project>({ name: "", link: "", repo: "", description: [], startDate: "", endDate: "" })
  const newDescRefs = useRef<HTMLInputElement[]>([])
  const newNameRef = useRef<HTMLInputElement | null>(null)
  const newStartRef = useRef<HTMLInputElement | null>(null)
  const newEndRef = useRef<HTMLInputElement | null>(null)
  const newLinkRef = useRef<HTMLInputElement | null>(null)
  const newRepoRef = useRef<HTMLInputElement | null>(null)
  const editDescRefs = useRef<HTMLInputElement[]>([])
  const editNameRef = useRef<HTMLInputElement | null>(null)
  const editStartRef = useRef<HTMLInputElement | null>(null)
  const editEndRef = useRef<HTMLInputElement | null>(null)
  const editLinkRef = useRef<HTMLInputElement | null>(null)
  const editRepoRef = useRef<HTMLInputElement | null>(null)

  const addNewDescriptionPoint = () => {
    setNewProject(p => ({ ...p, description: [...(p.description || []), ""] }))
    // focus the newly added input after render
    setTimeout(() => {
      const el = newDescRefs.current[newDescRefs.current.length - 1]
      if (el) el.focus()
    }, 0)
  }

  const addEditDescriptionPoint = () => {
    setEditValue(p => ({ ...p, description: [...(p.description || []), ""] }))
    setTimeout(() => {
      const el = editDescRefs.current[editDescRefs.current.length - 1]
      if (el) el.focus()
    }, 0)
  }

  // Helper functions for new project form
  const updateNewProjectField = (field: keyof Project, value: string) => {
    setNewProject(p => ({ ...p, [field]: value }))
  }

  const updateNewProjectDescription = (dIdx: number, value: string) => {
    setNewProject(p => {
      const next = [...(p.description || [])]
      next[dIdx] = value
      return { ...p, description: next }
    })
  }

  const removeNewProjectDescription = (dIdx: number) => {
    setNewProject(p => ({
      ...p,
      description: (p.description || []).filter((_, i) => i !== dIdx)
    }))
  }

  // Helper functions for edit project form
  const updateEditProjectField = (field: keyof Project, value: string) => {
    setEditValue(p => ({ ...p, [field]: value }))
  }

  const updateEditProjectDescription = (dIdx: number, value: string) => {
    setEditValue(p => {
      const next = [...(p.description || [])]
      next[dIdx] = value
      return { ...p, description: next }
    })
  }

  const removeEditProjectDescription = (dIdx: number) => {
    setEditValue(p => ({
      ...p,
      description: (p.description || []).filter((_, i) => i !== dIdx)
    }))
  }

  const updateSection = (items: Project[]) => {
    if (sectionIndex === -1) {
      onUpdate({ sections: [...data.sections, { ...projectsSection, items }] })
    } else {
      const updated = data.sections.map((s, idx) => idx === sectionIndex ? { ...(s as IProjectsSection), items } : s)
      onUpdate({ sections: updated })
    }
  }

  const addProject = () => {
    const name = (newProject.name || "").trim()
    if (!name) return
    const sanitized: Project = {
      name,
      link: newProject.link?.trim() || undefined,
      repo: newProject.repo?.trim() || undefined,
      description: (newProject.description || []).map(d => (d || "").trim()).filter(Boolean),
      startDate: newProject.startDate?.trim() || undefined,
      endDate: newProject.endDate?.trim() || undefined,
    }
    updateSection([...(projectsSection.items || []), sanitized])
    setNewProject({ name: "", link: "", repo: "", description: [], startDate: "", endDate: "" })
    setIsAddingNew(false)
    newDescRefs.current = []
    newNameRef.current = null
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

  const removeBullet = (pIdx: number, dIdx: number) => {
    const arr = [...(projectsSection.items || [])]
    const desc = [...(arr[pIdx].description || [])]
    desc.splice(dIdx, 1)
    arr[pIdx] = { ...arr[pIdx], description: desc }
    updateSection(arr)
  }

  const addBullet = (pIdx: number) => {
    const arr = [...(projectsSection.items || [])]
    const desc = [...(arr[pIdx].description || [])]
    desc.push("")
    arr[pIdx] = { ...arr[pIdx], description: desc }
    updateSection(arr)
  }

  const startEdit = (idx: number) => {
    editDescRefs.current = []
    setEditingIndex(idx)
    setEditValue(projectsSection.items[idx])
  }

  const saveEdit = () => {
    if (editingIndex === null) return
    const name = (editValue.name || "").trim()
    if (!name) return
    const sanitized: Project = {
      name,
      link: editValue.link?.trim() || undefined,
      repo: editValue.repo?.trim() || undefined,
      description: (editValue.description || []).map(d => (d || "").trim()).filter(Boolean),
      startDate: editValue.startDate?.trim() || undefined,
      endDate: editValue.endDate?.trim() || undefined,
    }
    const next = [...projectsSection.items]
    next[editingIndex] = sanitized
    updateSection(next)
    setEditingIndex(null)
    editDescRefs.current = []
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
          {isAddingNew ? (
            <div className="space-y-3 rounded-md border p-3">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Project name</div>
                  <Input
                    ref={(el: any) => (newNameRef.current = el)}
                    value={newProject.name}
                    onChange={(e) => updateNewProjectField('name', e.target.value)}
                    onKeyDown={(e: any) => { if (e.key === 'Enter') { e.preventDefault(); newStartRef.current?.focus() } }}
                    placeholder="e.g., Resume Builder"
                    className="placeholder:text-muted-foreground"
                    disabled={isHidden}
                  />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Start Date (if any)</div>
                  <Input
                    ref={(el: any) => (newStartRef.current = el)}
                    value={newProject.startDate || ""}
                    onChange={(e) => updateNewProjectField('startDate', e.target.value)}
                    onKeyDown={(e: any) => { if (e.key === 'Enter') { e.preventDefault(); newEndRef.current?.focus() } }}
                    placeholder="2023-01"
                    className="placeholder:text-muted-foreground"
                    disabled={isHidden}
                  />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">End Date (if any)</div>
                  <Input
                    ref={(el: any) => (newEndRef.current = el)}
                    value={newProject.endDate || ""}
                    onChange={(e) => updateNewProjectField('endDate', e.target.value)}
                    onKeyDown={(e: any) => { if (e.key === 'Enter') { e.preventDefault(); newLinkRef.current?.focus() } }}
                    placeholder="2023-12 or Present"
                    className="placeholder:text-muted-foreground"
                    disabled={isHidden}
                  />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Project link</div>
                  <Input
                    ref={(el: any) => (newLinkRef.current = el)}
                    value={newProject.link || ""}
                    onChange={(e) => updateNewProjectField('link', e.target.value)}
                    onKeyDown={(e: any) => { if (e.key === 'Enter') { e.preventDefault(); newRepoRef.current?.focus() } }}
                    placeholder="https://example.com"
                    className="placeholder:text-muted-foreground"
                    disabled={isHidden}
                  />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">GitHub repo</div>
                  <Input
                    ref={(el: any) => (newRepoRef.current = el)}
                    value={newProject.repo || ""}
                    onChange={(e) => updateNewProjectField('repo', e.target.value)}
                    onKeyDown={(e: any) => { if (e.key === 'Enter') { e.preventDefault(); /* move to first description input if present */ if (newDescRefs.current[0]) { newDescRefs.current[0].focus() } }} }
                    placeholder="https://github.com/user/repo"
                    className="placeholder:text-muted-foreground"
                    disabled={isHidden}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Description points</div>
                <div className="space-y-2">
                  {(newProject.description || []).map((d, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2">
                      <span className="text-sm pt-2">•</span>
                        <Input
                          value={d}
                          onChange={(e) => updateNewProjectDescription(dIdx, e.target.value)}
                          ref={(el: any) => (newDescRefs.current[dIdx] = el)}
                          className="placeholder:text-muted-foreground"
                          onKeyDown={(e: any) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addNewDescriptionPoint()
                            }
                          }}
                          disabled={isHidden}
                        />
                      <Button size="icon" variant="ghost" onClick={() => removeNewProjectDescription(dIdx)} disabled={isHidden}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                        <Button size="sm" variant="outline" onClick={addNewDescriptionPoint} disabled={isHidden}>Add description point</Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={addProject} className="gap-1" disabled={isHidden}><Plus className="w-4 h-4" />Add Project</Button>
                <Button variant="outline" onClick={() => { newDescRefs.current = []; newNameRef.current = null; setIsAddingNew(false); setNewProject({ name: "", link: "", repo: "", description: [] }) }} disabled={isHidden}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => { newDescRefs.current = []; setIsAddingNew(true); setTimeout(() => { newNameRef.current?.focus() }, 0) }} className="gap-1" disabled={isHidden}><Plus className="w-4 h-4" />New Project</Button>
          )}

          <div className="space-y-3">
            {(projectsSection.items || []).map((proj, idx) => (
              <div key={idx} className="rounded-md border p-3">
                {editingIndex === idx ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Project name</div>
                        <Input
                          ref={(el: any) => (editNameRef.current = el)}
                          value={editValue.name}
                          onChange={(e) => updateEditProjectField('name', e.target.value)}
                          onKeyDown={(e: any) => { if (e.key === 'Enter') { e.preventDefault(); editStartRef.current?.focus() } }}
                          className="placeholder:text-muted-foreground"
                          disabled={isHidden}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Start Date (if any)</div>
                        <Input
                          ref={(el: any) => (editStartRef.current = el)}
                          value={editValue.startDate || ""}
                          onChange={(e) => updateEditProjectField('startDate', e.target.value)}
                          onKeyDown={(e: any) => { if (e.key === 'Enter') { e.preventDefault(); editEndRef.current?.focus() } }}
                          className="placeholder:text-muted-foreground"
                          disabled={isHidden}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">End Date (if any)</div>
                        <Input
                          ref={(el: any) => (editEndRef.current = el)}
                          value={editValue.endDate || ""}
                          onChange={(e) => updateEditProjectField('endDate', e.target.value)}
                          onKeyDown={(e: any) => { if (e.key === 'Enter') { e.preventDefault(); editLinkRef.current?.focus() } }}
                          className="placeholder:text-muted-foreground"
                          disabled={isHidden}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Project link</div>
                        <Input
                          ref={(el: any) => (editLinkRef.current = el)}
                          value={editValue.link || ""}
                          onChange={(e) => updateEditProjectField('link', e.target.value)}
                          onKeyDown={(e: any) => { if (e.key === 'Enter') { e.preventDefault(); editRepoRef.current?.focus() } }}
                          className="placeholder:text-muted-foreground"
                          disabled={isHidden}
                        />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">GitHub repo</div>
                        <Input
                          ref={(el: any) => (editRepoRef.current = el)}
                          value={editValue.repo || ""}
                          onChange={(e) => updateEditProjectField('repo', e.target.value)}
                          onKeyDown={(e: any) => { if (e.key === 'Enter') { e.preventDefault(); if (editDescRefs.current[0]) { editDescRefs.current[0].focus() } } }}
                          className="placeholder:text-muted-foreground"
                          disabled={isHidden}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Description points</div>
                      <div className="space-y-2">
                        {(editValue.description || []).map((d, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-2">
                            <span className="text-sm pt-2">•</span>
                                <Input
                                  value={d}
                                  onChange={(e) => updateEditProjectDescription(dIdx, e.target.value)}
                                  ref={(el: any) => (editDescRefs.current[dIdx] = el)}
                                  className="placeholder:text-muted-foreground"
                                  onKeyDown={(e: any) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault()
                                      addEditDescriptionPoint()
                                    }
                                  }}
                                  disabled={isHidden}
                                />
                            <Button size="icon" variant="ghost" onClick={() => removeEditProjectDescription(dIdx)} disabled={isHidden}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button size="sm" variant="outline" onClick={addEditDescriptionPoint} disabled={isHidden}>Add description point</Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdit} className="gap-1" disabled={isHidden}><Save className="w-4 h-4" />Save</Button>
                      <Button size="sm" variant="outline" onClick={() => { editDescRefs.current = []; setEditingIndex(null) }} disabled={isHidden}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{proj.name}</div>
                        <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" onClick={() => moveProject(idx, idx - 1)} disabled={idx === 0 || isHidden}><ArrowUp className="w-4 h-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => moveProject(idx, idx + 1)} disabled={idx === (projectsSection.items?.length || 0) - 1 || isHidden}><ArrowDown className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => startEdit(idx)} disabled={isHidden}><Edit2 className="w-4 h-4" /></Button>
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
                )}
              </div>
            ))}
            {(!projectsSection.items || projectsSection.items.length === 0) && (
              <div className="text-sm text-muted-foreground">No projects added yet.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
