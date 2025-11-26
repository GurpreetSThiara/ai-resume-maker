"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Edit2, Globe } from "lucide-react"
import { SectionVisibilityToggle } from "@/components/section-visibility-toggle"
import { SectionHiddenBanner } from "@/components/section-hidden-banner"
import type { ResumeData, LanguagesSection as ILanguagesSection } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"

interface LanguagesSectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

export function LanguagesSection({ data, onUpdate }: LanguagesSectionProps) {
  const [newLanguage, setNewLanguage] = useState("")
  const [editingLanguage, setEditingLanguage] = useState<string | null>(null)
  const [editData, setEditData] = useState("")
  const [isAddingNew, setIsAddingNew] = useState(false)

  // Find the languages section
  const languagesSectionIndex = data.sections.findIndex((s) => s.type === SECTION_TYPES.LANGUAGES)
  const languagesSection = data.sections[languagesSectionIndex] as ILanguagesSection || {
    id: (data.sections.length + 1).toString(),
    title: "Languages",
    type: SECTION_TYPES.LANGUAGES,
    items: [],
    hidden: false
  }

  const isHidden = languagesSection.hidden || false

  const addLanguage = () => {
    if (newLanguage.trim()) {
      const languages = [...languagesSection.items, newLanguage.trim()]
      updateLanguagesSection(languages)
      setNewLanguage("")
      setIsAddingNew(false)
    }
  }

  const removeLanguage = (languageToRemove: string) => {
    const languages = languagesSection.items.filter(language => language !== languageToRemove)
    updateLanguagesSection(languages)
  }

  const startEditing = (language: string) => {
    setEditingLanguage(language)
    setEditData(language)
  }

  const saveEdit = () => {
    if (editingLanguage && editData.trim()) {
      const languages = languagesSection.items.map(language => 
        language === editingLanguage ? editData.trim() : language
      )
      updateLanguagesSection(languages)
      setEditingLanguage(null)
      setEditData("")
    }
  }

  const cancelEdit = () => {
    setEditingLanguage(null)
    setEditData("")
  }

  // Helper to update or create the languages section
  const updateLanguagesSection = (languages: string[], hidden?: boolean) => {
    const updatedSections = [...data.sections]
    if (languagesSectionIndex === -1) {
      updatedSections.push({
        id: (data.sections.length + 1).toString(),
        title: "Languages",
        type: SECTION_TYPES.LANGUAGES,
        items: languages,
        hidden: hidden ?? false
      })
    } else {
      updatedSections[languagesSectionIndex] = {
        ...languagesSection,
        items: languages,
        hidden: hidden ?? languagesSection.hidden
      }
    }
    onUpdate({ sections: updatedSections })
  }

  const toggleVisibility = () => {
    updateLanguagesSection(languagesSection.items, !isHidden)
  }

  return (
    <div className="space-y-6">
      {/* Header with visibility toggle */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Languages 🌐</h2>
          <p className="text-muted-foreground text-sm">Showcase the languages you speak and your proficiency level</p>
        </div>
        <SectionVisibilityToggle isHidden={isHidden} onToggle={toggleVisibility} />
      </div>

      {/* Disabled overlay when hidden */}
      {isHidden && <SectionHiddenBanner />}

      {/* Existing Languages */}
      <div className="space-y-3">
        {languagesSection.items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No languages added yet</p>
          </div>
        ) : (
          languagesSection.items.map((language) => (
            <Card key={language} className={`relative transition-all ${isHidden ? 'opacity-50 bg-gray-50' : ''}`}>
              {editingLanguage === language ? (
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label htmlFor={`edit-language-${language}`}>Edit Language</Label>
                    <Input
                      id={`edit-language-${language}`}
                      value={editData}
                      onChange={(e) => setEditData(e.target.value)}
                      placeholder="e.g., English (Native), Spanish (Fluent)"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={saveEdit}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{language}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(language)}
                        disabled={isHidden}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeLanguage(language)}
                        disabled={isHidden}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Add New Language */}
      {!isHidden && (
        <Card>
          <CardContent className="pt-6">
            {isAddingNew ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-language">Add Language</Label>
                  <Input
                    id="new-language"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="e.g., English (Native), Spanish (Fluent)"
                    className="mt-1"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={addLanguage}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Language
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setIsAddingNew(false)
                    setNewLanguage("")
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setIsAddingNew(true)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Language
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
