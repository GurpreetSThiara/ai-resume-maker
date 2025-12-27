"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, Star, Menu } from "lucide-react"
import { SectionManagement } from "@/components/section-management"
import DownloadDropDown from "@/components/global/DropDown/DropDown"
import type { ResumeData, ResumeTemplate, Section } from "@/types/resume"
import { useRouter, useSearchParams } from "next/navigation"

interface CreateResumeHeaderProps {
  sectionsWithOrder: Section[]
  handleSectionReorder: (reorderedSections: Section[]) => void
  showPreview: boolean
  setShowPreview: (show: boolean) => void
  resumeData: ResumeData
  selectedTemplate: ResumeTemplate
  setSelectedTemplate: (template: ResumeTemplate) => void
  availableTemplates: ResumeTemplate[]
  effectiveAiEnabled: boolean
  setModalOpen: (open: boolean) => void
}

export function CreateResumeHeader({
  sectionsWithOrder,
  handleSectionReorder,
  showPreview,
  setShowPreview,
  resumeData,
  selectedTemplate,
  setSelectedTemplate,
  availableTemplates,
  effectiveAiEnabled,
  setModalOpen,
}: CreateResumeHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

const renderControls = () => (
  <div className="w-full flex flex-wrap items-center gap-3">

    <SectionManagement
      sections={sectionsWithOrder}
      onReorder={handleSectionReorder}
      className="h-10 px-4 rounded-md text-sm flex items-center"
    />

    <Button
      variant="outline"
      onClick={() => setShowPreview(!showPreview)}
      className="h-10 px-4 rounded-md text-sm flex items-center gap-2"
    >
      <Eye className="w-4 h-4" />
      {showPreview ? "Hide Preview" : "Show Preview"}
    </Button>

    <DownloadDropDown
      data={{
        resumeData,
        template: selectedTemplate,
        filename: `${resumeData.basics.name || "resume"}.pdf`,
      }}
      className="h-10 px-4 rounded-md text-sm flex items-center"
    />

    <Select
      value={selectedTemplate.id}
      onValueChange={(value) => {
        const t = availableTemplates.find((t) => t.id === value)
        if (t) {
          setSelectedTemplate(t)
          // Update URL silently with new template
          const params = new URLSearchParams(searchParams.toString())
          params.set('template', t.id)
          router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false })
        }
      }}
    >
      <SelectTrigger className="h-10 px-4 rounded-md text-sm w-48 flex items-center">
        <SelectValue placeholder="Select Template" />
      </SelectTrigger>
      <SelectContent>
        {availableTemplates.map((t) => (
          <SelectItem key={t.id} value={t.id}>
            {t.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    <Button
      disabled
      title="Coming soon"
      className="h-10 px-4 rounded-md text-sm flex items-center gap-2"
    >
      <Star className="w-4 h-4" />
      Create with AI
    </Button>
  </div>
)


  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Create Your Resume
        </h1>
      </div>

      {/* Desktop Controls */}
      <div className="hidden md:flex flex-wrap items-center gap-3">
        {renderControls()}
      </div>

      {/* Mobile Controls */}
      <div className="md:hidden flex justify-end">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Menu className="w-4 h-4" />
              <span>Tools</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Resume Tools</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 py-4 px-8">{renderControls()}</div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
