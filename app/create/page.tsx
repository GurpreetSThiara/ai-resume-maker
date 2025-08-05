"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Trophy, Star, Zap, Target, Eye, Download, Save } from "lucide-react"
import { PersonalInfoSection } from "@/components/personal-info-section"
import { EducationSection } from "@/components/education-section"
import { ExperienceSection } from "@/components/experience-section"
import { SkillsSection } from "@/components/skills-section"
import { CustomFieldsSection } from "@/components/custom-fields-section"
import { ReviewSection } from "@/components/review-section"
import { saveResumeData, getUserResumeCount, loadResumeData } from "@/lib/supabase-functions"
import { generateResumePDF } from "@/lib/pdf-generators/google-resume-generator"
import ResumePreview from "@/components/resume-preview" // Import ResumePreview component
import type { ResumeData, ResumeTemplate } from "@/types/resume"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

const initialData: ResumeData = {
  name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  custom: {},
  sections: [
    { id: "1", title: "Education", content: {} },
    { id: "2", title: "Professional Experience", content: {} },
    { id: "3", title: "Other", content: {} },
  ],
}

const steps = [
  { id: 0, title: "Personal Info", icon: "👤", description: "Tell us about yourself" },
  { id: 1, title: "Education", icon: "🎓", description: "Your academic journey" },
  { id: 2, title: "Experience", icon: "💼", description: "Professional background" },
  { id: 3, title: "Skills & More", icon: "🚀", description: "Showcase your abilities" },
  { id: 4, title: "Custom Fields", icon: "⚡", description: "Add personal details" },
  { id: 5, title: "Review", icon: "✨", description: "Final review" },
]

const achievements = [
  { id: "first_step", title: "Getting Started", icon: <Star className="w-4 h-4" />, unlocked: false },
  { id: "half_way", title: "Halfway Hero", icon: <Zap className="w-4 h-4" />, unlocked: false },
  { id: "complete", title: "Resume Master", icon: <Trophy className="w-4 h-4" />, unlocked: false },
  { id: "perfectionist", title: "Detail Oriented", icon: <Target className="w-4 h-4" />, unlocked: false },
]

// Default template - Google style
const defaultTemplate: ResumeTemplate = {
  id: "google",
  name: "Google Style",
  description: "Clean, professional template inspired by Google's design principles",
  theme: {
    fontSize: {
      name: "text-3xl",
      section: "text-xl",
      content: "text-base",
      small: "text-sm",
    },
    colors: {
      primary: "text-blue-700",
      secondary: "text-gray-600",
      text: "text-gray-800",
      accent: "text-blue-600",
    },
    spacing: {
      section: "mb-8",
      item: "mb-4",
      content: "mb-2",
    },
    layout: {
      container: "max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden",
      header: "border-b border-gray-200 p-4",
      content: "p-6",
    },
  },
  pdfConfig: {
    fonts: {
      regular: "TimesRoman",
      bold: "TimesRomanBold",
    },
    sizes: {
      name: 20,
      section: 14,
      content: 12,
      small: 10,
    },
    colors: {
      text: { r: 0.2, g: 0.2, b: 0.2 },
      heading: { r: 0.1, g: 0.3, b: 0.7 },
      secondary: { r: 0.4, g: 0.4, b: 0.4 },
      linkColor: { r: 0, g: 0, b: 1 },
    },
    spacing: {
      page: 15,
      section: 20,
      item: 10,
    },
  },
}

