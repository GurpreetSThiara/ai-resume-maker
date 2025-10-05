"use client"

import { useState, useEffect, useRef } from "react"
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
import { getLocalResumes, removeLocalResume, LocalResumeItem } from "@/lib/local-storage"
import { useAi } from "@/hooks/use-ai"
import { saveResumeData } from "@/lib/supabase-functions"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import ResumePreview from "@/components/resume-preview"
import type { ResumeData, ResumeTemplate } from "@/types/resume"
import { CREATE_RESUME } from "@/config/urls"
import { loadUserResumes } from "@/services/resumeService"
import { useAuth } from "@/contexts/auth-context"
import { LS_KEYS, setLocalStorageJSON, setLocalStorageItem } from "@/utils/localstorage"

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
  const { toast } = useToast()
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


  useEffect(() => {
    if (loading) return
    // Always load local resumes when page becomes interactive
    setLocalResumes(getLocalResumes())
    // Load cloud resumes once per mount when user present
    if (user && !hasLoadedResumes) {
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
        toast({
          title: "Error",
          description: "Failed to load resume data.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading resume data:", error)
      toast({
        title: "Error",
        description: "Failed to load resume data.",
        variant: "destructive",
      })
    }
  }

  const handleEditResume = (resumeId: string) => {
    router.push(`${CREATE_RESUME}?id=${resumeId}`)
  }

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      return
    }

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
        toast({
          title: "Success",
          description: "Resume deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete resume.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting resume:", error)
      toast({
        title: "Error",
        description: "Failed to delete resume.",
        variant: "destructive",
      })
    } finally {
      setDeletingResume(null)
    }
  }

  const handleCreateNew = () => {
    router.push(CREATE_RESUME)
  }

  const handleSyncLocalToCloud = async () => {
    if (!user) return
    if (resumes.length >= 3) {
      toast({ title: "Cloud Full", description: "You already have 3 resumes in cloud. Delete one to sync." })
      return
    }
    if (localResumes.length === 0) {
      toast({ title: "No Local Resumes", description: "Nothing to sync." })
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
      toast({ title: "Sync Complete", description: "Selected local resumes were synced to cloud." })
      await loadUserResumes({loadingResumes,setResumes,setHasLoadedResumes,setLoadingResumes})
    } catch (err) {
      console.error(err)
      toast({ title: "Sync Failed", description: "Some items could not be synced.", variant: "destructive" })
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
    router.push(CREATE_RESUME)
  }

  const handleDeleteLocalResume = (id: string) => {
    if (confirm('Are you sure you want to delete this local resume? This action cannot be undone.')) {
      removeLocalResume(id)
      setLocalResumes(getLocalResumes())
      toast({
        title: 'Local Resume Deleted',
        description: 'The resume has been removed from your local storage.',
      })
    }
  }

  const handleViewLocalResume = (localResume: LocalResumeItem) => {
    // For now, just show the data in a modal or redirect to view mode
    // You could implement a read-only view modal here
    toast({
      title: 'View Local Resume',
      description: 'Use the Edit button to open this resume in the builder.',
    })
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
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="text-lg">
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/settings")}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Resume List */}
          <div className="lg:col-span-2">
               <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Your Resumes</CardTitle>
                    <CardDescription>
                      {resumes.length} of 3 resumes created
                    </CardDescription>
                  </div>
                  <Button onClick={handleCreateNew} disabled={resumes.length >= 3}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loadingResumes ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                                ) : resumes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No cloud resumes yet</h3>
                    <p className="text-gray-600 mb-4">Create your first resume to get started</p>
                    <Button onClick={handleCreateNew}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Resume
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resumes.map((resume) => (
                      <Card key={resume.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <FileText className="w-8 h-8 text-blue-600" />
                              <div>
                                <h3 className="font-medium text-gray-900">{resume.title}</h3>
                                <p className="text-sm text-gray-600">
                                  Updated {formatDate(resume.updated_at)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleResumeClick(resume)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditResume(resume.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteResume(resume.id)}
                                disabled={deletingResume === resume.id}
                                className="text-red-600 hover:text-red-700"
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

                {/* Local resumes list - always show regardless of cloud resumes */}
                <Card className="mt-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span>Local Resumes</span>
                          <Badge variant="secondary">{localResumes.length}</Badge>
                        </CardTitle>
                        <CardDescription>These are saved in your browser. You can sync up to 3 to your account.</CardDescription>
                      </div>
                      <Button size="sm" onClick={handleSyncLocalToCloud} disabled={!user || isSyncingLocal || resumes.length >= 3 || localResumes.length === 0}>
                        {isSyncingLocal ? "Syncing..." : "Sync to Cloud"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {localResumes.length === 0 ? (
                      <p className="text-muted-foreground">No local resumes found.</p>
                    ) : (
                      <div className="space-y-3">
                        {localResumes.map((localResume) => (
                          <div key={localResume.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium">{localResume.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Last updated: {new Date(localResume.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewLocalResume(localResume)}
                              >
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditLocalResume(localResume)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteLocalResume(localResume.id)}
                              >
                                Delete
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

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            {showPreview && selectedResume && resumeData && (
              <Card className="sticky top-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Preview</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPreview(false)}
                    >
                      <EyeOff className="w-4 h-4" />
                    </Button>
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
      </div>
    </div>
  )
}
 