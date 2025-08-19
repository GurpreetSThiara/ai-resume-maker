"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Briefcase, Edit2, Save } from "lucide-react"
import type { ResumeData, Experience, ExperienceSection as ExperienceSectionType } from "@/types/resume"

interface ExperienceSectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

export function ExperienceSection({ data, onUpdate }: ExperienceSectionProps) {
  const [newExperience, setNewExperience] = useState<Experience>({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    location: "",
    achievements: []
  })
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Experience>({
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    location: "",
    achievements: []
  })
  const [isSectionDirty, setIsSectionDirty] = useState(false)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const experienceSection = data.sections.find((s): s is ExperienceSectionType => s.type === "experience") || {
    id: "experience",
    title: "Professional Experience",
    type: "experience" as const,
    items: []
  }

  useEffect(() => {
    // Compare the current state with the original data to determine if there are unsaved changes
    const originalContent = data.sections.find((s) => s.title === "Professional Experience")?.content || {}
    const currentContent = experienceSection.content

    const isDifferent = JSON.stringify(originalContent) !== JSON.stringify(currentContent)
    setIsSectionDirty(isDifferent)
  }, [experienceSection.content, data.sections])

  const addExperience = () => {
    if (newExperience.company && newExperience.details[0]) {
      const updatedSections = data.sections.map((section) => {
        if (section.title === "Professional Experience") {
          return {
            ...section,
            content: {
              ...section.content,
              [newExperience.company]: newExperience.details.filter((detail) => detail.trim()),
            },
          }
        }
        return section
      })
      onUpdate({ sections: updatedSections })
      setNewExperience({ company: "", details: [""] })
      setIsAddingNew(false) // Hide the "Add New" form after adding
    }
  }

  const removeExperience = (company: string) => {
    const updatedSections = data.sections.map((section) => {
      if (section.title === "Professional Experience") {
        const updatedContent = { ...section.content }
        delete updatedContent[company]
        return { ...section, content: updatedContent }
      }
      return section
    })
    onUpdate({ sections: updatedSections })
  }

  const startEditing = (company: string, details: string[]) => {
    setEditingExperience(company)
    setEditData({ company, details: [...details] })
  }

  const saveEdit = () => {
    if (editingExperience && editData.company) {
      const updatedSections = data.sections.map((section) => {
        if (section.title === "Professional Experience") {
          const updatedContent = { ...section.content }
          delete updatedContent[editingExperience]
          updatedContent[editData.company] = editData.details.filter((detail) => detail.trim())
          return { ...section, content: updatedContent }
        }
        return section
      })
      onUpdate({ sections: updatedSections })
      setEditingExperience(null)
      setEditData({ company: "", details: [] })
    }
  }

  const cancelEdit = () => {
    setEditingExperience(null)
    setEditData({ company: "", details: [] })
  }

  const addDetailField = () => {
    setNewExperience((prev) => ({
      ...prev,
      details: [...prev.details, ""],
    }))
  }

  const updateDetail = (index: number, value: string) => {
    setNewExperience((prev) => ({
      ...prev,
      details: prev.details.map((detail, i) => (i === index ? value : detail)),
    }))
  }

  const removeDetail = (index: number) => {
    setNewExperience((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }))
  }

  const updateEditDetail = (index: number, value: string) => {
    setEditData((prev) => ({
      ...prev,
      details: prev.details.map((detail, i) => (i === index ? value : detail)),
    }))
  }

  const addEditDetailField = () => {
    setEditData((prev) => ({
      ...prev,
      details: [...prev.details, ""],
    }))
  }

  const removeEditDetail = (index: number) => {
    setEditData((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }))
  }

  const handleSectionSave = () => {
    // This function will be called when the section-level save button is clicked.
    // In this example, it doesn't do anything, as the onUpdate function already saves the data.
    // You can add any additional logic here if needed.
    setIsSectionDirty(false) // Clear the dirty state after saving
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2 inline-flex items-center">Professional Experience 💼</h2>
          <p className="text-muted-foreground">Showcase your career achievements and impact</p>
        </div>
        {isSectionDirty && (
          <Button variant="outline" size="sm" onClick={handleSectionSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Section
          </Button>
        )}
      </div>

      {/* Existing Experience Entries */}
      <div className="space-y-4">
        {Object.entries(experienceSection?.content ?? {}).map(([company, details]) => (
          <Card key={company} className="relative">
            {editingExperience === company ? (
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="edit-company">Company & Position</Label>
                  <Input
                    id="edit-company"
                    value={editData.company}
                    onChange={(e) => setEditData((prev) => ({ ...prev, company: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Experience Details</Label>
                  {editData.details.map((detail, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={detail}
                        onChange={(e) => updateEditDetail(index, e.target.value)}
                        placeholder={
                          index === 0
                            ? "Employment dates (e.g., Jan 2020 - Present)"
                            : index === 1
                              ? "Location (e.g., San Francisco, CA)"
                              : "Achievement or responsibility"
                        }
                      />
                      {editData.details.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEditDetail(index)}
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button variant="outline" size="sm" onClick={addEditDetailField} className="w-full bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Detail
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
                      <Briefcase className="w-5 h-5" />
                      {company}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(company, details)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(company)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {details.map((detail, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                        <span className="text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Add New Experience */}
      {!isAddingNew ? (
        <Button variant="outline" onClick={() => setIsAddingNew(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience Entry
        </Button>
      ) : (
        <Card className="border-dashed border-2 border-gray-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company">Company & Position</Label>
              <Input
                id="company"
                placeholder="e.g., Google Inc. | Senior Software Engineer"
                value={newExperience.company}
                onChange={(e) => setNewExperience((prev) => ({ ...prev, company: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="space-y-3">
              <Label>Experience Details</Label>
              {newExperience?.details?.map((detail, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={
                      index === 0
                        ? "Employment dates (e.g., Jan 2020 - Present)"
                        : index === 1
                          ? "Location (e.g., San Francisco, CA)"
                          : "Achievement or responsibility"
                    }
                    value={detail}
                    onChange={(e) => updateDetail(index, e.target.value)}
                  />
                  {newExperience.details.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => removeDetail(index)} className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button variant="outline" size="sm" onClick={addDetailField} className="w-full bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add Detail
              </Button>
            </div>

            <Button onClick={addExperience} className="w-full">
              Save Experience Entry
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-orange-600">🎯</span>
          <span className="font-medium text-orange-800">Pro Tips</span>
        </div>
        <p className="text-orange-700 text-sm">
          Use action verbs and quantify your achievements. Focus on impact and results rather than just listing
          responsibilities. Numbers and percentages make your accomplishments stand out!
        </p>
      </div>
    </div>
  )
}
