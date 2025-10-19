"use client"

import React, { useState, useEffect, useRef, Suspense, ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Trophy, Star, Zap, Target, Eye, Download, Save, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PersonalInfoSection } from "@/components/personal-info-section"
import { EducationSection as EducationSectionComponent } from "@/components/education-section"
import { ExperienceSection as ExperienceSectionComponent } from "@/components/experience-section"
import { SkillsSection as SkillsSectionComponent } from "@/components/skills-section"
import { SummarySection } from "@/components/summary-section"
import { CustomFieldsSection } from "@/components/custom-fields-section"
import { ReviewSection } from "@/components/review-section"
import { saveResumeData, getUserResumeCount, loadResumeData, deleteResume } from "@/lib/supabase-functions"
import ResumePreview from "@/components/resume-preview"
import type { 
  ResumeData, 
  ResumeTemplate, 
  EducationSection,
  ExperienceSection,
  SkillsSection,
  CustomSection
} from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"
import { availableTemplates, googleTemplate, getTemplateById } from "@/lib/templates"
import { RESUME_TEMPLATES } from "@/constants/resumeConstants"

import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import AIResumeModal from '../../../components/ai-resume-modal';
import { useAi } from '@/hooks/use-ai';
import { getLocalResumes, saveLocalResume } from '@/lib/local-storage';
import ManageCloudModal from '@/components/manage-cloud-modal';
import SaveResumeModal from '@/components/save-resume-modal';
import DownloadDropDown from "@/components/global/DropDown/DropDown"
import type { FC } from 'react'
import { CustomSection as CustomSectionComponent } from "@/components/custom-section"
import { sampleResumeData } from "@/lib/examples/resume-example"
import { useAuth } from "@/contexts/auth-context"
import { CREATE_RESUME_ACHIEVEMENTS, CREATE_RESUME_STEPS } from "@/app/constants/global"
import { LS_KEYS, setLocalStorageJSON, setLocalStorageItem, removeLocalStorageItems } from "@/utils/localstorage"
import { devopsResumeData3, devopsResumeData2, devopsResumeData4 } from "@/lib/examples/resume/deveops"

const initialData: ResumeData =devopsResumeData4 //sampleResumeData
const achievements = CREATE_RESUME_ACHIEVEMENTS



