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
import { CertificationsSection as CertificationsSectionComponent } from "@/components/certifications-section"
import { ProjectsSection as ProjectsSectionComponent } from "@/components/projects-section"
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
import AIResumeModal from '../../../components/ai-resume-modal';
import { usePostDownloadReview } from "@/hooks/use-post-download-review";
import ManageCloudModal from '@/components/manage-cloud-modal';
import SaveResumeModal from '@/components/save-resume-modal';
import type { FC } from 'react'
import { CustomSection as CustomSectionComponent } from "@/components/custom-section"
import { useAuth } from "@/contexts/auth-context"
import {  CREATE_RESUME_STEPS } from "@/app/constants/global"
import { LS_KEYS, setLocalStorageJSON, setLocalStorageItem, removeLocalStorageItems, getLocalStorageJSON, getLocalStorageItem, getValidResumeFromLocalStorage } from "@/utils/localstorage"
import { initializeSectionOrder } from "@/utils/sectionOrdering"
import { CreateResumeHeader } from "@/components/CreateResumeHeader"
import { useTemplateSelector } from "@/hooks/use-template-selector"
import { generateResumePDF } from "@/lib/pdf-generators"
import { sanitizeResumeData } from "@/utils/createResume"
import { createLocalResume, updateLocalResume, getLocalResumeById } from "@/lib/local-storage"
import { SHOW_ERROR, SHOW_SUCCESS } from "@/utils/toast"
import { sampleResume } from "@/lib/examples/resume-example"

const initialData: ResumeData = sampleResume //sampleResumeData

