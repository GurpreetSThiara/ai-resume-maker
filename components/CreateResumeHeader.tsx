"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { TemplatePickerDrawer } from "@/components/template-picker-drawer"
import { Eye, Star, Menu, Download, ListChecks, LayoutTemplate, Settings2 } from "lucide-react"
import { SectionManagement } from "@/components/section-management"
import { ModernSidebarLayoutModal } from "@/components/modern-sidebar-layout-modal"
import { GuidedSettingsModal } from "@/components/guided-settings-modal"
import { Brand } from "@/components/ui/brand"
import type { ResumeData, ResumeTemplate, Section } from "@/types/resume"
import { getResumeDesign } from "@/lib/resume-designs"
import { useRouter, useSearchParams } from "next/navigation"

interface StepInfo {
  id: number
  title: string
  icon: string
  description: string
}

interface CreateResumeHeaderProps {
  sectionsWithOrder: Section[]
  handleSectionReorder: (reorderedSections: Section[]) => void
  showPreview: boolean
  setShowPreview: (show: boolean) => void
  resumeData: ResumeData
  setResumeData: (v: ResumeData | ((prev: ResumeData) => ResumeData)) => void
  selectedTemplate: ResumeTemplate
  setSelectedTemplate: (template: ResumeTemplate) => void
  availableTemplates: ResumeTemplate[]
  effectiveAiEnabled: boolean
  setModalOpen: (open: boolean) => void
  onOpenDownload: () => void
  editorMode: "guided" | "visual"
  setEditorMode: (mode: "guided" | "visual") => void
  steps: StepInfo[]
  currentStep: number
  setCurrentStep: (index: number) => void
  completedSteps: Set<number>
}

export function CreateResumeHeader({
  sectionsWithOrder,
  handleSectionReorder,
  showPreview,
  setShowPreview,
  resumeData,
  setResumeData,
  selectedTemplate,
  setSelectedTemplate,
  availableTemplates,
  effectiveAiEnabled,
  setModalOpen,
  onOpenDownload,
  editorMode,
  setEditorMode,
  steps,
  currentStep,
  setCurrentStep,
  completedSteps,
}: CreateResumeHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Whole-résumé style settings (spacing / margins / condensed education …).
  const [settingsOpen, setSettingsOpen] = useState(false)
  const style = resumeData.style || {}
  const setStyle = (patch: Partial<NonNullable<ResumeData["style"]>>) =>
    setResumeData((prev) => ({ ...prev, style: { ...(prev.style || {}), ...patch } }))
  const resetStyle = () => setResumeData((prev) => ({ ...prev, style: undefined }))
  const settingsBase = getResumeDesign(selectedTemplate.id) ?? getResumeDesign("classic-blue")!

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

    <Button
      variant="outline"
      onClick={() => setSettingsOpen(true)}
      className="h-10 px-4 rounded-md text-sm flex items-center gap-2"
    >
      <Settings2 className="w-4 h-4" />
      Settings
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


  const progress = steps.length ? ((currentStep + 1) / steps.length) * 100 : 0

  return (
    <>
      <GuidedSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        base={settingsBase}
        style={style}
        setStyle={setStyle}
        reset={resetStyle}
      />

      {/* Desktop header */}
      <div className="hidden md:flex flex-row items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Your Resume</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">{renderControls()}</div>
      </div>

      {/* Mobile app bar — full-bleed, sticky, single source of chrome */}
      <div className="md:hidden -mx-4 -mt-4 mb-4 sticky top-0 z-40 border-b border-gray-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="flex items-center gap-1 px-4 h-14">
          <Brand logoSize={26} asLink={false} />
          <span className="ml-auto mr-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-gray-500">
            {currentStep + 1}/{steps.length}
          </span>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            aria-label="Preview resume"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition active:bg-gray-100"
          >
            <Eye className="h-[22px] w-[22px]" />
          </button>
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Resume tools"
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition active:bg-gray-100"
              >
                <Menu className="h-[22px] w-[22px]" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Resume Tools</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-4 px-6">{renderControls()}</div>
            </SheetContent>
          </Sheet>
        </div>

        {/* progress */}
        <div className="h-0.5 w-full bg-gray-100">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {/* step chips — jump to any step */}
        <div className="overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-2">
            {steps.map((step, i) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(i)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium transition ${
                  i === currentStep
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : completedSteps.has(i)
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                }`}
              >
                <span className="text-sm leading-none">{step.icon}</span>
                {step.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
