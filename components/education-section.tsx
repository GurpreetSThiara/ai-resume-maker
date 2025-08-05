"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GraduationCap, Edit2, Save } from "lucide-react"
import type { ResumeData } from "@/app/create/page"

interface EducationSectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

export function EducationSection({ data, onUpdate }: EducationSectionProps) {
  const [newEducation, setNewEducation] = useState({ institution: "", details: [""] })
  const [editingEducation, setEditingEducation] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ institution: string; details: string[] }>({ institution: "", details: [] })
  const [isSectionDirty, setIsSectionDirty] = useState(false)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const educationSection = data.sections.find((s) => s.title === "Education") || { content: {} }

  useEffect(() => {
    // Check for unsaved changes whenever data or newEducation changes
    const initialContent = data.sections.find((s) => s.title === "Education")?.content || {}
    const hasChanges =
      JSON.stringify(educationSection.content) !== JSON.stringify(initialContent) ||
      newEducation.institution !== "" ||
      newEducation.details.some((detail) => detail !== "")
    setIsSectionDirty(hasChanges)
  }, [data, newEducation, educationSection.content])

  const addEducation = () => {
    if (newEducation.institution && newEducation.details[0]) {
      const updatedSections = data.sections.map((section) => {
        if (section.title === "Education") {
          return {
            ...section,
            content: {
              ...section.content,
              [newEducation.institution]: newEducation.details.filter((detail) => detail.trim()),
            },
          }
        }
        return section
      })
      onUpdate({ sections: updatedSections })
      setNewEducation({ institution: "", details: [""] })
      setIsAddingNew(false)
    }
  }

  const removeEducation = (institution: string) => {
    const updatedSections = data.sections.map((section) => {
      if (section.title === "Education") {
        const updatedContent = { ...section.content }
        delete updatedContent[institution]
        return { ...section, content: updatedContent }
      }
      return section
    })
    onUpdate({ sections: updatedSections })
  }

  const startEditing = (institution: string, details: string[]) => {
    setEditingEducation(institution)
    setEditData({ institution, details: [...details] })
  }

  const saveEdit = () => {
    if (editingEducation && editData.institution) {
      const updatedSections = data.sections.map((section) => {
        if (section.title === "Education") {
          const updatedContent = { ...section.content }
          delete updatedContent[editingEducation]
          updatedContent[editData.institution] = editData.details.filter((detail) => detail.trim())
          return { ...section, content: updatedContent }
        }
        return section
      })
      onUpdate({ sections: updatedSections })
      setEditingEducation(null)
      setEditData({ institution: "", details: [] })
    }
  }

  const cancelEdit = () => {
    setEditingEducation(null)
    setEditData({ institution: "", details: [] })
  }

  const addDetailField = () => {
    setNewEducation((prev) => ({
      ...prev,
      details: [...prev.details, ""],
    }))
  }

  const updateDetail = (index: number, value: string) => {
    setNewEducation((prev) => ({
      ...prev,
      details: prev.details.map((detail, i) => (i === index ? value : detail)),
    }))
  }

  const removeDetail = (index: number) => {
    setNewEducation((prev) => ({
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
    // This function currently does nothing, but it's here to indicate
    // where you would trigger the save for the entire section's data.
    // In a real application, you would likely call an API to persist
    // the data to a database.
    alert("Section saved!")
    setIsSectionDirty(false) // Reset the dirty state after saving
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Your Academic Journey 🎓</h2>
        <p className="text-muted-foreground">Share your educational background and achievements</p>
        {isSectionDirty && (
          <div className="text-yellow-500 mt-2">
            <span className="animate-pulse">*</span> Unsaved changes
          </div>
        )}
        <Button onClick={handleSectionSave} disabled={!isSectionDirty} className="mt-2">
          <Save className="w-4 h-4 mr-2" />
          Save Education Section
        </Button>
      </div>

      {/* Existing Education Entries */}
      <div className="space-y-4">
        {Object.entries(educationSection.content).map(([institution, details]) => (
          <Card key={institution} className="relative">
            {editingEducation === institution ? (
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="edit-institution">Institution & Degree</Label>
                  <Input
                    id="edit-institution"
                    value={editData.institution}
                    onChange={(e) => setEditData((prev) => ({ ...prev, institution: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Details</Label>
                  {editData.details.map((detail, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={detail}
                        onChange={(e) => updateEditDetail(index, e.target.value)}
                        placeholder={index === 0 ? "Graduation date" : "Additional detail"}
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
                      <GraduationCap className="w-5 h-5" />
                      {institution}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(institution, details)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(institution)}
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
                      <div key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
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

      {/* Add New Education */}
      <Card className={`border-dashed border-2 border-gray-300 ${isAddingNew ? "block" : "hidden"}`}>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Education
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="institution">Institution & Degree</Label>
            <Input
              id="institution"
              placeholder="e.g., Harvard University | Bachelor of Science in Computer Science"
              value={newEducation.institution}
              onChange={(e) => setNewEducation((prev) => ({ ...prev, institution: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div className="space-y-3">
            <Label>Details</Label>
            {newEducation.details.map((detail, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={index === 0 ? "Graduation date" : "Additional detail"}
                  value={detail}
                  onChange={(e) => updateDetail(index, e.target.value)}
                />
                {newEducation.details.length > 1 && (
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

          <Button onClick={addEducation} className="w-full">
            Add Education Entry
          </Button>
        </CardContent>
      </Card>

      {!isAddingNew && (
        <Button variant="outline" onClick={() => setIsAddingNew(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add New Education
        </Button>
      )}

      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-purple-600">📚</span>
          <span className="font-medium text-purple-800">Education Tips</span>
        </div>
        <p className="text-purple-700 text-sm">
          Include graduation dates, GPA (if impressive), honors, relevant coursework, and extracurricular activities
          that demonstrate leadership or skills.
        </p>
      </div>
    </div>
  )
}
