"use client"

import type React from "react"
import { useRef, useEffect, forwardRef, useState } from "react"
import dynamic from "next/dynamic"
import type { ResumeData, ResumeTemplate, Section } from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"
import { getResumePreview } from "./resumes"
import { PdfPreviewErrorBoundary } from "./pdf-preview-boundary"
import { atsCompactLinesTemplate, atsClassicCompactTemplate } from "@/lib/templates"
import { AlertTriangle, FileText, FileType2, Loader2, PencilLine, Printer, X } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { getResumeDesign } from "@/lib/resume-designs"
import { printResumePDF } from "@/lib/pdf-generators/print-pdf"
import { SHOW_ERROR } from "@/utils/toast"

const ResumePdfPreview = dynamic(
  () => import("@/components/resume-pdf-preview").then((m) => m.ResumePdfPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[40vh] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/80">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" aria-label="Loading PDF viewer" />
      </div>
    ),
  },
)

const ResumeDocxPreview = dynamic(
  () => import("@/components/resume-docx-preview").then((m) => m.ResumeDocxPreview),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[40vh] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/80">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" aria-label="Loading DOCX viewer" />
      </div>
    ),
  },
)

interface ResumePreviewProps {
  resumeData: ResumeData
  template: ResumeTemplate
  onDataUpdate: (data: ResumeData | ((prev: ResumeData) => ResumeData)) => void
  activeSection: string
  setResumeData: any
  className?: string
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resumeData, template, onDataUpdate, activeSection, setResumeData, className }, ref) => {
    // Refs for each section to scroll to
    const personalInfoRef = useRef<HTMLDivElement>(null)
    const customFieldsRef = useRef<HTMLDivElement>(null)
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    const [ResumeComponent, setResumeComponent] = useState<React.ComponentType<any> | null>(null);

    // Effect to handle scrolling when activeSection changes
    useEffect(() => {
      if (!activeSection) return

      // Determine which element to scroll to
      let elementToScroll: HTMLElement | null = null
      if (activeSection === "personal") {
        elementToScroll = personalInfoRef.current
      } else if (activeSection === "custom") {
        elementToScroll = customFieldsRef.current
      } else if (activeSection.startsWith("section-")) {
        const sectionId = activeSection.replace("section-", "")
        elementToScroll = sectionRefs.current[sectionId] || null
      }

      // Scroll to the element if found
      if (elementToScroll && ref && typeof ref !== "function") {
        const container = (ref as { current: HTMLDivElement | null }).current
        if (!container) return

        const containerRect = container.getBoundingClientRect()
        const elementRect = elementToScroll.getBoundingClientRect()
        const scrollTop = elementRect.top - containerRect.top + container.scrollTop - 20

        container.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        })
      }
    }, [activeSection, ref])

    useEffect(() => {
      let isMounted = true;

      getResumePreview({ template: template }).then((comp) => {
        if (isMounted) setResumeComponent(() => comp);
      });

      return () => {
        isMounted = false;
      };
    }, [template.id]);

    const hasSectionContent = (section: any): boolean => {
      if (!section || section.hidden) return false
      switch (section.type) {
        case SECTION_TYPES.EDUCATION:
        case SECTION_TYPES.EXPERIENCE:
          return Array.isArray(section.items) && section.items.length > 0
        case SECTION_TYPES.PROJECTS:
          return Array.isArray(section.items) && section.items.length > 0
        case SECTION_TYPES.SKILLS:
        case SECTION_TYPES.LANGUAGES:
        case SECTION_TYPES.CERTIFICATIONS:
          return Array.isArray(section.items) && section.items.filter((s: string) => s && s.trim()).length > 0
        case SECTION_TYPES.CUSTOM:
          return Array.isArray(section.content) && section.content.some((s: string) => s && s.trim() !== "")
        default:
          return false
      }
    }

    const filteredResumeData: ResumeData = {
      ...resumeData,
      sections: (resumeData.sections || [])
        .filter((s: any) => s.id === 'custom-fields' || hasSectionContent(s)) // Keep custom-fields section even if empty
        .map((s: any) => {
          // Preserve original projects section so templates that render projects
          // (like `ats-classic`) receive the proper `projects` type and items.
          // Previously projects were flattened into a `custom` section which
          // caused templates to see `type: 'custom'` instead of `type: 'projects'.
          if (s.type === SECTION_TYPES.PROJECTS) {
            return s
          }
          return s
        }) as any
    }

    const handleNameChange = (e: React.FocusEvent<HTMLHeadingElement>) => {
      onDataUpdate((prev: ResumeData) => ({
        ...prev,
        basics: {
          ...prev.basics,
          name: e.currentTarget.textContent || ""
        }
      }))
    }

    const handleContactInfoChange = (e: React.FocusEvent<HTMLSpanElement>, field: keyof ResumeData['basics']) => {
      onDataUpdate((prev: ResumeData) => ({
        ...prev,
        basics: {
          ...prev.basics,
          [field]: e.currentTarget.textContent || ""
        }
      }))
    }

    const handleCustomItemChange = (id: string, field: 'title' | 'content', value: string) => {
      onDataUpdate((prev: ResumeData) => ({
        ...prev,
        custom: {
          ...prev.custom,
          [id]: {
            ...prev.custom[id],
            [field]: value
          }
        }
      }))
    }

    const handleSectionTitleChange = (sectionId: string, newTitle: string) => {
      onDataUpdate((prev: ResumeData) => ({
        ...prev,
        sections: prev.sections.map(section =>
          section.id === sectionId ? { ...section, title: newTitle } : section
        )
      }))
    }

    const [showAtsWarning, setShowAtsWarning] = useState(true)
    const [previewSurface, setPreviewSurface] = useState<"editable" | "pdf" | "docx">("editable")
    const [isPrinting, setIsPrinting] = useState(false)

    // Visual designer templates are PDF-only — hide DOCX preview + download.
    const pdfOnly = !!getResumeDesign(template.id)?.pdfOnly
    useEffect(() => {
      if (pdfOnly && previewSurface === "docx") setPreviewSurface("editable")
    }, [pdfOnly, previewSurface])

    // Print the REAL generated PDF (same design engine as download) — opens the
    // browser print dialog for the PDF itself, not the app page.
    const handlePrint = async () => {
      try {
        setIsPrinting(true)
        await printResumePDF({ resumeData: filteredResumeData, template })
      } catch (error) {
        console.error("Error printing resume:", error)
        SHOW_ERROR({ title: "Couldn't open the print dialog.", description: "Please try downloading the PDF instead." })
      } finally {
        setIsPrinting(false)
      }
    }

    // Reset warning when template changes
    useEffect(() => {
      if (template.isAtsFriendly === false) {
        setShowAtsWarning(true)
      }
    }, [template.id, template.isAtsFriendly])

    return (
      <div className={`bg-gray-50 font-serif ${className || 'min-h-screen'} flex flex-col items-center`}>
        {/* ATS Warning Alert */}
        {template.isAtsFriendly === false && showAtsWarning && (
          <div className="w-full max-w-2xl mt-4 mb-2 px-4">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r shadow-sm relative">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700">
                    <span className="font-medium block mb-1">ATS Compatibility Warning</span>
                    This two-column template is designed for visual appeal but may be less readable by some Applicant Tracking Systems (ATS).
                    Use single-column templates for stricter ATS requirements.
                  </p>
                </div>
                <button
                  onClick={() => setShowAtsWarning(false)}
                  className="absolute top-2 right-2 text-amber-400 hover:text-amber-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="w-full px-2 sm:px-4 pt-1 pb-3 flex items-center justify-center gap-1.5 sm:gap-2">
          <ToggleGroup
            type="single"
            variant="outline"
            value={previewSurface}
            onValueChange={(v) => {
              if (v === "editable" || v === "pdf" || v === "docx") setPreviewSurface(v)
            }}
            className="max-w-md flex"
            aria-label="Preview mode"
          >
            <ToggleGroupItem
              value="editable"
              className="gap-1.5 text-xs sm:text-sm px-2 py-2 h-auto flex-none"
              aria-label="Editable preview"
            >
              <PencilLine className="h-4 w-4 shrink-0" aria-hidden />
              <span className="whitespace-nowrap">Editable</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="pdf"
              className="gap-1.5 text-xs sm:text-sm px-2 py-2 h-auto flex-none"
              aria-label="PDF preview from pdf-lib"
            >
              <FileText className="h-4 w-4 shrink-0" aria-hidden />
              <span className="whitespace-nowrap">PDF</span>
            </ToggleGroupItem>
            {!pdfOnly && (
              <ToggleGroupItem
                value="docx"
                className="gap-1.5 text-xs sm:text-sm px-2 py-2 h-auto flex-none"
                aria-label="Word DOCX preview"
              >
                <FileType2 className="h-4 w-4 shrink-0" aria-hidden />
                <span className="whitespace-nowrap">DOCX</span>
              </ToggleGroupItem>
            )}
          </ToggleGroup>
          <Button
            type="button"
            size="sm"
            onClick={handlePrint}
            disabled={isPrinting}
            className="gap-1.5 text-xs sm:text-sm px-2.5 py-2 h-auto shrink-0"
            aria-label="Print resume"
          >
            {isPrinting ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
            ) : (
              <Printer className="h-4 w-4 shrink-0" aria-hidden />
            )}
            <span className="whitespace-nowrap">Print</span>
          </Button>
        </div>

        {previewSurface === "pdf" ? (
          <div ref={ref} className="w-full flex justify-center pb-8 overflow-y-auto">
            <PdfPreviewErrorBoundary label="PDF">
              <ResumePdfPreview resumeData={filteredResumeData} template={template} />
            </PdfPreviewErrorBoundary>
          </div>
        ) : previewSurface === "docx" ? (
          <div ref={ref} className="w-full flex justify-center px-3 sm:px-4 pb-8 overflow-y-auto">
            <PdfPreviewErrorBoundary label="DOCX">
              <ResumeDocxPreview resumeData={filteredResumeData} template={template} />
            </PdfPreviewErrorBoundary>
          </div>
        ) : (
          <div ref={ref} className="w-full flex justify-center pb-8">
            {ResumeComponent && (
              <ResumeComponent
                pdfRef={ref}
                font={{ className: "", name: "Helvetica, Arial, sans-serif" }}
                theme={template.theme || {}}
                resumeData={filteredResumeData}
                setResumeData={setResumeData}
                activeSection={activeSection}
                useBlackVariant={
                  template.id === atsCompactLinesTemplate.id || template.id === atsClassicCompactTemplate.id
                }
              />
            )}
          </div>
        )}
      </div>
    )
  },
)

ResumePreview.displayName = "ResumePreview"

export default ResumePreview
