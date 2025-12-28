"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Link } from "lucide-react"
import type { ResumeData } from "@/app/page"

interface CustomFieldsSectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
  onSave: () => void
  isDirty: boolean
}

export function CustomFieldsSection({ data, onUpdate, onSave, isDirty }: CustomFieldsSectionProps) {
  const [newField, setNewField] = useState({ title: "", content: "", link: false })
  const [isEditing, setIsEditing] = useState(false)

  const addCustomField = () => {
    if (newField.title && newField.content) {
      const id = `custom_${newField.title.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`
      // Get max order from existing custom fields, or default to 1000
      const existingOrders = Object.values(data.custom)
        .map(f => f.order ?? 0)
        .filter(o => o !== undefined)
      const maxOrder = existingOrders.length > 0 ? Math.max(...existingOrders) : 999
      const newOrder = maxOrder + 1
      
      const updatedCustom = {
        ...data.custom,
        [id]: {
          title: newField.title,
          content: newField.content,
          hidden: false,
          id,
          link: newField.link,
          order: newOrder,
        },
      }
      onUpdate({ custom: updatedCustom })
      setNewField({ title: "", content: "", link: false })
      setIsEditing(false)
    }
  }

  const removeCustomField = (id: string) => {
    const updatedCustom = { ...data.custom }
    delete updatedCustom[id]
    onUpdate({ custom: updatedCustom })
  }

  const updateCustomField = (id: string, field: string, value: any) => {
    const updatedCustom = {
      ...data.custom,
      [id]: {
        ...data.custom[id],
        [field]: value,
      },
    }
    onUpdate({ custom: updatedCustom })
  }

  // Remove isDirty, onSave, and handleSave logic
  // Remove section-level save button and unsaved changes indicator in the render

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Add Your Personal Touch ⚡</h2>
        <p className="text-muted-foreground">Include additional details that make you unique</p>
      </div>

      {/* Existing Custom Fields */}
      <div className="space-y-4">
        {Object.entries(data.custom).map(([id, field]) => (
          <Card key={id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{field.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomField(id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor={`content-${id}`}>Content</Label>
                <Input
                  id={`content-${id}`}
                  value={field.content}
                  onChange={(e) => updateCustomField(id, "content", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`link-${id}`}
                    checked={field.link}
                    onCheckedChange={(checked) => updateCustomField(id, "link", checked)}
                  />
                  <Label htmlFor={`link-${id}`} className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Is this a link?
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`hidden-${id}`}
                    checked={field.hidden}
                    onCheckedChange={(checked) => updateCustomField(id, "hidden", checked)}
                  />
                  <Label htmlFor={`hidden-${id}`}>Hidden</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Field */}
      <Card className="border-dashed border-2 border-gray-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {isEditing ? (
              <>
                <Plus className="w-5 h-5" />
                Add New Field
              </>
            ) : (
              <>
                <Link className="w-5 h-5" />
                Edit Field
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="new-title">Field Title</Label>
              <Input
                id="new-title"
                placeholder="e.g., Date of Birth, Website"
                value={newField.title}
                onChange={(e) => setNewField((prev) => ({ ...prev, title: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="new-content">Content</Label>
              <Input
                id="new-content"
                placeholder="Enter the value"
                value={newField.content}
                onChange={(e) => setNewField((prev) => ({ ...prev, content: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="new-link"
              checked={newField.link}
              onCheckedChange={(checked) => setNewField((prev) => ({ ...prev, link: checked }))}
            />
            <Label htmlFor="new-link" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              This is a link
            </Label>
          </div>

          <div className="flex justify-between">
            {/* <Button onClick={() => setIsEditing(!isEditing)} className="w-full">
              {isEditing ? "Save Entry" : "Add Entry"}
            </Button> */}
            <Button onClick={addCustomField} className="w-full">
              Add Field
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Section-Level Save Button */}
      {/* <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!isDirty} className="w-full">
          Save Changes
        </Button>
      </div> */}

      {/* Unsaved Changes Indicator */}
      {/* {isDirty && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-600">⚠️</span>
            <span className="font-medium text-yellow-800">Unsaved Changes</span>
          </div>
          <p className="text-yellow-700 text-sm">
            You have unsaved changes. Please save them to ensure your resume is up to date.
          </p>
        </div>
      )} */}

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-600">🌟</span>
          <span className="font-medium text-green-800">Suggestion</span>
        </div>
        <p className="text-green-700 text-sm">
          Consider adding fields like Date of Birth, Nationality, Languages, or Personal Website to give recruiters a
          more complete picture of who you are.
        </p>
      </div>
    </div>
  )
}
