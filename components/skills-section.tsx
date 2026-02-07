"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Edit2, Zap, FolderPlus, Tag } from "lucide-react"
import { SectionVisibilityToggle } from "@/components/section-visibility-toggle"
import { SectionHiddenBanner } from "@/components/section-hidden-banner"
import type { ResumeData, SkillsSection as ISkillsSection, SkillGroup } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"

interface SkillsSectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

export function SkillsSection({ data, onUpdate }: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState("")
  const [newSkillCategory, setNewSkillCategory] = useState("")
  const [isAddingNew, setIsAddingNew] = useState(false)

  // Find the skills section
  const skillsSectionIndex = data.sections.findIndex((s) => s.type === SECTION_TYPES.SKILLS)
  const skillsSection = (data.sections[skillsSectionIndex] as ISkillsSection) || {
    id: (data.sections.length + 1).toString(),
    title: "Skills & More",
    type: SECTION_TYPES.SKILLS,
    items: [],
    hidden: false,
    groups: undefined,
  }

  // Build effective grouped structure:
  // - If `groups` exists and has entries, use it
  // - Otherwise, treat legacy flat items as a single "General" group
  const effectiveGroups: SkillGroup[] =
    skillsSection.groups && skillsSection.groups.length > 0
      ? skillsSection.groups
      : [{
          id: "general",
          title: "General",
          skills: skillsSection.items || [],
        }]

  const isHidden = skillsSection.hidden || false

  // Helper to update or create the skills section, always keeping
  // the flat `items` array in sync with grouped skills for backward compatibility.
  const updateSkillsSection = (groups: SkillGroup[], hidden?: boolean) => {
    const flatItems = groups.flatMap(group => group.skills)

    const updatedSections = [...data.sections]
    if (skillsSectionIndex === -1) {
      updatedSections.push({
        id: (data.sections.length + 1).toString(),
        title: "Skills & More",
        type: SECTION_TYPES.SKILLS,
        items: flatItems,
        groups,
        hidden: hidden ?? false,
      })
    } else {
      updatedSections[skillsSectionIndex] = {
        ...skillsSection,
        items: flatItems,
        groups,
        hidden: hidden ?? skillsSection.hidden,
      }
    }
    onUpdate({ sections: updatedSections })
  }

  const addSkillToGroup = () => {
    const skillValue = newSkill.trim()
    if (!skillValue) return

    const categoryTitle = (newSkillCategory.trim() || "General")

    // Try to find an existing group by title (case-insensitive)
    const existingGroup = effectiveGroups.find(
      g => (g.title || "").toLowerCase() === categoryTitle.toLowerCase()
    )

    let updatedGroups: SkillGroup[]

    if (existingGroup) {
      updatedGroups = effectiveGroups.map(group =>
        group.id === existingGroup.id
          ? { ...group, skills: [...group.skills, skillValue] }
          : group
      )
    } else {
      const newGroup: SkillGroup = {
        id: Date.now().toString(),
        title: categoryTitle,
        skills: [skillValue],
      }
      updatedGroups = [...effectiveGroups, newGroup]
    }

    updateSkillsSection(updatedGroups)
    setNewSkill("")
    setNewSkillCategory("")
    setIsAddingNew(false)
  }

  const updateGroupTitle = (groupId: string, title: string) => {
    const updatedGroups = effectiveGroups.map(group =>
      group.id === groupId ? { ...group, title } : group
    )

    updateSkillsSection(updatedGroups)
  }

  const removeGroup = (groupId: string) => {
    // Prevent removing the last remaining group; instead, just clear its skills
    if (effectiveGroups.length === 1) {
      const onlyGroup = effectiveGroups[0]
      const clearedGroup: SkillGroup = { ...onlyGroup, skills: [] }
      updateSkillsSection([clearedGroup])
      return
    }

    const updatedGroups = effectiveGroups.filter(group => group.id !== groupId)
    updateSkillsSection(updatedGroups)
  }

  const toggleVisibility = () => {
    updateSkillsSection(effectiveGroups, !isHidden)
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

      {/* Existing Skills (grouped) */}
      <div className="space-y-4">
        {effectiveGroups.every(group => group.skills.length === 0) ? (
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No skills added yet</p>
          </div>
        ) : (
          effectiveGroups.map((group) => (
            <Card
              key={group.id}
              className={`relative transition-all ${isHidden ? "opacity-50 bg-gray-50" : ""}`}
            >
              <CardHeader className="pb-3 flex flex-row items-center justify-between gap-3">
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-500 shrink-0" />
                  <Input
                    value={group.title}
                    onChange={(e) => updateGroupTitle(group.id, e.target.value)}
                    placeholder="Category title (e.g., Frontend, Backend, Tools)"
                    className="font-medium h-8"
                    disabled={isHidden}
                  />
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGroup(group.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={isHidden}
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-2">
                {group.skills.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    No skills in this category yet.
                  </p>
                ) : (
                  <div key={`${group.id}-skills`} className="space-y-2">
                    <Label htmlFor={`skills-${group.id}`}>Skills</Label>
                    <Input
                      id={`skills-${group.id}`}
                      value={group.skills.join(', ')}
                      onChange={(e) => {
                        const newSkills = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
                        const updatedGroups = effectiveGroups.map(g =>
                          g.id === group.id ? { ...g, skills: newSkills } : g
                        )
                        updateSkillsSection(updatedGroups)
                      }}
                      placeholder="Enter skills separated by commas (e.g., React, Vue, Angular)"
                      className="mt-1"
                      disabled={isHidden}
                    />
                  </div>
                )}
              </CardContent>
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
                <Label htmlFor="skill-category">Skill Category</Label>
                <Input
                  id="skill-category"
                  placeholder="e.g., Frontend, Backend, Tools (leave empty for General)"
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="mt-1"
                  disabled={isHidden}
                />
              </div>

              <div>
                <Label htmlFor="new-skill">New Skill</Label>
                <Input
                  id="new-skill"
                  placeholder="e.g., React, Python, Leadership"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="mt-1"
                  disabled={isHidden}
                  onKeyPress={(e) => e.key === "Enter" && addSkillToGroup()}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={addSkillToGroup} 
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
