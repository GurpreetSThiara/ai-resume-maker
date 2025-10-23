"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  FileText, 
  Edit, 
  Trash2, 
  Download, 
  Plus, 
  Settings, 
  Calendar,
  Eye,
  EyeOff
} from "lucide-react"
import { getUserResumes, deleteResume, loadResumeData } from "@/lib/supabase-functions"
import { getLocalResumes, deleteLocalResume as removeLocalResume, getLocalResumeById, LocalResumeItem, duplicateLocalResume } from "@/lib/local-storage"
import { useAi } from "@/hooks/use-ai"
import { saveResumeData } from "@/lib/supabase-functions"
import { useRouter } from "next/navigation"
import ResumePreview from "@/components/resume-preview"
import type { ResumeData, ResumeTemplate } from "@/types/resume"
import { CREATE_RESUME } from "@/config/urls"
import { loadUserResumes } from "@/services/resumeService"
import { useAuth } from "@/contexts/auth-context"
import { LS_KEYS, setLocalStorageJSON, setLocalStorageItem } from "@/utils/localstorage"
import DeleteConfirmModal from '@/components/appUI/modals/DeleteConfirmModal'
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface ResumeItem {
  id: string
  title: string
  created_at: string
  updated_at: string
  template_id: string
  is_public: boolean
}

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

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  //const { toast } = useToast()
  const { usage, refreshUsage } = useAi()
  
  const [resumes, setResumes] = useState<ResumeItem[]>([])
  const [loadingResumes, setLoadingResumes] = useState(false)
  const [localResumes, setLocalResumes] = useState<any[]>([])
  const [selectedResume, setSelectedResume] = useState<ResumeItem | null>(null)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [deletingResume, setDeletingResume] = useState<string | null>(null)
  const [hasLoadedResumes, setHasLoadedResumes] = useState(false)
  const [isSyncingLocal, setIsSyncingLocal] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deleteResumeId, setDeleteResumeId] = React.useState<string | null>(null)
  const [isLocalDeleteModalOpen, setIsLocalDeleteModalOpen] = useState(false)
  const [deleteLocalResumeId, setDeleteLocalResumeId] = useState<string | null>(null)



  useEffect(() => {
    console.log("[ProfilePage] useEffect - loading:", loading, "user:", user, "hasLoadedResumes:", hasLoadedResumes)
    if (loading) return
    // Always load local resumes when page becomes interactive
    setLocalResumes(getLocalResumes())
    // Load cloud resumes once per mount when user present
    if (user && !hasLoadedResumes) {
      console.log("[ProfilePage] Calling loadUserResumes (imported from '@/services/resumeService')")
      loadUserResumes({loadingResumes,setResumes,setHasLoadedResumes,setLoadingResumes})
    }
  }, [loading, user, hasLoadedResumes])



  const handleResumeClick = async (resume: ResumeItem) => {
    setSelectedResume(resume)
    setShowPreview(true)
    
    try {
      const result = await loadResumeData(resume.id)
      if (result.success && result.data) {
        setResumeData(result.data)
      } else {
  
      }
    } catch (error) {
      console.error("Error loading resume data:", error)

    }
  }

  const handleEditResume = (resumeId: string) => {
    router.push(`${CREATE_RESUME}/create?id=${resumeId}`)
  }

  const handleDeleteResume = async (resumeId: string | null) => {
    if (!resumeId) return

    setDeletingResume(resumeId)
    try {
      const result = await deleteResume(resumeId)
      if (result.success) {
        setResumes(prev => prev.filter(r => r.id !== resumeId))
        if (selectedResume?.id === resumeId) {
          setSelectedResume(null)
          setResumeData(null)
          setShowPreview(false)
        }
 
      } else {
 
      }
    } catch (error) {
      console.error("Error deleting resume:", error)
  
    } finally {
      setDeletingResume(null)
    }
  }

  const handleCreateNew = () => {
    router.push(`${CREATE_RESUME}/create`)
  }

  const handleSyncLocalToCloud = async () => {
    if (!user) return
    if (resumes.length >= 3) {
      return
    }
    if (localResumes.length === 0) {
      return
    }
    const confirmSync = confirm("Sync up to the last 3 local resumes to your account?")
    if (!confirmSync) return
    setIsSyncingLocal(true)
    try {
      const availableSlots = Math.max(0, 3 - resumes.length)
      const toSync = localResumes.slice(0, availableSlots)
      for (const item of toSync) {
        const result = await saveResumeData(item.data)
        if (!result.success) {
          throw new Error(result.message || "Failed to sync a resume")
        }
      }
      await loadUserResumes({loadingResumes,setResumes,setHasLoadedResumes,setLoadingResumes})
    } catch (err) {
      console.error(err)
    } finally {
      setIsSyncingLocal(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleResumeDataUpdate = (data: ResumeData | ((prev: ResumeData) => ResumeData)) => {
    if (typeof data === 'function') {
      setResumeData((prev) => (prev ? (data as (p: ResumeData) => ResumeData)(prev) : prev))
    } else {
      setResumeData(data)
    }
  }

  // Local resume actions
  const handleEditLocalResume = (localResume: LocalResumeItem) => {
    // Save the resume data to localStorage for the builder to pick up
    setLocalStorageJSON(LS_KEYS.resumeData, localResume.data)
    setLocalStorageItem(LS_KEYS.currentStep, '1')
    setLocalStorageJSON(LS_KEYS.completedSteps, [0, 1, 2, 3, 4])
    setLocalStorageItem(LS_KEYS.currentResumeId, localResume.id)
    router.push(`${CREATE_RESUME}/create`)
  }

  const handleDeleteLocalResume = (id: string) => {
    setDeleteLocalResumeId(id)
    setIsLocalDeleteModalOpen(true)
  }

  const confirmDeleteLocalResume = () => {
    if (deleteLocalResumeId) {
      removeLocalResume(deleteLocalResumeId)
      setLocalResumes(getLocalResumes())
      setDeleteLocalResumeId(null)
    }
  }

  const handleDuplicateLocalResume = (id: string) => {
    const duplicatedResume = duplicateLocalResume(id)
    if (duplicatedResume) {
      setLocalResumes(getLocalResumes())
    }
  }

  const handleViewLocalResume = (localResume: LocalResumeItem) => {
    // For now, just show the data in a modal or redirect to view mode
    // You could implement a read-only view modal here
   
  }

  const openPreview = (resume: ResumeItem) => {
    setSelectedResume(resume);
    setShowPreview(true);
    if (window.innerWidth < 640) setIsPreviewModalOpen(true);
  }
  const closePreview = () => {
    setShowPreview(false);
    setIsPreviewModalOpen(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    router.push("/auth")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-2 py-3 sm:px-4 sm:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="text-lg">
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center sm:items-start">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Profile</h1>
              <p className="text-gray-600 break-words text-center sm:text-left text-sm sm:text-base">{user.email}</p>
            </div>
          </div>
          <div className="flex sm:items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => router.push("/settings")}> <Settings className="w-4 h-4 mr-2" /> Settings </Button>
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Resume List */}
          <div className="md:col-span-2 lg:col-span-2 order-2 md:order-1">
            <Card className="py-4 px-2 sm:px-4 md:px-6">
              {/* Cloud resumes */}
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Your Resumes</CardTitle>
                    <CardDescription>{resumes.length} of 3 resumes created</CardDescription>
                  </div>
                  <Button onClick={handleCreateNew} className="mt-2 sm:mt-0 w-full sm:w-auto" disabled={resumes.length >= 3}>
                    <Plus className="w-4 h-4 mr-2" /> Create New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingResumes ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No cloud resumes yet</h3>
                    <p className="text-gray-600 mb-2 sm:mb-4 text-sm">Create your first resume to get started</p>
                    <Button onClick={handleCreateNew} className="w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2" /> Create Your First Resume
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {resumes.map((resume) => (
                      <Card key={resume.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="py-3 px-2 sm:px-4">
                          <div className="flex flex-col gap-2 sm:flex-row items-start sm:items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <FileText className="w-7 h-7 text-blue-600" />
                              <div>
                                <h3 className="font-medium text-gray-900 text-sm sm:text-base">{resume.title}</h3>
                                <p className="text-xs sm:text-sm text-gray-600">Updated {formatDate(resume.updated_at)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-0">
                              {/* <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Preview"
                                className="w-10 h-10"
                                onClick={() => openPreview(resume)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button> */}
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Edit"
                                className="w-10 h-10"
                                onClick={() => handleEditResume(resume.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                aria-label="Delete"
                                className="w-10 h-10 text-red-600 hover:text-red-700"
                                onClick={() =>{ setIsDeleteModalOpen(true) 
                                  setDeleteResumeId(resume.id)
                                }}
                                disabled={deletingResume === resume.id}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
                {/* Local resumes */}
                <Card className="mt-4">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                      <div>
                        <CardTitle className="flex items-center gap-1 sm:gap-2 text-base">Local Resumes <Badge variant="secondary">{localResumes.length}</Badge></CardTitle>
                        <CardDescription className="text-xs sm:text-sm">These are saved in your browser. You can sync up to 3 to your account.</CardDescription>
                      </div>
                      <Button size="sm" onClick={handleSyncLocalToCloud} className="w-full sm:w-auto mt-2 sm:mt-0" disabled={!user || isSyncingLocal || resumes.length >= 3 || localResumes.length === 0}>
                        {isSyncingLocal ? "Syncing..." : "Sync to Cloud"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {localResumes.length === 0 ? (
                      <p className="text-muted-foreground">No local resumes found.</p>
                    ) : (
                      <div className="space-y-2 sm:space-y-3">
                        {localResumes.map((localResume) => (
                          <div key={localResume.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-0 hover:shadow-sm transition-shadow">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm sm:text-base truncate">{localResume.title}</h4>
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                Last updated: {new Date(localResume.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 sm:w-10 sm:h-10 sm:p-0 sm:flex-none" 
                                onClick={() => handleEditLocalResume(localResume)}
                                title="Edit Resume"
                              >
                                <Edit className="w-4 h-4 sm:mr-0 mr-2" />
                                <span className="sm:hidden">Edit</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 sm:w-10 sm:h-10 sm:p-0 sm:flex-none text-red-600 hover:text-red-700 hover:border-red-300" 
                                onClick={() => handleDeleteLocalResume(localResume.id)}
                                title="Delete Resume"
                              >
                                <Trash2 className="w-4 h-4 sm:mr-0 mr-2" />
                                <span className="sm:hidden">Delete</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel (side on lg+, modal on mobile) */}
          <div className="lg:col-span-1 order-1 md:order-2 hidden sm:block">
            {showPreview && selectedResume && resumeData && (
              <Card className="sticky top-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base sm:text-lg">Preview</CardTitle>
                    <Button variant="ghost" size="sm" onClick={closePreview}><EyeOff className="w-4 h-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResumePreview
                    resumeData={resumeData}
                    template={defaultTemplate}
                    onDataUpdate={handleResumeDataUpdate}
                    activeSection=""
                    setResumeData={setResumeData}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        {/* Mobile Preview Modal */}
        <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
          <DialogContent className="sm:max-w-md p-0 max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-3 border-b">
              <span className="font-medium">Preview</span>
              <Button variant="ghost" size="sm" onClick={() => setIsPreviewModalOpen(false)}><EyeOff className="w-4 h-4" /></Button>
            </div>
            {selectedResume && resumeData && (
              <div className="p-3">
                <ResumePreview
                  resumeData={resumeData}
                  template={defaultTemplate}
                  onDataUpdate={handleResumeDataUpdate}
                  activeSection=""
                  setResumeData={setResumeData}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <DeleteConfirmModal   
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={()=>{handleDeleteResume(deleteResumeId)}} 
      />

      <DeleteConfirmModal   
        open={isLocalDeleteModalOpen}
        onOpenChange={setIsLocalDeleteModalOpen}
        onConfirm={confirmDeleteLocalResume}
        title="Delete Local Resume"
        description="Are you sure you want to delete this local resume? This action cannot be undone and will permanently remove the resume from your browser storage."
      />
    </div>
  )
}
 