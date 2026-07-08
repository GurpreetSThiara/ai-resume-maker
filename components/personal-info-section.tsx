"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { AlertCircle } from "lucide-react"
import type { ResumeData } from "@/types/resume"

interface PersonalInfoSectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Returns an error/warning message for a field, or "" if valid. */
function validate(field: string, value: string): string {
  const v = (value || "").trim()
  switch (field) {
    case "name":
      return v ? "" : "Full name is required."
    case "email":
      if (!v) return "Email is required."
      return EMAIL_RE.test(v) ? "" : "Enter a valid email, e.g. name@example.com."
    case "phone":
      if (!v) return ""
      return (v.match(/\d/g) || []).length >= 7 ? "" : "This phone number looks incomplete."
    case "linkedin":
      if (!v) return ""
      return /^https?:\/\//i.test(v) || v.includes(".") ? "" : "Enter a full URL, e.g. https://linkedin.com/in/you."
    default:
      return ""
  }
}

export function PersonalInfoSection({ data, onUpdate }: PersonalInfoSectionProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = (field: keyof typeof data.basics, value: string) => {
    onUpdate({ basics: { ...data.basics, [field]: value } })
  }
  const markTouched = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }))

  const errorFor = (field: string) => (touched[field] ? validate(field, (data?.basics as any)?.[field] ?? "") : "")

  const fieldProps = (field: string) => {
    const err = errorFor(field)
    return {
      value: (data?.basics as any)?.[field] ?? "",
      onBlur: () => markTouched(field),
      "aria-invalid": err ? true : undefined,
      "aria-describedby": err ? `${field}-error` : undefined,
      className: `h-12 ${err ? "border-red-500 focus-visible:ring-red-500" : ""}`,
    }
  }

  const FieldError = ({ field }: { field: string }) => {
    const err = errorFor(field)
    if (!err) return null
    return (
      <p id={`${field}-error`} className="flex items-center gap-1 text-sm text-red-600">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {err}
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Let&apos;s start with the basics! 🚀</h2>
        <p className="text-muted-foreground">Tell us about yourself to get started</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
          <Input id="name" placeholder="John Doe" onChange={(e) => handleChange("name", e.target.value)} {...fieldProps("name")} />
          <FieldError field="name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
          <Input id="email" type="email" inputMode="email" autoComplete="email" placeholder="john.doe@example.com" onChange={(e) => handleChange("email", e.target.value)} {...fieldProps("email")} />
          <FieldError field="email" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
          <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+1 (123) 456-7890" onChange={(e) => handleChange("phone", e.target.value)} {...fieldProps("phone")} />
          <FieldError field="phone" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">Location</Label>
          <Input id="location" autoComplete="address-level2" placeholder="City, Country" onChange={(e) => handleChange("location", e.target.value)} {...fieldProps("location")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin" className="text-sm font-medium">LinkedIn or Social Link</Label>
          <Input id="linkedin" type="url" inputMode="url" placeholder="https://linkedin.com/in/yourprofile" onChange={(e) => handleChange("linkedin", e.target.value)} {...fieldProps("linkedin")} />
          <FieldError field="linkedin" />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-600">💼</span>
          <span className="font-medium text-blue-800">Pro Tip</span>
        </div>
        <p className="text-blue-700 text-sm">
          A complete LinkedIn profile is crucial for recruiters. It validates your professional experience, showcases recommendations, and provides additional context beyond your resume.
        </p>
      </div>
    </div>
  )
}
