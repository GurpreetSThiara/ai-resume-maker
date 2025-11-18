"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Edit2, Save } from "lucide-react"
import { SectionVisibilityToggle } from "@/components/section-visibility-toggle"
import { SectionHiddenBanner } from "@/components/section-hidden-banner"
import { Textarea } from "@/components/ui/textarea"
import type { ResumeData, CustomSection } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"

interface CustomSectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

export function CustomSection({ data, onUpdate }: CustomSectionProps) {
  const [newSection, setNewSection] = useState<CustomSection>({
    id: "",
    title: "",
    type: SECTION_TYPES.CUSTOM,
    content: []
  })
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)
  const [editData, setEditData] = useState<CustomSection>({
    id: "",
    title: "",
    type: SECTION_TYPES.CUSTOM,
    content: []
  })

  const customSections = data.sections.filter((s): s is CustomSection => s.type === SECTION_TYPES.CUSTOM)

  const toggleCustomVisibility = (id: string) => {
    const updated = data.sections.map((s) => {
      if (s.id === id) return { ...s, hidden: !s.hidden }
      return s
    })
    onUpdate({ sections: updated })
  }

  const addSection = () => {
    if (newSection.title && newSection.content.length > 0) {
      const updatedSections = [
        ...data.sections,
        {
          ...newSection,
          id: `custom-${Date.now()}`
        }
      ]
      onUpdate({ sections: updatedSections })
      setNewSection({
        id: "",
        title: "",
        type: SECTION_TYPES.CUSTOM,
        content: []
      })
      setIsAddingNew(false)
    }
  }

  const removeSection = (id: string) => {
    const updatedSections = data.sections.filter(s => s.id !== id)
    onUpdate({ sections: updatedSections })
  }

  const startEditing = (section: CustomSection) => {
    setEditingSectionId(section.id)
    setEditData({ ...section })
  }

  const saveEdit = () => {
    if (editingSectionId && editData.title) {
      const updatedSections = data.sections.map(section =>
        section.id === editingSectionId ? editData : section
      )
      onUpdate({ sections: updatedSections })
      setEditingSectionId(null)
      setEditData({
        id: "",
        title: "",
        type: SECTION_TYPES.CUSTOM,
        content: []
      })
    }
  }

  const addContent = () => {
    setNewSection(prev => ({
      ...prev,
      content: [...prev.content, ""]
    }))
  }

  const updateContent = (index: number, value: string) => {
    setNewSection(prev => ({
      ...prev,
      content: prev.content.map((item, i) => i === index ? value : item)
    }))
  }

  const removeContent = (index: number) => {
    setNewSection(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Custom Sections 🎨</h2>
        <p className="text-muted-foreground">Add your own unique sections to highlight specific achievements or skills</p>
      </div>

      {/* Existing Custom Sections */}
      <div className="space-y-4">
        {customSections.map((section) => (
          <Card key={section.id} className="relative">
            {editingSectionId === section.id ? (
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="edit-title">Section Title</Label>
                  <Input
                    id="edit-title"
                    value={editData.title}
                    onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-3">
                  <Label>Content</Label>
                  {editData.content.map((text, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        value={text}
                        onChange={(e) => {
                          const newContent = [...editData.content]
                          newContent[index] = e.target.value
                          setEditData(prev => ({ ...prev, content: newContent }))
                        }}
                        rows={2}
                        disabled={section.hidden}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newContent = editData.content.filter((_, i) => i !== index)
                          setEditData(prev => ({ ...prev, content: newContent }))
                        }}
                        className="text-red-500"
                        disabled={section.hidden}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditData(prev => ({
                        ...prev,
                        content: [...prev.content, ""]
                      }))
                    }}
                    className="w-full bg-transparent"
                    disabled={section.hidden}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Content
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveEdit} className="flex-1" disabled={section.hidden}>
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingSectionId(null)
                      setEditData({
                        id: "",
                        title: "",
                        type: "custom",
                        content: []
                      })
                    }}
                    className="flex-1 bg-transparent"
                    disabled={section.hidden}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <div className="flex gap-2 items-center">
                      <SectionVisibilityToggle isHidden={section.hidden || false} onToggle={() => toggleCustomVisibility(section.id)} />
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(section)}
                          className="text-blue-500 hover:text-blue-700"
                          disabled={section.hidden}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSection(section.id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={section.hidden}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                {section.hidden && <SectionHiddenBanner />}
                <CardContent>
                  <div className="space-y-2">
                    {section.content.map((text, index) => (
                      <div key={index} className="text-sm">
                        {text}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Add New Custom Section */}
      {!isAddingNew ? (
        <Button variant="outline" onClick={() => setIsAddingNew(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Section
        </Button>
      ) : (
        <Card className="border-dashed border-2 border-gray-300">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Custom Section
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="section-title">Section Title</Label>
              <Input
                id="section-title"
                placeholder="e.g., Awards & Honors, Publications, Volunteer Work"
                value={newSection.title}
                onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="space-y-3">
              <Label>Content</Label>
              {newSection.content.map((text, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    placeholder="Add your content here"
                    value={text}
                    onChange={(e) => updateContent(index, e.target.value)}
                    rows={2}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeContent(index)}
                    className="text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={addContent}
                className="w-full bg-transparent"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Content
              </Button>
            </div>

            <Button onClick={addSection} className="w-full">
              Create Section
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-cyan-600">💡</span>
          <span className="font-medium text-cyan-800">Custom Section Tips</span>
        </div>
        <p className="text-cyan-700 text-sm">
          Use custom sections to highlight unique aspects of your profile such as awards, publications,
          volunteer work, or any other achievements that don&apos;t fit into standard categories.
        </p>
      </div>
    </div>
  )

}
