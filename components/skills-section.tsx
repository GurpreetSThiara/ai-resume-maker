"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Rocket, Edit2, Save } from "lucide-react"
import type { ResumeData } from "@/types/resume"

interface SkillsSectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

export function SkillsSection({ data, onUpdate }: SkillsSectionProps) {
  console.log("data",data)
  const [newSkillCategory, setNewSkillCategory] = useState({ category: "", skills: [""] })
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ category: string; skills: string[] }>({ category: "", skills: [] })
  // Remove isSectionDirty and handleSectionSave logic
  // Remove section-level save button and unsaved changes indicator in the render
  const [isAddingNew, setIsAddingNew] = useState(false)

  // Find the section whose title contains 'skill' (case-insensitive)
  let skillsSectionIndex = data.sections.findIndex((s: { title: string }) => /skill/i.test(s.title))
  let skillsSection = data.sections[skillsSectionIndex] || { id: (data.sections.length+1).toString(), title: "Skills & More", content: {} }

  // Helper to update or create the skills section
  const updateSkillsSection = (newContent: Record<string, string[]>) => {
    let updatedSections = [...data.sections]
    if (skillsSectionIndex === -1) {
      // Create new skills section
      updatedSections.push({
        id: (data.sections.length+1).toString(),
        title: "Skills & More",
        content: newContent
      })
    } else {
      updatedSections[skillsSectionIndex] = {
        ...skillsSection,
        content: newContent
      }
    }
    onUpdate({ sections: updatedSections })
  }

  useEffect(() => {
    // Check if the current data differs from the initial data
    const initialSkillsSection = data.sections.find((s) => s.title === "Other") || { content: {} }
    const isDifferent = JSON.stringify(skillsSection.content) !== JSON.stringify(initialSkillsSection.content)
    // setIsSectionDirty(isDifferent) // Removed
  }, [data.sections, skillsSection.content])

  const addSkillCategory = () => {
    if (newSkillCategory.category && newSkillCategory.skills[0]) {
      const newContent: Record<string, string[]> = {
        ...skillsSection.content,
        [newSkillCategory.category]: newSkillCategory.skills.filter((skill: string) => skill.trim()),
      }
      updateSkillsSection(newContent)
      setNewSkillCategory({ category: "", skills: [""] })
      setIsAddingNew(false)
    }
  }

  const removeSkillCategory = (category: string) => {
    const newContent: Record<string, string[]> = { ...skillsSection.content }
    delete newContent[category]
    updateSkillsSection(newContent)
  }

  const startEditing = (category: string, skills: string[]) => {
    setEditingCategory(category)
    setEditData({ category, skills: [...skills] })
  }

  const saveEdit = () => {
    if (editingCategory && editData.category) {
      const newContent: Record<string, string[]> = { ...skillsSection.content }
      delete newContent[editingCategory]
      newContent[editData.category] = editData.skills.filter((skill: string) => skill.trim())
      updateSkillsSection(newContent)
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

  // Remove handleSectionSave
  // const handleSectionSave = () => {
  //   setIsSectionDirty(false)
  // }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Skills & More 🚀</h2>
        <p className="text-muted-foreground">Highlight your technical skills, languages, and certifications</p>
        {/* Remove isSectionDirty and handleSectionSave logic */}
        {/* Remove section-level save button and unsaved changes indicator in the render */}
      </div>

      {/* Existing Skill Categories */}
      <div className="space-y-4">
        {Object.entries(skillsSection.content).map(([category, skills]: [string, string[]]) => (
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
                    {skills.map((skill: string, index: number) => (
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
