"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { ResumeData } from "@/types/resume"

interface PersonalInfoSectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

export function PersonalInfoSection({ data, onUpdate }: PersonalInfoSectionProps) {
  const handleChange = (field: keyof typeof data.basics, value: string) => {
    onUpdate({ basics: { ...data.basics, [field]: value } })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Let&apos;s start with the basics! 🚀</h2>
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
            value={data?.basics?.name}
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
            value={data?.basics?.email}
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
            value={data?.basics?.phone}
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
            placeholder="City, Country"
            value={data?.basics?.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin" className="text-sm font-medium">
            LinkedIn
          </Label>
          <Input
            id="linkedin"
            placeholder="https://linkedin.com/in/yourprofile"
            value={data?.basics?.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            className="h-12"
          />
        </div>
      </div>
    </div>
  )
}