export default function CreateResume() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [resumeData, setResumeData] = useState<ResumeData>(initialData)
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(defaultTemplate)
  const [showPreview, setShowPreview] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null)
  const [userAchievements, setUserAchievements] = useState(achievements)
  const [resumeCount, setResumeCount] = useState(0)
  const [isCheckingLimit, setIsCheckingLimit] = useState(false)
  const [isLoadingResume, setIsLoadingResume] = useState(false)
  const [hasProcessedResumeId, setHasProcessedResumeId] = useState(false)

  // Calculate progress
  const progress = (completedSteps.size / steps.length) * 100

  // Debounce function to prevent duplicate API calls
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const debounce = (func: Function, delay: number) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(func, delay)
  }

  // Check resume limit only once when user is loaded
  useEffect(() => {
    if (!loading && user && !currentResumeId && !searchParams.get('id')) {
      debounce(() => {
        checkResumeLimit()
      }, 300)
    }
    
    // Cleanup function to clear timeout on unmount
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [user, loading, currentResumeId])

  // Load existing resume data if editing
  useEffect(() => {
    console.log("useEffect triggered:", { loading, user: !!user, hasProcessedResumeId, currentResumeId })
    if (!loading && user && !hasProcessedResumeId) {
      const resumeId = searchParams.get('id')
      console.log("Resume ID from URL:", resumeId)
      if (resumeId && !currentResumeId) {
        console.log("Loading existing resume...")
        setIsLoadingResume(true)
        setHasProcessedResumeId(true)
        loadExistingResume(resumeId)
      } else if (!resumeId) {
        console.log("No resume ID, loading from localStorage...")
        // Only load from localStorage if not editing an existing resume
        setHasProcessedResumeId(true)
        loadFromLocalStorage()
      }
    }
  }, [user, loading, currentResumeId, hasProcessedResumeId])

  const loadExistingResume = async (resumeId: string) => {
    console.log("Loading existing resume:", resumeId)
    try {
      const result = await loadResumeData(resumeId)
      console.log("Load result:", result)
      if (result.success && result.data) {
        setResumeData(result.data)
        setCurrentResumeId(resumeId)
        // Mark all steps as completed for editing
        setCompletedSteps(new Set([0, 1, 2, 3, 4, 5]))
        setCurrentStep(0) // Start from first step for editing, but allow navigation to all steps
        toast({
          title: "Resume Loaded",
          description: "You can now edit your existing resume.",
        })
      } else {
        console.error("Failed to load resume:", result.error)
        toast({
          title: "Error",
          description: "Failed to load resume data.",
          variant: "destructive",
        })
        router.push("/profile")
      }
    } catch (error) {
      console.error("Error loading resume:", error)
      toast({
        title: "Error",
        description: "Failed to load resume data.",
        variant: "destructive",
      })
      router.push("/profile")
    } finally {
      setIsLoadingResume(false)
    }
  }

  const checkResumeLimit = async () => {
    console.log("checkResumeLimit called, isCheckingLimit:", isCheckingLimit)
    
    setIsCheckingLimit(true)
    try {
      const result = await getUserResumeCount()
      console.log("Resume count result:", result)
      if (result.success) {
        setResumeCount(result.count)
        if (result.count >= 3 && !currentResumeId) {
          toast({
            title: "Resume Limit Reached",
            description: "You can only create up to 3 resumes. Please delete an existing resume or edit one of your current resumes.",
            variant: "destructive",
          })
          router.push("/profile")
        }
      }
    } catch (error) {
      console.error("Error checking resume limit:", error)
    } finally {
      console.log("Setting isCheckingLimit to false")
      setIsCheckingLimit(false)
    }
  }

  const triggerCelebration = () => {
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 2000)
  }

  const handleNext = async () => {
    // Validate current step before proceeding
    const validationResult = validateCurrentStep()
    if (!validationResult.isValid) {
      toast({
        title: "Required Fields Missing",
        description: validationResult.message,
        variant: "destructive",
      })
      return
    }

    // Save to local storage
    saveToLocalStorage()

    if (currentStep < steps.length - 1) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]))
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex <= Math.max(...completedSteps) + 1) {
      setCurrentStep(stepIndex)
    }
  }

  const updateResumeData = (updates: Partial<ResumeData>) => {
    setResumeData((prev) => ({ ...prev, ...updates }))
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Personal Info
        if (!resumeData.name?.trim()) {
          return { isValid: false, message: "Please enter your full name" }
        }
        if (!resumeData.email?.trim()) {
          return { isValid: false, message: "Please enter your email address" }
        }
        break
      case 1: // Education
        const educationSection = resumeData.sections.find(s => s.title === "Education")
        if (!educationSection || Object.keys(educationSection.content).length === 0) {
          return { isValid: false, message: "Please add at least one education entry" }
        }
        break
      case 2: // Experience
        const experienceSection = resumeData.sections.find(s => s.title === "Professional Experience")
        if (!experienceSection || Object.keys(experienceSection.content).length === 0) {
          return { isValid: false, message: "Please add at least one work experience" }
        }
        break
      case 3: // Skills
        const skillsSection = resumeData.sections.find(s => s.title === "Other")
        if (!skillsSection || Object.keys(skillsSection.content).length === 0) {
          return { isValid: false, message: "Please add at least one skill or section" }
        }
        break
      case 4: // Custom Fields - optional, no validation needed
        break
      case 5: // Review - no validation needed
        break
    }
    return { isValid: true, message: "" }
  }

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('resumeData', JSON.stringify(resumeData))
      localStorage.setItem('currentStep', currentStep.toString())
      localStorage.setItem('completedSteps', JSON.stringify(Array.from(completedSteps)))
    } catch (error) {
      console.error('Error saving to local storage:', error)
    }
  }

  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('resumeData')
      const savedStep = localStorage.getItem('currentStep')
      const savedCompletedSteps = localStorage.getItem('completedSteps')
      
      if (savedData) {
        setResumeData(JSON.parse(savedData))
      }
      if (savedStep) {
        setCurrentStep(parseInt(savedStep))
      }
      if (savedCompletedSteps) {
        setCompletedSteps(new Set(JSON.parse(savedCompletedSteps)))
      }
    } catch (error) {
      console.error('Error loading from local storage:', error)
    }
  }

  const handleGeneratePDF = async () => {
    await generateResumePDF({
      resumeData,
      template: selectedTemplate,
      filename: `${resumeData.name || "resume"}.pdf`,
    })
  }

  const handleCompleteResume = async () => {
    // First save to local storage
    saveToLocalStorage()
    
    setIsSaving(true)
    try {
      const result = await saveResumeData(resumeData, currentResumeId || undefined)
      if (result.success && result.data) {
        setCurrentResumeId(result.data.id)
        
        // Clear local storage after successful save
        localStorage.removeItem('resumeData')
        localStorage.removeItem('currentStep')
        localStorage.removeItem('completedSteps')
        
        toast({
          title: "Resume Completed! 🎉",
          description: "Your resume has been saved to the cloud successfully.",
        })
        // Redirect to profile page after successful completion
        router.push("/profile")
      } else {
        toast({
          title: "Save Failed",
          description: result.message || "Failed to save your resume. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving resume:", error)
      toast({
        title: "Save Failed",
        description: "Failed to save your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Load from local storage on component mount
  useEffect(() => {
    if (!loading && user) {
      loadFromLocalStorage()
    }
  }, [user, loading])

  const handleResumeDataUpdate = (data: ResumeData | ((prev: ResumeData) => ResumeData)) => {
    if (typeof data === 'function') {
      setResumeData(data)
    } else {
      setResumeData(data)
    }
  }

  const saveToLocal = () => {
    saveToLocalStorage()
  }

  const renderCurrentSection = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoSection data={resumeData} onUpdate={updateResumeData} onSave={saveToLocal} />
      case 1:
        return <EducationSection data={resumeData} onUpdate={updateResumeData} />
      case 2:
        return <ExperienceSection data={resumeData} onUpdate={updateResumeData} />
      case 3:
        return <SkillsSection data={resumeData} onUpdate={updateResumeData} />
      case 4:
        return <CustomFieldsSection data={resumeData} onUpdate={updateResumeData} onSave={saveToLocal} isDirty={false} />
      case 5:
        return <ReviewSection data={resumeData} template={selectedTemplate} />
      default:
        return null
    }
  }

  if (loading || isCheckingLimit || isLoadingResume) {
    console.log("Showing loading state:", { loading, isCheckingLimit, isLoadingResume })
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Your Resume</h1>
            <p className="text-gray-600 mt-2">Step {currentStep + 1} of {steps.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
            {showPreview && (
              <Button size="sm" onClick={handleGeneratePDF} className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            )}
            <div className="flex gap-1">
              {userAchievements.map((achievement) => (
                <Badge
                  key={achievement.id}
                  variant={achievement.unlocked ? "default" : "secondary"}
                  className={`${achievement.unlocked ? "bg-yellow-500 text-white" : "opacity-50"}`}
                >
                  {achievement.icon}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className={`grid gap-6 ${showPreview ? "lg:grid-cols-2" : "lg:grid-cols-4"}`}>
          {/* Desktop Sidebar Navigation */}
          {!showPreview && (
            <div className="hidden lg:block">
              <Card className="sticky top-32">
                <CardHeader>
                  <CardTitle className="text-lg">Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {steps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(index)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        currentStep === index
                          ? "bg-primary text-primary-foreground"
                          : completedSteps.has(index)
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "hover:bg-gray-100"
                      } ${index > Math.max(...completedSteps) + 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={index > Math.max(...completedSteps) + 1}
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

            {/* Mobile Navigation */}
            <div className="flex justify-between mt-6 lg:hidden">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep ? "bg-primary" : completedSteps.has(index) ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={currentStep === steps.length - 1 ? handleCompleteResume : handleNext}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                {isSaving ? "Saving..." : currentStep === steps.length - 1 ? "Complete Resume" : "Next"}
                {currentStep === steps.length - 1 ? <Save className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Step
              </Button>

              <Button
                onClick={currentStep === steps.length - 1 ? handleCompleteResume : handleNext}
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
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
