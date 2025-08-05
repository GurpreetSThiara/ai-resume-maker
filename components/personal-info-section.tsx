"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { ResumeData } from "@/app/page"

interface PersonalInfoSectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
  onSave: () => void
}

export function PersonalInfoSection({ data, onUpdate, onSave }: PersonalInfoSectionProps) {
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [personalData, setPersonalData] = useState(data)

  const handleChange = (field: keyof ResumeData, value: string) => {
    setPersonalData({ ...personalData, [field]: value })
    setUnsavedChanges(true)
  }

  const handleSave = () => {
    onUpdate(personalData)
   // onSave()
    setUnsavedChanges(false)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Let's start with the basics! 🚀</h2>
        <p className="text-muted-foreground">Tell us about yourself to get started</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Full Name *
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={personalData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={personalData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
          <Input
            id="phone"
            placeholder="+1 (123) 456-7890"
            value={personalData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">
            Location
          </Label>
          <Input
            id="location"
            placeholder="San Francisco, CA"
            value={personalData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="linkedin" className="text-sm font-medium">
            LinkedIn Profile
          </Label>
          <Input
            id="linkedin"
            placeholder="linkedin.com/in/johndoe"
            value={personalData.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            className="h-12"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        {unsavedChanges && <span className="text-red-500 font-medium">Unsaved Changes</span>}
        <Button onClick={handleSave} disabled={!unsavedChanges}>
          Save
        </Button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-600">💡</span>
          <span className="font-medium text-blue-800">Pro Tip</span>
        </div>
        <p className="text-blue-700 text-sm">
          Make sure your email is professional and your LinkedIn profile is up to date. These are often the first things
          recruiters check!
        </p>
      </div>
    </div>
  )
}
