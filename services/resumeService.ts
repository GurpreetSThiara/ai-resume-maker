import { useToast } from "@/hooks/use-toast"
import { getUserResumes } from "@/lib/supabase-functions"

 export const loadUserResumes = async ({loadingResumes,setResumes,setHasLoadedResumes,setLoadingResumes}) => {
    const { toast } = useToast()
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