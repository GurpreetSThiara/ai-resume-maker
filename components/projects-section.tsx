"use client"

import { useState } from "react"
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
  const [newProject, setNewProject] = useState<Project>({ name: "", link: "", repo: "", description: [] })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<Project>({ name: "", link: "", repo: "", description: [] })

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
      description: (newProject.description || []).map(d => (d || "").trim()).filter(Boolean)
    }
    updateSection([...(projectsSection.items || []), sanitized])
    setNewProject({ name: "", link: "", repo: "", description: [] })
    setIsAddingNew(false)
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
      description: (editValue.description || []).map(d => (d || "").trim()).filter(Boolean)
    }
    const next = [...projectsSection.items]
    next[editingIndex] = sanitized
    updateSection(next)
    setEditingIndex(null)
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
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Project name</div>
                  <Input value={newProject.name} onChange={(e) => setNewProject(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Resume Builder" disabled={isHidden} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Project link</div>
                  <Input value={newProject.link || ""} onChange={(e) => setNewProject(p => ({ ...p, link: e.target.value }))} placeholder="https://example.com" disabled={isHidden} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">GitHub repo</div>
                  <Input value={newProject.repo || ""} onChange={(e) => setNewProject(p => ({ ...p, repo: e.target.value }))} placeholder="https://github.com/user/repo" disabled={isHidden} />
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Description (one bullet per line)</div>
                <Textarea value={(newProject.description || []).join("\n")} onChange={(e) => setNewProject(p => ({ ...p, description: e.target.value.split("\n") }))} rows={4} disabled={isHidden} />
              </div>
                <div className="flex gap-2">
                <Button onClick={addProject} className="gap-1" disabled={isHidden}><Plus className="w-4 h-4" />Add Project</Button>
                <Button variant="outline" onClick={() => { setIsAddingNew(false); setNewProject({ name: "", link: "", repo: "", description: [] }) }} disabled={isHidden}>Cancel</Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setIsAddingNew(true)} className="gap-1" disabled={isHidden}><Plus className="w-4 h-4" />New Project</Button>
          )}

          <div className="space-y-3">
            {(projectsSection.items || []).map((proj, idx) => (
              <div key={idx} className="rounded-md border p-3">
                {editingIndex === idx ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Project name</div>
                        <Input value={editValue.name} onChange={(e) => setEditValue(p => ({ ...p, name: e.target.value }))} disabled={isHidden} />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Project link</div>
                        <Input value={editValue.link || ""} onChange={(e) => setEditValue(p => ({ ...p, link: e.target.value }))} disabled={isHidden} />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">GitHub repo</div>
                        <Input value={editValue.repo || ""} onChange={(e) => setEditValue(p => ({ ...p, repo: e.target.value }))} disabled={isHidden} />
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Description bullets</div>
                      <div className="space-y-2">
                        {(editValue.description || []).map((d, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-2">
                            <span className="text-sm pt-2">•</span>
                            <Input
                              value={d}
                              onChange={(e) => setEditValue(p => {
                                const next = [...(p.description || [])]
                                next[dIdx] = e.target.value
                                return { ...p, description: next }
                              })}
                              disabled={isHidden}
                            />
                            <Button size="icon" variant="ghost" onClick={() => setEditValue(p => ({ ...p, description: (p.description || []).filter((_, i) => i !== dIdx) }))} disabled={isHidden}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button size="sm" variant="outline" onClick={() => setEditValue(p => ({ ...p, description: [...(p.description || []), ""] }))} disabled={isHidden}>Add bullet</Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEdit} className="gap-1" disabled={isHidden}><Save className="w-4 h-4" />Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingIndex(null)} disabled={isHidden}>Cancel</Button>
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
                        <div className="text-xs text-muted-foreground">No bullets yet</div>
                      )}
                      <div>
                        <Button size="sm" variant="outline" onClick={() => addBullet(idx)} disabled={isHidden}>Add bullet</Button>
                      </div>
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
