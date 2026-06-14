"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { TemplatePickerDrawer } from "@/components/template-picker-drawer"
import { Eye, Star, Menu } from "lucide-react"
import { SectionManagement } from "@/components/section-management"
import { ModernSidebarLayoutModal } from "@/components/modern-sidebar-layout-modal"
import DownloadDropDown from "@/components/global/DropDown/DropDown"
import type { ResumeData, ResumeTemplate, Section } from "@/types/resume"
import { getResumeDesign } from "@/lib/resume-designs"
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

    {(() => {
      const layout = getResumeDesign(selectedTemplate.id)?.layout
      const isTwoColumn = layout === "sidebar-left" || layout === "sidebar-right"
      return isTwoColumn ? (
        <ModernSidebarLayoutModal
          sections={sectionsWithOrder}
          onUpdate={handleSectionReorder}
          sidebarSide={layout === "sidebar-right" ? "right" : "left"}
        />
      ) : (
        <SectionManagement
          sections={sectionsWithOrder}
          onReorder={handleSectionReorder}
          className="h-10 px-4 rounded-md text-sm flex items-center"
        />
      )
    })()}

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

    <TemplatePickerDrawer
      selectedId={selectedTemplate.id}
      onSelect={(value) => {
        const t = availableTemplates.find((t) => t.id === value)
        if (t) {
          setSelectedTemplate(t)
          // Update URL silently with new template
          const params = new URLSearchParams(searchParams.toString())
          params.set('template', t.id)
          router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false })
        }
      }}
    />

    <Button
      disabled
      hidden={true}
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
