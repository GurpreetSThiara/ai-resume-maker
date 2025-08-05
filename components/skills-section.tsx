"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Rocket, Edit2, Save } from "lucide-react"
import type { ResumeData } from "@/app/create/page"

interface SkillsSectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

export function SkillsSection({ data, onUpdate }: SkillsSectionProps) {
  const [newSkillCategory, setNewSkillCategory] = useState({ category: "", skills: [""] })
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ category: string; skills: string[] }>({ category: "", skills: [] })
  const [isSectionDirty, setIsSectionDirty] = useState(false)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const skillsSection = data.sections.find((s) => s.title === "Other") || { content: {} }

  useEffect(() => {
    // Check if the current data differs from the initial data
    const initialSkillsSection = data.sections.find((s) => s.title === "Other") || { content: {} }
    const isDifferent = JSON.stringify(skillsSection.content) !== JSON.stringify(initialSkillsSection.content)
    setIsSectionDirty(isDifferent)
  }, [data.sections, skillsSection.content])

  const addSkillCategory = () => {
    if (newSkillCategory.category && newSkillCategory.skills[0]) {
      const updatedSections = data.sections.map((section) => {
        if (section.title === "Other") {
          return {
            ...section,
            content: {
              ...section.content,
              [newSkillCategory.category]: newSkillCategory.skills.filter((skill) => skill.trim()),
            },
          }
        }
        return section
      })
      onUpdate({ sections: updatedSections })
      setNewSkillCategory({ category: "", skills: [""] })
      setIsAddingNew(false)
    }
  }

  const removeSkillCategory = (category: string) => {
    const updatedSections = data.sections.map((section) => {
      if (section.title === "Other") {
        const updatedContent = { ...section.content }
        delete updatedContent[category]
        return { ...section, content: updatedContent }
      }
      return section
    })
    onUpdate({ sections: updatedSections })
  }

  const startEditing = (category: string, skills: string[]) => {
    setEditingCategory(category)
    setEditData({ category, skills: [...skills] })
  }

  const saveEdit = () => {
    if (editingCategory && editData.category) {
      const updatedSections = data.sections.map((section) => {
        if (section.title === "Other") {
          const updatedContent = { ...section.content }
          delete updatedContent[editingCategory]
          updatedContent[editData.category] = editData.skills.filter((skill) => skill.trim())
          return { ...section, content: updatedContent }
        }
        return section
      })
      onUpdate({ sections: updatedSections })
      setEditingCategory(null)
      setEditData({ category: "", skills: [] })
    }
  }

  const cancelEdit = () => {
    setEditingCategory(null)
    setEditData({ category: "", skills: [] })
  }

  const addSkillField = () => {
    setNewSkillCategory((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }))
  }

  const updateSkill = (index: number, value: string) => {
    setNewSkillCategory((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) => (i === index ? value : skill)),
    }))
  }

  const removeSkill = (index: number) => {
    setNewSkillCategory((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const updateEditSkill = (index: number, value: string) => {
    setEditData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill, i) => (i === index ? value : skill)),
    }))
  }

  const addEditSkillField = () => {
    setEditData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }))
  }

  const removeEditSkill = (index: number) => {
    setEditData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const handleSectionSave = () => {
    setIsSectionDirty(false)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Skills & More 🚀</h2>
        <p className="text-muted-foreground">Highlight your technical skills, languages, and certifications</p>
        {isSectionDirty && (
          <div className="flex items-center justify-center mt-2">
            <span className="text-sm text-orange-500 mr-1">Unsaved Changes</span>
            <Save className="w-4 h-4 text-orange-500" />
            <Button size="sm" onClick={handleSectionSave}>
              Save Section
            </Button>
          </div>
        )}
      </div>

      {/* Existing Skill Categories */}
      <div className="space-y-4">
        {Object.entries(skillsSection.content).map(([category, skills]) => (
          <Card key={category} className="relative">
            {editingCategory === category ? (
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="edit-category">Category Name</Label>
                  <Input
                    id="edit-category"
                    value={editData.category}
                    onChange={(e) => setEditData((prev) => ({ ...prev, category: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Skills/Items</Label>
                  {editData.skills.map((skill, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={skill}
                        onChange={(e) => updateEditSkill(index, e.target.value)}
                        placeholder="Enter skill, language, or certification"
                      />
                      {editData.skills.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEditSkill(index)}
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button variant="outline" size="sm" onClick={addEditSkillField} className="w-full bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Skill
                  </Button>
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
                      {category}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(category, skills)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkillCategory(category)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Add New Skill Category */}
      <Card className={`border-dashed border-2 border-gray-300 ${isAddingNew ? "border-blue-500" : ""}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {isAddingNew ? "Adding Skill Category" : "Add Skill Category"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAddingNew ? (
            <>
              <div>
                <Label htmlFor="category">Category Name</Label>
                <Input
                  id="category"
                  placeholder="e.g., Technical Skills, Languages, Certifications"
                  value={newSkillCategory.category}
                  onChange={(e) => setNewSkillCategory((prev) => ({ ...prev, category: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div className="space-y-3">
                <Label>Skills/Items</Label>
                {newSkillCategory.skills.map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Enter skill, language, or certification"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                    />
                    {newSkillCategory.skills.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeSkill(index)} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button variant="outline" size="sm" onClick={addSkillField} className="w-full bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>

              <Button onClick={addSkillCategory} className="w-full">
                Save Category
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsAddingNew(true)} className="w-full">
              Add Entry
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
            Programming languages, frameworks, tools, and technologies you're proficient in.
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
            Professional certifications, licenses, and credentials you've earned.
          </p>
        </div>
      </div>
    </div>
  )
}
