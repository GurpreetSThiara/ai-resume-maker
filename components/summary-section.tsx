"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAi } from "@/hooks/use-ai"
import { ResumeData, SECTION_TYPES } from "@/types/resume"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface SummarySectionProps {
  data: ResumeData
  onUpdate: (updates: Partial<ResumeData>) => void
}

export function SummarySection({ data, onUpdate }: SummarySectionProps) {
  const { effectiveAiEnabled } = useAi()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleChange = (value: string) => {
    onUpdate({ basics: { ...data.basics, summary: value } })
  }

  const generateSummary = async () => {
    if (!effectiveAiEnabled || !data.basics) return
    setIsGenerating(true)

    try {
      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.basics.name,
          experience: data.sections.find(section => section.type === SECTION_TYPES.EXPERIENCE)?.items || [],
          skills: data.sections.find(section => section.type === SECTION_TYPES.SKILLS)?.items || [],
          education: data.sections.find(section => section.type === SECTION_TYPES.EDUCATION)?.items || [],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate summary")
      }

      const result = await response.json()
      handleChange(result.summary)
    } catch (error) {
      console.error("Error generating summary:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Professional Summary 📝</h2>
        <p className="text-muted-foreground">
          A compelling summary of your professional background and goals
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="summary" className="text-sm font-medium">
            Professional Summary
          </Label>
          <div title="Coming soon" className="inline-block">
            <Button
              variant="outline"
              size="sm"
              onClick={effectiveAiEnabled ? generateSummary : undefined}
              disabled
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "✨ Generate with AI"
              )}
            </Button>
          </div>
        </div>
        <Textarea
          id="summary"
          placeholder="Write a compelling summary of your professional experience, skills, and career goals..."
          value={data?.basics?.summary || ""}
          onChange={(e) => handleChange(e.target.value)}
          className="min-h-[150px]"
        />
      </div>

      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-purple-600">💡</span>
          <span className="font-medium text-purple-800">Pro Tip</span>
        </div>
        <p className="text-purple-700 text-sm">
          Write it like a mini answer to "Why should we hire you?" — include your role, strongest skill, and one measurable outcome in 2–3 lines. Avoid objectives, buzzwords, and anything you can't prove later in the resume.
        </p>
      </div>
    </div>
  )
}
