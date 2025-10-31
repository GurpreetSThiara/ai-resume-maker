"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Award, Edit2, Save } from "lucide-react"
import type { ResumeData, CertificationsSection as ICertsSection } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"

interface CertificationsSectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

export function CertificationsSection({ data, onUpdate }: CertificationsSectionProps) {
  const [newCert, setNewCert] = useState("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const [isAddingNew, setIsAddingNew] = useState(false)

  const sectionIndex = data.sections.findIndex((s) => s.type === SECTION_TYPES.CERTIFICATIONS)
  const certsSection = (sectionIndex !== -1 ? data.sections[sectionIndex] : {
    id: "certifications",
    title: "Certifications",
    type: SECTION_TYPES.CERTIFICATIONS,
    items: [] as string[]
  }) as ICertsSection

  const updateSection = (items: string[]) => {
    if (sectionIndex === -1) {
      onUpdate({ sections: [...data.sections, { ...certsSection, items }] })
    } else {
      const updated = data.sections.map((s, idx) => idx === sectionIndex ? { ...(s as ICertsSection), items } : s)
      onUpdate({ sections: updated })
    }
  }

  const addCert = () => {
    const v = newCert.trim()
    if (!v) return
    updateSection([...(certsSection.items || []), v])
    setNewCert("")
    setIsAddingNew(false)
  }

  const removeCert = (idx: number) => {
    const next = (certsSection.items || []).filter((_, i) => i !== idx)
    updateSection(next)
  }

  const startEdit = (idx: number) => {
    setEditingIndex(idx)
    setEditValue(certsSection.items[idx])
  }

  const saveEdit = () => {
    if (editingIndex === null) return
    const v = editValue.trim()
    if (!v) return
    const next = [...certsSection.items]
    next[editingIndex] = v
    updateSection(next)
    setEditingIndex(null)
    setEditValue("")
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new */}
          {isAddingNew ? (
            <div className="flex gap-2">
              <Input
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                placeholder="e.g., AWS Certified Solutions Architect (2024)"
              />
              <Button onClick={addCert}>Add</Button>
              <Button variant="outline" onClick={() => { setIsAddingNew(false); setNewCert("") }}>Cancel</Button>
            </div>
          ) : (
            <Button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Certification
            </Button>
          )}

          {/* List */}
          <div className="space-y-2">
            {(certsSection.items || []).map((cert, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {editingIndex === idx ? (
                  <>
                    <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                    <Button size="sm" onClick={saveEdit} className="flex items-center gap-1"><Save className="w-4 h-4" />Save</Button>
                    <Button size="sm" variant="outline" onClick={() => { setEditingIndex(null); setEditValue("") }}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1 text-sm">{cert}</div>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(idx)}><Edit2 className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => removeCert(idx)}><Trash2 className="w-4 h-4" /></Button>
                  </>
                )}
              </div>
            ))}
            {(!certsSection.items || certsSection.items.length === 0) && (
              <div className="text-sm text-muted-foreground">No certifications added yet.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