const CreateResumeContent: FC = () => {
  const { loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { triggerReviewModal, ReviewModalComponent } = usePostDownloadReview({ actionType: 'download' })
  // const { effectiveAiEnabled } = useAi()

  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [resumeData, setResumeData] = useState<ResumeData>(initialData)
  console.log("ini    ", initialData)
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

  console.log("resumeData",resumeData)

  // Load data from localStorage on component mount (only if no cloud resume ID)
  useEffect(() => {
    const resumeId = searchParams.get('id')
    
    // Only load localStorage data if we're not editing a cloud resume
    if (!resumeId) {
      const savedResumeData = getValidResumeFromLocalStorage()
      const savedCurrentStep = getLocalStorageItem(LS_KEYS.currentStep)
      const savedCompletedSteps = getLocalStorageJSON<number[]>(LS_KEYS.completedSteps, [])
      const savedResumeId = getLocalStorageItem(LS_KEYS.currentResumeId)

      if (savedResumeData) {
        setResumeData(savedResumeData)
      }
      if (savedCurrentStep) {
        setCurrentStep(parseInt(savedCurrentStep, 10))
      }
      if (savedCompletedSteps) {
        setCompletedSteps(new Set(savedCompletedSteps))
      }
      if (savedResumeId) {
        setCurrentResumeId(savedResumeId)
        
        // If it's a local resume ID, load the actual data from the new system
        if (savedResumeId.startsWith('local_')) {
          const localResume = getLocalResumeById(savedResumeId)
          if (localResume) {
            setResumeData(localResume.data)
          }
        }
      }
    }
  }, [searchParams])

  // Load cloud resume data if id query parameter is present
  useEffect(() => {
    const resumeId = searchParams.get('id')
    if (resumeId && !loading) {
      loadResumeData(resumeId).then((result) => {
        if (result.success && result.data) {
          setResumeData(result.data)
          setCurrentResumeId(resumeId)
          // Clear localStorage when loading cloud resume
          removeLocalStorageItems(LS_KEYS.resumeData, LS_KEYS.currentStep, LS_KEYS.completedSteps, LS_KEYS.currentResumeId)
        } else {
          console.error('Failed to load cloud resume:', result)
        }
      }).catch((error) => {
        console.error('Error loading cloud resume:', error)
      })
    }
  }, [searchParams, loading])

   useEffect(() => {
    setSelectedTemplate(template)
  }, [searchParams, availableTemplates, template])

  
  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (resumeData) {
        saveToLocal()
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [resumeData, currentResumeId])

  // Save to local storage
  const saveToLocal = () => {
    try {
      setLocalStorageJSON(LS_KEYS.resumeData, resumeData)
      setLocalStorageItem(LS_KEYS.currentStep, currentStep.toString())
      setLocalStorageJSON(LS_KEYS.completedSteps, Array.from(completedSteps))
      if (currentResumeId) {
        setLocalStorageItem(LS_KEYS.currentResumeId, currentResumeId)
      }
    } catch (error) {
      console.error('Error saving to local storage:', error)
    }
  };

  // Download resume as PDF
  const downloadResume = async () => {
    try {
      const filename = `${resumeData.basics?.name || 'resume'}_${new Date().toISOString().split('T')[0]}.pdf`
      await generateResumePDF({
        resumeData,
        template: selectedTemplate,
        filename
      })
      SHOW_SUCCESS({title: "Resume downloaded successfully!"})
      
      // Trigger review modal after successful download
      setTimeout(() => {
        triggerReviewModal()
      }, 1000) // Small delay to let the success toast show
    } catch (error) {
      console.error('Error downloading resume:', error)
      SHOW_ERROR({title: "Failed to download resume."})
    }
  }

  // Save handlers
  const onChooseLocal = async () => {
    try {
      let savedResume
      
      if (currentResumeId && currentResumeId.startsWith('local_')) {
        // Update existing local resume
        savedResume = updateLocalResume(currentResumeId, resumeData)
        if (!savedResume) {
          throw new Error('Failed to update local resume')
        }
      } else {
        // Create new local resume
        savedResume = createLocalResume(resumeData)
      }
      
      setCurrentResumeId(savedResume.id)
      
      // Also save to localStorage for immediate access
      await saveToLocal()
      
      // Auto-download after successful save
      await downloadResume()
      
      setSaveModalOpen(false)
      // Don't redirect to profile, let user stay on page
    } catch (error) {
      console.error('Error saving local resume:', error)
      SHOW_ERROR({ title: "Failed to save locally", description: "Error saving resume to local storage" })
    }
  };

  const onChooseCloudCreate = async () => {
    setIsSaving(true)
    try {
      const res = await saveResumeData(resumeData)
      if (res.success && res.data) {
        setCurrentResumeId(res.data.id)
        removeLocalStorageItems(LS_KEYS.resumeData, LS_KEYS.currentStep, LS_KEYS.completedSteps, LS_KEYS.currentResumeId)
        
        // Auto-download after successful save
        await downloadResume()
        
        setSaveModalOpen(false)
        // Don't redirect to profile, let user stay on page
      } else {
        SHOW_ERROR({ title: "Failed to save resume", description: res.message || "Unknown error occurred" })
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
        removeLocalStorageItems(LS_KEYS.resumeData, LS_KEYS.currentStep, LS_KEYS.completedSteps, LS_KEYS.currentResumeId)
        
        // Auto-download after successful save
        await downloadResume()
        
        setSaveModalOpen(false)
        // Don't redirect to profile, let user stay on page
      } else {
        SHOW_ERROR({ title: "Failed to update resume", description: res.message || "Unknown error occurred" })
      }
    } finally {
      setIsSaving(false)
    }
  };

  const onDownloadOnly = async () => {
    try {
      await downloadResume()
      setSaveModalOpen(false)
      // Don't redirect, let user stay on page
    } catch (error) {
      console.error('Error downloading resume:', error)
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
        removeLocalStorageItems(LS_KEYS.resumeData, LS_KEYS.currentStep, LS_KEYS.completedSteps, LS_KEYS.currentResumeId)
        router.push('/profile')
      } else {
      }
    } catch (e) {
      console.error(e)
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
    
    const projectsSection = updatedData.sections.find(s => s.type === SECTION_TYPES.PROJECTS) as any;
    if (projectsSection?.items && projectsSection.items.length > 0) newCompletedSteps.add(4);

    const skillsSection = updatedData.sections.find(s => s.type === SECTION_TYPES.SKILLS) as SkillsSection | undefined;
    if (skillsSection?.items && skillsSection.items.length > 0) newCompletedSteps.add(5);

    const certsSection = updatedData.sections.find(s => s.type === SECTION_TYPES.CERTIFICATIONS) as any;
    if (certsSection?.items && certsSection.items.length > 0) newCompletedSteps.add(6);
    
    setCompletedSteps(newCompletedSteps);
    

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
        return <ProjectsSectionComponent data={resumeData} onUpdate={handleResumeDataUpdate} />
      case 5:
        return <SkillsSectionComponent data={resumeData} onUpdate={handleResumeDataUpdate} />
      case 6:
        return <CertificationsSectionComponent data={resumeData} onUpdate={handleResumeDataUpdate} />
      case 7:
        return <CustomFieldsSection data={resumeData} onUpdate={handleResumeDataUpdate} onSave={saveToLocal} isDirty={false} />
      case 8:
        return <CustomSectionComponent data={resumeData} onUpdate={handleResumeDataUpdate} />
      case 9:
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
                      <div className="grow overflow-y-auto">
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
                  <Card className="sticky top-32 h-screen overflow-auto">
                    <CardHeader>
                      <CardTitle className="text-lg text-center">Preview (you can click/tap on any line and edit directly in preview)</CardTitle>
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
        onDownloadOnly={onDownloadOnly}
        busy={isSaving}
      />
      <ManageCloudModal
        open={limitModalOpen}
        onOpenChange={setLimitModalOpen}
        onConfirmDeleteAndRetry={handleConfirmDeleteAndRetry}
        onSaveLocally={onChooseLocal}
        loading={limitModalBusy}
      />
      <ReviewModalComponent />
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
