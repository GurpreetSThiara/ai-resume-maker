"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Briefcase, Edit2, Save } from "lucide-react"
import type { ResumeData, Experience, ExperienceSection as ExperienceSectionType } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"

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
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
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

  const experienceSection = data.sections.find((s): s is ExperienceSectionType => s.type === SECTION_TYPES.EXPERIENCE) || {
    id: "experience",
    title: "Professional Experience",
    type: SECTION_TYPES.EXPERIENCE,
    items: []
  }

  useEffect(() => {
    // Compare the current state with the original data to determine if there are unsaved changes
    const originalItems = data.sections.find((s) => s.type === SECTION_TYPES.EXPERIENCE)?.items || []
    const currentItems = experienceSection.items
    const isDifferent = JSON.stringify(originalItems) !== JSON.stringify(currentItems)
    setIsSectionDirty(isDifferent)
  }, [experienceSection.items, data.sections])

  const addExperience = () => {
    if (newExperience.company && newExperience.role) {
      const updatedSections = data.sections.map((section) => {
        if (section.type === SECTION_TYPES.EXPERIENCE) {
          return {
            ...section,
            items: [...(section.items || []), newExperience],
          }
        }
        return section
      })
      onUpdate({ sections: updatedSections })
      setNewExperience({ company: "", role: "", startDate: "", endDate: "", location: "", achievements: [] })
      setIsAddingNew(false)
    }
  }

  const removeExperience = (index: number) => {
    const updatedSections = data.sections.map((section) => {
      if (section.type === SECTION_TYPES.EXPERIENCE) {
        return {
          ...section,
          items: section.items.filter((_, i) => i !== index),
        }
      }
      return section
    })
    onUpdate({ sections: updatedSections })
  }

  const startEditing = (index: number, exp: Experience) => {
    setEditingIndex(index)
    setEditData({ ...exp })
  }

  const saveEdit = () => {
    if (editingIndex !== null && editData.company && editData.role) {
      const updatedSections = data.sections.map((section) => {
        if (section.type === SECTION_TYPES.EXPERIENCE) {
          const newItems = [...section.items]
          newItems[editingIndex] = editData
          return {
            ...section,
            items: newItems,
          }
        }
        return section
      })
      onUpdate({ sections: updatedSections })
      setEditingIndex(null)
      setEditData({ company: "", role: "", startDate: "", endDate: "", location: "", achievements: [] })
    }
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setEditData({ company: "", role: "", startDate: "", endDate: "", location: "", achievements: [] })
  }

  const addAchievementField = () => {
    setNewExperience((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), ""],
    }))
  }

  const updateAchievement = (index: number, value: string) => {
    setNewExperience((prev) => ({
      ...prev,
      achievements: prev.achievements.map((ach, i) => (i === index ? value : ach)),
    }))
  }

  const removeAchievement = (index: number) => {
    setNewExperience((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }))
  }

  const updateEditAchievement = (index: number, value: string) => {
    setEditData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((ach, i) => (i === index ? value : ach)),
    }))
  }

  const addEditAchievementField = () => {
    setEditData((prev) => ({
      ...prev,
      achievements: [...(prev.achievements || []), ""],
    }))
  }

  const removeEditAchievement = (index: number) => {
    setEditData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
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
        {experienceSection.items.map((exp, index) => (
          <Card key={index} className="relative">
            {editingIndex === index ? (
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="edit-company">Company</Label>
                  <Input
                    id="edit-company"
                    value={editData.company}
                    onChange={(e) => setEditData((prev) => ({ ...prev, company: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Role</Label>
                  <Input
                    id="edit-role"
                    value={editData.role}
                    onChange={(e) => setEditData((prev) => ({ ...prev, role: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label htmlFor="edit-start">Start Date</Label>
                    <Input
                      id="edit-start"
                      value={editData.startDate}
                      onChange={(e) => setEditData((prev) => ({ ...prev, startDate: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="edit-end">End Date</Label>
                    <Input
                      id="edit-end"
                      value={editData.endDate}
                      onChange={(e) => setEditData((prev) => ({ ...prev, endDate: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={editData.location}
                    onChange={(e) => setEditData((prev) => ({ ...prev, location: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div className="space-y-3">
                  <Label>Achievements</Label>
                  {editData.achievements?.map((ach, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={ach}
                        onChange={(e) => updateEditAchievement(i, e.target.value)}
                        placeholder="Achievement or responsibility"
                      />
                      {editData.achievements.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEditAchievement(i)}
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addEditAchievementField} className="w-full bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Achievement
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
                      {exp.company} | {exp.role}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(index, exp)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{exp.startDate} - {exp.endDate}</span>
                      {exp.location && <span>{exp.location}</span>}
                    </div>
                    {exp.achievements?.map((ach, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></span>
                        <span className="text-sm">{ach}</span>
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
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="e.g., Google Inc."
                value={newExperience.company}
                onChange={(e) => setNewExperience((prev) => ({ ...prev, company: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                placeholder="e.g., Senior Software Engineer"
                value={newExperience.role}
                onChange={(e) => setNewExperience((prev) => ({ ...prev, role: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="start">Start Date</Label>
                <Input
                  id="start"
                  placeholder="e.g., Jan 2020"
                  value={newExperience.startDate}
                  onChange={(e) => setNewExperience((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="end">End Date</Label>
                <Input
                  id="end"
                  placeholder="e.g., Present"
                  value={newExperience.endDate}
                  onChange={(e) => setNewExperience((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA"
                value={newExperience.location}
                onChange={(e) => setNewExperience((prev) => ({ ...prev, location: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div className="space-y-3">
              <Label>Achievements</Label>
              {newExperience.achievements?.map((ach, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Achievement or responsibility"
                    value={ach}
                    onChange={(e) => updateAchievement(i, e.target.value)}
                  />
                  {newExperience.achievements.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => removeAchievement(i)} className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addAchievementField} className="w-full bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
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
