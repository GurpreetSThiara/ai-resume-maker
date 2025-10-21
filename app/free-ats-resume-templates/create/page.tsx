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
  CustomSection,
  Section
} from "@/types/resume"
import { SECTION_TYPES } from "@/types/resume"
import { availableTemplates, googleTemplate } from "@/lib/templates"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import AIResumeModal from '../../../components/ai-resume-modal';
import ManageCloudModal from '@/components/manage-cloud-modal';
import SaveResumeModal from '@/components/save-resume-modal';
import type { FC } from 'react'
import { CustomSection as CustomSectionComponent } from "@/components/custom-section"
import { useAuth } from "@/contexts/auth-context"
import {  CREATE_RESUME_STEPS } from "@/app/constants/global"
import { LS_KEYS, setLocalStorageJSON, setLocalStorageItem, removeLocalStorageItems } from "@/utils/localstorage"
import { initializeSectionOrder } from "@/utils/sectionOrdering"
import { devopsResumeData4 } from "@/lib/examples/resume/deveops"
import { CreateResumeHeader } from "@/components/CreateResumeHeader"
import { useTemplateSelector } from "@/hooks/use-template-selector"
import { sanitizeResumeData } from "@/utils/createResume"

const initialData: ResumeData = devopsResumeData4 //sampleResumeData

const CreateResumeContent: FC = () => {
  console.log("Rendering CreateResumeContent")
  const { loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  // const { effectiveAiEnabled } = useAi()

  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [resumeData, setResumeData] = useState<ResumeData>(initialData)
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(googleTemplate)
  const template = useTemplateSelector(availableTemplates)

  const [showPreview, setShowPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [limitModalOpen, setLimitModalOpen] = useState(false)
  const [limitModalBusy, setLimitModalBusy] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const steps = CREATE_RESUME_STEPS

   useEffect(() => {
    setSelectedTemplate(template)
  }, [searchParams, availableTemplates, template])

  
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

  const handleSectionReorder = (reorderedSections: Section[]) => {
    handleResumeDataUpdate((prev: ResumeData) => ({
      ...prev,
      sections: reorderedSections
    }))
  }

  // Initialize section order if not set
  const sectionsWithOrder = initializeSectionOrder(resumeData.sections)


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
       <CreateResumeHeader
          sectionsWithOrder={sectionsWithOrder}
          handleSectionReorder={handleSectionReorder}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          resumeData={resumeData}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          availableTemplates={availableTemplates}
          effectiveAiEnabled={false}
          setModalOpen={setModalOpen}
        />

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
