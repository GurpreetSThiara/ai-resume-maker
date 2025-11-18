"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Edit2, Zap } from "lucide-react"
import { SectionVisibilityToggle } from "@/components/section-visibility-toggle"
import { SectionHiddenBanner } from "@/components/section-hidden-banner"
import type { ResumeData, SkillsSection as ISkillsSection } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"

interface SkillsSectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

export function SkillsSection({ data, onUpdate }: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState("")
  const [editingSkill, setEditingSkill] = useState<string | null>(null)
  const [editData, setEditData] = useState("")
  const [isAddingNew, setIsAddingNew] = useState(false)

  // Find the skills section
  const skillsSectionIndex = data.sections.findIndex((s) => s.type === SECTION_TYPES.SKILLS)
  const skillsSection = data.sections[skillsSectionIndex] as ISkillsSection || {
    id: (data.sections.length + 1).toString(),
    title: "Skills & More",
    type: SECTION_TYPES.SKILLS,
    items: [],
    hidden: false
  }

  const isHidden = skillsSection.hidden || false

  const addSkill = () => {
    if (newSkill.trim()) {
      const skills = [...skillsSection.items, newSkill.trim()]
      updateSkillsSection(skills)
      setNewSkill("")
      setIsAddingNew(false)
    }
  }

  const removeSkill = (skillToRemove: string) => {
    const skills = skillsSection.items.filter(skill => skill !== skillToRemove)
    updateSkillsSection(skills)
  }

  const startEditing = (skill: string) => {
    setEditingSkill(skill)
    setEditData(skill)
  }

  const saveEdit = () => {
    if (editingSkill && editData.trim()) {
      const skills = skillsSection.items.map(skill => 
        skill === editingSkill ? editData.trim() : skill
      )
      updateSkillsSection(skills)
      setEditingSkill(null)
      setEditData("")
    }
  }

  const cancelEdit = () => {
    setEditingSkill(null)
    setEditData("")
  }

  // Helper to update or create the skills section
  const updateSkillsSection = (skills: string[], hidden?: boolean) => {
    const updatedSections = [...data.sections]
    if (skillsSectionIndex === -1) {
      updatedSections.push({
        id: (data.sections.length + 1).toString(),
        title: "Skills & More",
        type: SECTION_TYPES.SKILLS,
        items: skills,
        hidden: hidden ?? false
      })
    } else {
      updatedSections[skillsSectionIndex] = {
        ...skillsSection,
        items: skills,
        hidden: hidden ?? skillsSection.hidden
      }
    }
    onUpdate({ sections: updatedSections })
  }

  const toggleVisibility = () => {
    updateSkillsSection(skillsSection.items, !isHidden)
  }

  return (
    <div className="space-y-6">
      {/* Header with visibility toggle */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Skills & More 🚀</h2>
          <p className="text-muted-foreground text-sm">Highlight your technical skills, languages, and certifications</p>
        </div>
        <SectionVisibilityToggle isHidden={isHidden} onToggle={toggleVisibility} />
      </div>

      {/* Disabled overlay when hidden */}
      {isHidden && <SectionHiddenBanner />}

      {/* Existing Skills */}
      <div className="space-y-3">
        {skillsSection.items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No skills added yet</p>
          </div>
        ) : (
          skillsSection.items.map((skill) => (
            <Card key={skill} className={`relative transition-all ${isHidden ? 'opacity-50 bg-gray-50' : ''}`}>
              {editingSkill === skill ? (
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label htmlFor={`edit-skill-${skill}`}>Edit Skill</Label>
                    <Input
                      id={`edit-skill-${skill}`}
                      value={editData}
                      onChange={(e) => setEditData(e.target.value)}
                      placeholder="Enter skill, language, or certification"
                      className="mt-1"
                      disabled={isHidden}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={saveEdit} 
                      className="flex-1"
                      disabled={isHidden}
                    >
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={cancelEdit} 
                      className="flex-1 bg-transparent"
                      disabled={isHidden}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-medium flex items-center gap-2 truncate">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span className="truncate">{skill}</span>
                      </CardTitle>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(skill)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        disabled={isHidden}
                        title={isHidden ? 'Enable section to edit' : 'Edit skill'}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        disabled={isHidden}
                        title={isHidden ? 'Enable section to delete' : 'Delete skill'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Add New Skill */}
      <Card className={`border-dashed border-2 ${isAddingNew ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} ${isHidden ? 'opacity-50' : ''}`}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {isAddingNew ? "Add New Skill" : "Add New Skill"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAddingNew ? (
            <>
              <div>
                <Label htmlFor="new-skill">New Skill</Label>
                <Input
                  id="new-skill"
                  placeholder="e.g., React, Python, Leadership"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="mt-1"
                  disabled={isHidden}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={addSkill} 
                  className="flex-1"
                  disabled={isHidden}
                >
                  Add Skill
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingNew(false)
                    setNewSkill("")
                  }}
                  className="flex-1"
                  disabled={isHidden}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <Button 
              onClick={() => setIsAddingNew(true)} 
              className="w-full"
              disabled={isHidden}
              title={isHidden ? 'Enable section to add skills' : ''}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Skill
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <div className="grid gap-3 md:grid-cols-3">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🔧</span>
            <span className="font-medium text-blue-800 text-sm">Technical Skills</span>
          </div>
          <p className="text-blue-700 text-xs">
            Programming languages, frameworks, tools, and technologies you&apos;re proficient in.
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🌍</span>
            <span className="font-medium text-green-800 text-sm">Languages</span>
          </div>
          <p className="text-green-700 text-xs">
            Spoken languages with proficiency levels (Native, Fluent, Conversational).
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🏆</span>
            <span className="font-medium text-purple-800 text-sm">Certifications</span>
          </div>
          <p className="text-purple-700 text-xs">
            Professional certifications, licenses, and credentials you&apos;ve earned.
          </p>
        </div>
      </div>
    </div>
  )
}
