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
import { Eye, Star, Menu, Download, ListChecks, LayoutTemplate } from "lucide-react"
import { SectionManagement } from "@/components/section-management"
import { ModernSidebarLayoutModal } from "@/components/modern-sidebar-layout-modal"
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
  onOpenDownload: () => void
  editorMode: "guided" | "visual"
  setEditorMode: (mode: "guided" | "visual") => void
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
  onOpenDownload,
  editorMode,
  setEditorMode,
}: CreateResumeHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const ModeSwitch = () => (
    <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      <button
        onClick={() => setEditorMode("guided")}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${editorMode === "guided" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
      >
        <ListChecks className="w-4 h-4" /> Guided
      </button>
      <button
        onClick={() => setEditorMode("visual")}
        title="Visual editor (Beta)"
        className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${editorMode === "visual" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
      >
        <LayoutTemplate className="w-4 h-4" /> Visual
        <span className="rounded bg-amber-100 px-1 py-0.5 text-[9px] font-bold uppercase leading-none text-amber-700">Beta</span>
      </button>
    </div>
  )

const renderControls = () => (
  <div className="w-full flex flex-wrap items-center gap-3">
    <ModeSwitch />

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

    <Button
      onClick={onOpenDownload}
      className="h-10 px-4 rounded-md text-sm flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      Download
    </Button>

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
