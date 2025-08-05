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
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import ResumePreview from "@/components/resume-preview"
import type { ResumeData, ResumeTemplate } from "@/types/resume"

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
  
  const [resumes, setResumes] = useState<ResumeItem[]>([])
  const [loadingResumes, setLoadingResumes] = useState(true)
  const [selectedResume, setSelectedResume] = useState<ResumeItem | null>(null)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [deletingResume, setDeletingResume] = useState<string | null>(null)
  const [hasLoadedResumes, setHasLoadedResumes] = useState(false)

  // Debounce function to prevent duplicate API calls
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const debounce = (func: Function, delay: number) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(func, delay)
  }

  useEffect(() => {
    if (!loading && user && !hasLoadedResumes) {
      debounce(() => {
        loadUserResumes()
      }, 300)
    }
    
    // Cleanup function to clear timeout on unmount
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [user, loading, hasLoadedResumes])

  const loadUserResumes = async () => {
    if (loadingResumes) return // Prevent duplicate calls
    
    setLoadingResumes(true)
    try {
      const result = await getUserResumes()
      if (result.success) {
        setResumes(result.data || [])
        setHasLoadedResumes(true)
      } else {
        toast({
          title: "Error",
          description: "Failed to load your resumes.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading resumes:", error)
      toast({
        title: "Error",
        description: "Failed to load your resumes.",
        variant: "destructive",
      })
    } finally {
      setLoadingResumes(false)
    }
  }

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
    router.push(`/create?id=${resumeId}`)
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
    router.push("/create")
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
      setResumeData(data)
    } else {
      setResumeData(data)
    }
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
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
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            {showPreview && selectedResume && resumeData ? (
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
                  <CardDescription>{selectedResume.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResumePreview 
                    resumeData={resumeData} 
                    template={defaultTemplate} 
                    onDataUpdate={handleResumeDataUpdate}
                    activeSection=""
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Resumes</span>
                    <Badge variant="secondary">{resumes.length}/3</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Account Status</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Member Since</span>
                    <span className="text-sm text-gray-900">
                      {user.created_at ? formatDate(user.created_at) : "N/A"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 