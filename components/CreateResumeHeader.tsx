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
  const renderControls = () => (
    <>
      <SectionManagement
        sections={sectionsWithOrder}
        onReorder={handleSectionReorder}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowPreview(!showPreview)}
        className="flex items-center gap-2"
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
      />
      <Select
        value={selectedTemplate.id}
        onValueChange={(value) => {
          const t = availableTemplates.find((t) => t.id === value)
          if (t) setSelectedTemplate(t)
        }}
      >
        <SelectTrigger className="text-sm w-full md:w-auto">
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
      <div title="Coming soon" className="inline-block w-full border">
        <Button
          onClick={effectiveAiEnabled ? () => setModalOpen(true) : undefined}
          disabled
          className="flex items-center gap-2 w-full"
        >
          <Star className="w-4 h-4" />
          Create with AI
        </Button>
      </div>
    </>
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
