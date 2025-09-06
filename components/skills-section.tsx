"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Rocket, Edit2 } from "lucide-react"
import type { ResumeData, SkillsSection as ISkillsSection } from "@/types/resume"

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
  const skillsSectionIndex = data.sections.findIndex((s) => s.type === "skills")
  const skillsSection = data.sections[skillsSectionIndex] as ISkillsSection || {
    id: (data.sections.length + 1).toString(),
    title: "Skills & More",
    type: "skills" as const,
    items: []
  }

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
  const updateSkillsSection = (skills: string[]) => {
    const updatedSections = [...data.sections]
    if (skillsSectionIndex === -1) {
      // Create new skills section
      updatedSections.push({
        id: (data.sections.length + 1).toString(),
        title: "Skills & More",
        type: "skills" as const,
        items: skills
      })
    } else {
      updatedSections[skillsSectionIndex] = {
        ...skillsSection,
        items: skills
      }
    }
    onUpdate({ sections: updatedSections })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Skills & More 🚀</h2>
        <p className="text-muted-foreground">Highlight your technical skills, languages, and certifications</p>
      </div>

      {/* Existing Skills */}
      <div className="space-y-4">
        {skillsSection.items.map((skill) => (
          <Card key={skill} className="relative">
            {editingSkill === skill ? (
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label>Skill</Label>
                  <Input
                    value={editData}
                    onChange={(e) => setEditData(e.target.value)}
                    placeholder="Enter skill, language, or certification"
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveEdit} className="flex-1">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={cancelEdit} className="flex-1 bg-transparent">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Rocket className="w-5 h-5" />
                      {skill}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(skill)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Add New Skill */}
      <Card className={`border-dashed border-2 border-gray-300 ${isAddingNew ? "border-blue-500" : ""}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {isAddingNew ? "Adding New Skill" : "Add New Skill"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAddingNew ? (
            <>
              <div>
                <Label>New Skill</Label>
                <Input
                  placeholder="Enter skill, language, or certification"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="mt-1"
                />
              </div>

              <Button onClick={addSkill} className="w-full">
                Add Skill
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsAddingNew(true)} className="w-full">
              Add New Skill
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-600">🔧</span>
            <span className="font-medium text-red-800">Technical Skills</span>
          </div>
          <p className="text-red-700 text-xs">
            Programming languages, frameworks, tools, and technologies you&apos;re proficient in.
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600">🌍</span>
            <span className="font-medium text-green-800">Languages</span>
          </div>
          <p className="text-green-700 text-xs">
            Spoken languages with proficiency levels (Native, Fluent, Conversational).
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-600">🏆</span>
            <span className="font-medium text-yellow-800">Certifications</span>
          </div>
          <p className="text-yellow-700 text-xs">
            Professional certifications, licenses, and credentials you&apos;ve earned.
          </p>
        </div>
      </div>
    </div>
  )
}