const CreateResumeContent: FC = () => {
  const { loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { effectiveAiEnabled } = useAi()

  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [resumeData, setResumeData] = useState<ResumeData>(initialData)
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(googleTemplate)

  // Map incoming template query param to one of the availableTemplates
  useEffect(() => {
    const tplId = searchParams.get('template')
    if (!tplId) return

    const normalize = tplId.replace(/_/g, '-').toLowerCase()

    // try direct lookup by id
    let found = getTemplateById(normalize)
    if (found) {
      setSelectedTemplate(found)
      return
    }

    // try exact id match on available templates
    found = availableTemplates.find((t) => t.id === normalize || t.id === tplId)
    if (found) {
      setSelectedTemplate(found)
      return
    }

    // fallback: use presentation metadata from RESUME_TEMPLATES to find a matching available template by name or keyword
    const meta = RESUME_TEMPLATES.find((r) => r.id === tplId || r.id === normalize)
    if (meta) {
      const keyword = meta.name.toLowerCase().split(/\s|\-/)[0]
      const byName = availableTemplates.find((t) => t.name.toLowerCase().includes(keyword) || t.id.includes(keyword))
      if (byName) {
        setSelectedTemplate(byName)
        return
      }
    }

    // last resort: try to match by partial id
    const partial = availableTemplates.find((t) => t.id.includes(normalize) || normalize.includes(t.id))
    if (partial) {
      setSelectedTemplate(partial)
      return
    }

    // default
    setSelectedTemplate(googleTemplate)
  }, [searchParams])
  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [limitModalOpen, setLimitModalOpen] = useState(false)
  const [limitModalBusy, setLimitModalBusy] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const steps = CREATE_RESUME_STEPS

 
  const sanitizeResumeData = (data: ResumeData): ResumeData => ({
    ...data,
    basics: {
      ...data.basics,
      name: data.basics.name || '',
      email: data.basics.email || '',
      phone: data.basics.phone || '',
      location: data.basics.location || '',
      linkedin: data.basics.linkedin || '',
      summary: data.basics.summary || ''
    },
    custom: Object.fromEntries(
      Object.entries(data.custom || {}).map(([key, field]) => [
        key,
        {
          ...field,
          title: field.title || '',
          content: field.content || ''
        }
      ])
    ),
    sections: data.sections
  });
  
  // Save to local storage
  const saveToLocal = () => {
    try {
      setLocalStorageJSON(LS_KEYS.resumeData, resumeData)
      setLocalStorageItem(LS_KEYS.currentStep, currentStep.toString())
      setLocalStorageJSON(LS_KEYS.completedSteps, Array.from(completedSteps))
    } catch (error) {
      console.error('Error saving to local storage:', error)
    }
  };

  // Save handlers
  const onChooseLocal = async () => {
    await saveToLocal()
    setSaveModalOpen(false)
  };

  const onChooseCloudCreate = async () => {
    setIsSaving(true)
    try {
      const res = await saveResumeData(resumeData)
      if (res.success && res.data) {
        setCurrentResumeId(res.data.id)
        removeLocalStorageItems(LS_KEYS.resumeData, LS_KEYS.currentStep, LS_KEYS.completedSteps)
        setSaveModalOpen(false)
        toast({ title: 'Resume Saved! 🎉', description: 'Cloud resume created successfully.' })
        router.push('/profile')
      } else {
        toast({ title: 'Save Failed', description: res.message || 'Could not save resume.', variant: 'destructive' })
      }
    } finally {
      setIsSaving(false)
    }
  };

  const onChooseCloudUpdate = async (resumeId: string) => {
    setIsSaving(true)
    try {
      const res = await saveResumeData(resumeData, resumeId)
      if (res.success && res.data) {
        setCurrentResumeId(res.data.id)
        removeLocalStorageItems(LS_KEYS.resumeData, LS_KEYS.currentStep, LS_KEYS.completedSteps)
        setSaveModalOpen(false)
        toast({ title: 'Resume Updated! 🎉', description: 'Cloud resume updated successfully.' })
        router.push('/profile')
      } else {
        toast({ title: 'Update Failed', description: res.message || 'Could not update resume.', variant: 'destructive' })
      }
    } finally {
      setIsSaving(false)
    }
  };

  const handleConfirmDeleteAndRetry = async (toDelete: string[]) => {
    setLimitModalBusy(true)
    try {
      // Delete selected, then retry save
      for (const id of toDelete) {
        await deleteResume(id as string)
      }
      const res = await saveResumeData(resumeData, currentResumeId || undefined)
      if (res.success && res.data) {
        setLimitModalOpen(false)
        setCurrentResumeId(res.data.id)
        removeLocalStorageItems(LS_KEYS.resumeData, LS_KEYS.currentStep, LS_KEYS.completedSteps)
        toast({ title: "Resume Completed! 🎉", description: "Saved to cloud successfully." })
        router.push('/profile')
      } else {
        toast({ title: 'Save Failed', description: res.message || 'Could not save after deletion', variant: 'destructive' })
      }
    } catch (e) {
      console.error(e)
      toast({ title: 'Delete/Save Failed', description: 'Please try again', variant: 'destructive' })
    } finally {
      setLimitModalBusy(false)
    }
  };

  // Calculate progress
  const progress = (Array.from(completedSteps).length / steps.length) * 100

  const handleResumeDataUpdate = (updates: Partial<ResumeData> | ((prev: ResumeData) => ResumeData)) => {
    if (typeof updates === 'function') {
      setResumeData(updates);
    } else {
      setResumeData(prevData => ({
        ...prevData,
        ...updates,
        basics: {
          ...prevData.basics,
          ...(updates.basics || {}),
        },
        custom: {
          ...prevData.custom,
          ...(updates.custom || {}),
        },
        sections: updates.sections || prevData.sections,
      }));
    }
  };

  // AI Resume Data Handler
  const handleAIResumeData = (aiData: ResumeData) => {
    const updatedData: ResumeData = {
      basics: {
        ...resumeData.basics,
        ...aiData.basics,
      },
      custom: { ...resumeData.custom, ...aiData.custom },
      sections: resumeData.sections.map(existingSection => {
        const aiSection = aiData.sections.find(s => s.type === existingSection.type);
        if (!aiSection) return existingSection;

        const baseSection = {
          id: existingSection.id,
          title: existingSection.title,
          type: existingSection.type
        };

        switch (existingSection.type) {
          case SECTION_TYPES.EDUCATION:
            return {
              ...baseSection,
              type: SECTION_TYPES.EDUCATION,
              items: [
                ...(existingSection as EducationSection).items,
                ...(aiSection as EducationSection).items
              ]
            } as EducationSection;

          case SECTION_TYPES.EXPERIENCE:
            return {
              ...baseSection,
              type: SECTION_TYPES.EXPERIENCE,
              items: [
                ...(existingSection as ExperienceSection).items,
                ...(aiSection as ExperienceSection).items
              ]
            } as ExperienceSection;

          case SECTION_TYPES.SKILLS:
            return {
              ...baseSection,
              type: SECTION_TYPES.SKILLS,
              items: Array.from(new Set([
                ...(existingSection as SkillsSection).items,
                ...(aiSection as SkillsSection).items
              ]))
            } as SkillsSection;

          case SECTION_TYPES.CUSTOM:
            return {
              ...baseSection,
              type: SECTION_TYPES.CUSTOM,
              content: [...(existingSection as CustomSection).content]
            } as CustomSection;

          default:
            return existingSection;
        }
      })
    };

    // Update data and mark completed steps
    setResumeData(sanitizeResumeData(updatedData));
    
    // Mark completed steps
    const newCompletedSteps = new Set<number>();
    if (updatedData.basics.name && updatedData.basics.email) newCompletedSteps.add(0); // Personal info
    if (updatedData.basics.summary) newCompletedSteps.add(1); // Summary
    
    const educationSection = updatedData.sections.find(s => s.type === SECTION_TYPES.EDUCATION) as EducationSection | undefined;
    if (educationSection?.items && educationSection.items.length > 0) newCompletedSteps.add(2);
    
    const experienceSection = updatedData.sections.find(s => s.type === SECTION_TYPES.EXPERIENCE) as ExperienceSection | undefined;
    if (experienceSection?.items && experienceSection.items.length > 0) newCompletedSteps.add(3);
    
    const skillsSection = updatedData.sections.find(s => s.type === SECTION_TYPES.SKILLS) as SkillsSection | undefined;
    if (skillsSection?.items && skillsSection.items.length > 0) newCompletedSteps.add(4);
    
    setCompletedSteps(newCompletedSteps);
    
    toast({
      title: "AI Data Applied",
      description: "Your resume has been populated with AI-extracted information. You can now edit and refine it.",
    });
  };

  const renderCurrentSection = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoSection data={resumeData} onUpdate={handleResumeDataUpdate} />
      case 1:
        return <SummarySection data={resumeData} onUpdate={handleResumeDataUpdate} />
      case 2:
        return <EducationSectionComponent data={resumeData} onUpdate={handleResumeDataUpdate} />
      case 3:
        return <ExperienceSectionComponent data={resumeData} onUpdate={handleResumeDataUpdate} />
      case 4:
        return <SkillsSectionComponent data={resumeData} onUpdate={handleResumeDataUpdate} />
      case 5:
        return <CustomFieldsSection data={resumeData} onUpdate={handleResumeDataUpdate} onSave={saveToLocal} isDirty={false} />
      case 6:
        return <CustomSectionComponent data={resumeData} onUpdate={handleResumeDataUpdate} />
      case 7:
        return <ReviewSection data={resumeData} template={selectedTemplate} />
      default:
        return null
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-green-50 to-indigo-100">
 

      <div className="container mx-auto px-4 py-6">
       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
  {/* Left Section */}
  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create Your Resume</h1>
    {/* <p className="text-gray-600 mt-1 md:mt-2">
      Step {currentStep + 1} of {steps.length}
    </p> */}
  </div>

  {/* Right Section */}
  <div className="flex flex-wrap items-center gap-3">
    {/* Show/Hide Preview Button */}
    <Button
      variant="outline"
      size="sm"
      onClick={() => setShowPreview(!showPreview)}
      className="flex items-center gap-2"
    >
      <Eye className="w-4 h-4" />
      {showPreview ? "Hide Preview" : "Show Preview"}
    </Button>

    {/* Download Dropdown */}
    <DownloadDropDown
      data={{
        resumeData,
        template: selectedTemplate,
        filename: `${resumeData.basics.name || "resume"}.pdf`,
      }}
    />

    {/* Template Selector */}
    <select
      className="border rounded px-2 py-1 text-sm"
      value={selectedTemplate.id}
      onChange={(e) => {
        const t = availableTemplates.find((t) => t.id === e.target.value)
        if (t) setSelectedTemplate(t)
      }}
    >
      {availableTemplates.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>

    {/* AI Button */}
    <div title="Coming soon" className="inline-block">
      <Button
        onClick={effectiveAiEnabled ? () => setModalOpen(true) : undefined}
        disabled
        className="flex items-center gap-2"
      >
        <Star className="w-4 h-4" />
        Create with AI
      </Button>
    </div>


  </div>
</div>


        {/* <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progress</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div> */}

        <div className="grid gap-6 mt-6">
          <div className={`grid gap-6 ${showPreview ? "lg:grid-cols-2" : "lg:grid-cols-4"}`}>
            {/* Desktop Sidebar Navigation */}
            {!showPreview && (
              <div className="hidden lg:block">
                <Card className="sticky top-32">
                  <CardHeader>
                    <CardTitle className="text-lg">Step {currentStep + 1} of {steps.length}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {steps.map((step, index) => (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(index)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          currentStep === index
                            ? "bg-primary text-primary-foreground"
                            : completedSteps.has(index)
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "hover:bg-gray-100"
                        } `}
                      //  disabled={index > Math.max(...Array.from(completedSteps)) + 1}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{step.icon}</span>
                          <div>
                            <div className="font-medium">{step.title}</div>
                            <div className="text-xs opacity-75">{step.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Main Content */}
            <div className={showPreview ? "lg:col-span-1" : "lg:col-span-3"}>
              <Card className="min-h-[600px]">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{steps[currentStep].icon}</span>
                    <div>
                      <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
                      <CardDescription>{steps[currentStep].description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>{renderCurrentSection()}</CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Step
                </Button>

                <Button
                  onClick={() => {
                    if (currentStep === steps.length - 1) {
                      setSaveModalOpen(true)
                    } else {
                      setCurrentStep(prev => prev + 1)
                    }
                  }}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? "Saving..." : currentStep === steps.length - 1 ? "Complete Resume" : "Next Step"}
                  {currentStep === steps.length - 1 ? <Save className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Preview Panel */}
            {showPreview && (
              <div className="lg:col-span-1">
                {/* On mobile: Dialog, On desktop: Regular panel */}
                {typeof window !== 'undefined' && window.innerWidth < 1024 ? (
                  <Dialog open={showPreview} onOpenChange={setShowPreview}>
                    <DialogContent className="w-full sm:max-w-[95vw] h-[90vh] flex flex-col">
                      <DialogHeader>
                        <DialogTitle className="text-lg flex items-center justify-between">
                          Resume Preview
                          {/* <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowPreview(false)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                          </Button> */}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex-grow overflow-y-auto">
                        <ResumePreview 
                          resumeData={resumeData} 
                          template={selectedTemplate} 
                          onDataUpdate={handleResumeDataUpdate}
                          activeSection=""
                          setResumeData={setResumeData}
                          className="min-h-full"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Card className="sticky top-32">
                    <CardHeader>
                      <CardTitle className="text-lg">Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResumePreview 
                        resumeData={resumeData} 
                        template={selectedTemplate} 
                        onDataUpdate={handleResumeDataUpdate}
                        activeSection=""
                        setResumeData={setResumeData}
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AIResumeModal open={modalOpen} onOpenChange={setModalOpen} onResumeDataGenerated={handleAIResumeData} />
      <SaveResumeModal
        open={saveModalOpen}
        onOpenChange={setSaveModalOpen}
        onChooseLocal={onChooseLocal}
        onChooseCloudCreate={onChooseCloudCreate}
        onChooseCloudUpdate={onChooseCloudUpdate}
        busy={isSaving}
      />
      <ManageCloudModal
        open={limitModalOpen}
        onOpenChange={setLimitModalOpen}
        onConfirmDeleteAndRetry={handleConfirmDeleteAndRetry}
        onSaveLocally={onChooseLocal}
        loading={limitModalBusy}
      />
    </div>
  );
};

// Main component with Suspense boundary
export default function CreateResume() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    }>
      <CreateResumeContent />
    </Suspense>
  );
}
