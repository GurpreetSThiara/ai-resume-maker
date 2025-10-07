"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, FileText, User, GraduationCap, Briefcase, Zap, Settings } from "lucide-react"
import type { ResumeData, ResumeTemplate } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"

interface ReviewSectionProps {
  data: ResumeData
  template: ResumeTemplate
}

export function ReviewSection({ data, template }: ReviewSectionProps) {
  const completionStats = {
    personalInfo: !!(data?.basics.name && data.basics?.email),
    education: data.sections.some(s => s.type === SECTION_TYPES.EDUCATION && (s.items as any[]).length > 0),
    experience: data.sections.some(s => s.type === SECTION_TYPES.EXPERIENCE && (s.items as any[]).length > 0),
    skills: data.sections.some(s => s.type === SECTION_TYPES.SKILLS && (s.items as string[]).length > 0),
    customFields: Object.keys(data.custom).length > 0,
  }

  const completedSections = Object.values(completionStats).filter(Boolean).length
  const totalSections = Object.keys(completionStats).length

  const resumeMetadata = {
    template: template.name,
    sections: completedSections,
    totalFields:
      Object.keys(data.custom).length +
      data.sections.reduce((acc, section) => {
        switch (section.type) {
          case SECTION_TYPES.EDUCATION:
          case SECTION_TYPES.EXPERIENCE:
            return acc + section.items.length
          case SECTION_TYPES.SKILLS:
          case SECTION_TYPES.LANGUAGES:
          case SECTION_TYPES.CERTIFICATIONS:
            return acc + section.items.length
          case SECTION_TYPES.CUSTOM:
            return acc + section.content.length
          default:
            return acc
        }
      }, 0),
    wordCount: estimateWordCount(data),
    completionRate: Math.round((completedSections / totalSections) * 100),
  }

  function estimateWordCount(resumeData: ResumeData): number {
    let wordCount = 0

    // Count words in basic info
    wordCount += countWords(resumeData?.basics?.name)
    wordCount += countWords(resumeData?.basics?.email)
    wordCount += countWords(resumeData?.basics?.phone)
    wordCount += countWords(resumeData?.basics?.location)
    wordCount += countWords(resumeData?.basics?.linkedin)
    wordCount += countWords(resumeData?.basics?.summary)

    // Count words in custom fields
    Object.values(resumeData.custom).forEach((field) => {
      wordCount += countWords(field.title)
      wordCount += countWords(field.content)
    })

    // Count words in sections
    resumeData.sections.forEach((section) => {
      wordCount += countWords(section.title)
      switch (section.type) {
        case SECTION_TYPES.EDUCATION:
          section.items.forEach(edu => {
            wordCount += countWords(edu.institution)
            wordCount += countWords(edu.degree)
            wordCount += countWords(edu.location || "")
            edu.highlights?.forEach(highlight => wordCount += countWords(highlight))
          })
          break
        case SECTION_TYPES.EXPERIENCE:
          section.items.forEach(exp => {
            wordCount += countWords(exp.company)
            wordCount += countWords(exp.role)
            wordCount += countWords(exp.location || "")
            exp.achievements?.forEach(achievement => wordCount += countWords(achievement))
          })
          break
        case SECTION_TYPES.SKILLS:
        case SECTION_TYPES.LANGUAGES:
        case SECTION_TYPES.CERTIFICATIONS:
          section.items.forEach(item => wordCount += countWords(item))
          break
        case SECTION_TYPES.CUSTOM:
          section.content.forEach(content => wordCount += countWords(content))
          break
      }
    })

    return wordCount
  }

  function countWords(text?: string): number {
    return (text ?? "")
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Congratulations! ✨</h2>
        <p className="text-muted-foreground">Your resume is ready for preview and download.</p>
      </div>

      {/* Completion Overview */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Resume Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Completion Status</span>
                <Badge variant={completedSections === totalSections ? "default" : "secondary"}>
                  {resumeMetadata.completionRate}%
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Template</span>
                <span className="text-sm text-muted-foreground">{resumeMetadata.template}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Total Sections</span>
                <span className="text-sm text-muted-foreground">
                  {resumeMetadata.sections} of {totalSections}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Content Fields</span>
                <span className="text-sm text-muted-foreground">{resumeMetadata.totalFields}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Estimated Words</span>
                <span className="text-sm text-muted-foreground">{resumeMetadata.wordCount}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium">Ready to Download</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Status */}
      <Card>
        <CardHeader>
          <CardTitle>Section Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${completionStats.personalInfo ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}
            >
              <User className={`w-5 h-5 ${completionStats.personalInfo ? "text-green-600" : "text-gray-400"}`} />
              <div>
                <div className="font-medium">Personal Information</div>
                <div className="text-sm text-muted-foreground">
                  {completionStats.personalInfo ? "Complete" : "Incomplete"}
                </div>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${completionStats.education ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}
            >
              <GraduationCap className={`w-5 h-5 ${completionStats.education ? "text-green-600" : "text-gray-400"}`} />
              <div>
                <div className="font-medium">Education</div>
                <div className="text-sm text-muted-foreground">
                  {completionStats.education ? "Complete" : "No entries"}
                </div>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${completionStats.experience ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}
            >
              <Briefcase className={`w-5 h-5 ${completionStats.experience ? "text-green-600" : "text-gray-400"}`} />
              <div>
                <div className="font-medium">Professional Experience</div>
                <div className="text-sm text-muted-foreground">
                  {completionStats.experience ? "Complete" : "No entries"}
                </div>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${completionStats.skills ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}
            >
              <Zap className={`w-5 h-5 ${completionStats.skills ? "text-green-600" : "text-gray-400"}`} />
              <div>
                <div className="font-medium">Skills & More</div>
                <div className="text-sm text-muted-foreground">
                  {completionStats.skills ? "Complete" : "No entries"}
                </div>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 p-3 rounded-lg ${completionStats.customFields ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"}`}
            >
              <Settings className={`w-5 h-5 ${completionStats.customFields ? "text-green-600" : "text-gray-400"}`} />
              <div>
                <div className="font-medium">Custom Fields</div>
                <div className="text-sm text-muted-foreground">
                  {completionStats.customFields ? `${Object.keys(data.custom).length} fields` : "No custom fields"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-blue-800 mb-2">Your Resume is Ready!</h3>
        <p className="text-blue-700 mb-4">
          Use the preview panel to see your resume and make final edits. When you&apos;re satisfied, download your
          professional PDF resume and start applying to your dream jobs.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-blue-600">
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>Professional Format</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            <span>ATS-Friendly</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4" />
            <span>Instant Download</span>
          </div>
        </div>
      </div>
    </div>
  )
}
