"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GraduationCap, Edit2, Save } from "lucide-react"
import type { ResumeData, Education, EducationSection as EducationSectionType } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"
import { DEFAULT_EDUCATION } from "@/constants/resumeConstants"

interface EducationSectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

export function EducationSection({ data, onUpdate }: EducationSectionProps) {
  const [newEducation, setNewEducation] = useState<Education>(DEFAULT_EDUCATION)
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Education>(DEFAULT_EDUCATION)

  const [isAddingNew, setIsAddingNew] = useState(false)

  const educationSection = data.sections.find((s) => s.type === SECTION_TYPES.EDUCATION)



  const addEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      const updatedSections = data.sections.map((section) => {
        if (section.type === SECTION_TYPES.EDUCATION) {
          return {
            ...section,
            items: [...section.items, { 
              ...newEducation,
              highlights: newEducation?.highlights?.filter(h => h.trim())
            }]
          }
        }
        return section
      })
      onUpdate({ sections: updatedSections })
      setNewEducation({
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        location: "",
        highlights: []
      })
      setIsAddingNew(false)
    }
  }

  const removeEducation = (index: number) => {
    const updatedSections = data.sections.map((section) => {
      if (section.type === SECTION_TYPES.EDUCATION) {
        return {
          ...section,
          items: section.items.filter((_, i) => i !== index)
        }
      }
      return section
    })
    onUpdate({ sections: updatedSections })
  }

  const startEditing = (education: Education, index: number) => {
    setEditingEducationId(index.toString())
    setEditData({ ...education })
  }

  const saveEdit = () => {
    if (editingEducationId !== null && editData.institution) {
      const index = parseInt(editingEducationId)
      const updatedSections = data.sections.map((section) => {
        if (section.type === SECTION_TYPES.EDUCATION) {
          const updatedItems = [...section.items]
          updatedItems[index] = {
            ...editData,
            highlights: editData?.highlights?.filter(h => h.trim())
          }
          return {
            ...section,
            items: updatedItems
          }
        }
        return section
      })
      onUpdate({ sections: updatedSections })
      setEditingEducationId(null)
      setEditData({
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        location: "",
        highlights: []
      })
    }
  }

  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Your Academic Journey 🎓</h2>
        <p className="text-muted-foreground">Share your educational background and achievements</p>
  
      </div>

      {/* Existing Education Entries */}
      <div className="space-y-4">
        {educationSection.items.map((education, index) => (
          <Card key={index} className="relative">
            {editingEducationId === index.toString() ? (
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-institution">Institution</Label>
                    <Input
                      id="edit-institution"
                      value={editData.institution}
                      onChange={(e) => setEditData((prev) => ({ ...prev, institution: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-degree">Degree</Label>
                    <Input
                      id="edit-degree"
                      value={editData.degree}
                      onChange={(e) => setEditData((prev) => ({ ...prev, degree: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-start-date">Start Date</Label>
                      <Input
                        id="edit-start-date"
                        value={editData.startDate}
                        onChange={(e) => setEditData((prev) => ({ ...prev, startDate: e.target.value }))}
                        placeholder="MM/YYYY"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-end-date">End Date</Label>
                      <Input
                        id="edit-end-date"
                        value={editData.endDate}
                        onChange={(e) => setEditData((prev) => ({ ...prev, endDate: e.target.value }))}
                        placeholder="MM/YYYY or Present"
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
                </div>

                <div className="space-y-3">
                  <Label>Highlights & Achievements</Label>
                  {(editData.highlights || []).map((highlight, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={highlight}
                        onChange={(e) => {
                          const newHighlights = [...(editData.highlights || [])];
                          newHighlights[index] = e.target.value;
                          setEditData(prev => ({ ...prev, highlights: newHighlights }));
                        }}
                        placeholder="Achievement or highlight"
                      />
                      {(editData.highlights?.length || 0) > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newHighlights = editData.highlights?.filter((_, i) => i !== index) || [];
                            setEditData(prev => ({ ...prev, highlights: newHighlights }));
                          }}
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditData(prev => ({
                        ...prev,
                        highlights: [...(prev.highlights || []), ""]
                      }));
                    }}
                    className="w-full bg-transparent"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Highlight
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveEdit} className="flex-1">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setEditingEducationId(null);
                    setEditData({
                      institution: "",
                      degree: "",
                      startDate: "",
                      endDate: "",
                      location: "",
                      highlights: []
                    });
                  }} className="flex-1 bg-transparent">
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
                      {education.institution}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(education, index)}
                        className="text-blue-500 hover:text-blue-700 cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-medium">{education.degree}</div>
                    <div className="text-sm text-muted-foreground">
                      {education.startDate} - {education.endDate}
                      {education.location && ` • ${education.location}`}
                    </div>
                    {education.highlights && education.highlights.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {education.highlights.map((highlight, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    )}
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
          <div className="space-y-4">
            <div>
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                placeholder="e.g., Harvard University"
                value={newEducation.institution}
                onChange={(e) => setNewEducation((prev) => ({ ...prev, institution: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                placeholder="e.g., Bachelor of Science in Computer Science"
                value={newEducation.degree}
                onChange={(e) => setNewEducation((prev) => ({ ...prev, degree: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  placeholder="MM/YYYY"
                  value={newEducation.startDate}
                  onChange={(e) => setNewEducation((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  placeholder="MM/YYYY or Present"
                  value={newEducation.endDate}
                  onChange={(e) => setNewEducation((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Cambridge, MA"
                value={newEducation.location}
                onChange={(e) => setNewEducation((prev) => ({ ...prev, location: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Highlights & Achievements</Label>
            {(newEducation.highlights || []).map((highlight, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="e.g., Dean's List, Research Project, etc."
                  value={highlight}
                  onChange={(e) => {
                    const newHighlights = [...(newEducation.highlights || [])];
                    newHighlights[index] = e.target.value;
                    setNewEducation(prev => ({ ...prev, highlights: newHighlights }));
                  }}
                />
                {(newEducation.highlights?.length || 0) > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newHighlights = newEducation.highlights?.filter((_, i) => i !== index) || [];
                      setNewEducation(prev => ({ ...prev, highlights: newHighlights }));
                    }}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNewEducation(prev => ({
                  ...prev,
                  highlights: [...(prev.highlights || []), ""]
                }));
              }}
              className="w-full bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Highlight
            </Button>
          </div>

          <Button onClick={addEducation} className="w-full">
            Save Education
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
          Include your degree details, graduation dates, academic honors, relevant coursework, and any significant
          research projects or academic achievements that showcase your expertise.
        </p>
      </div>
    </div>
  )
}
