import { getUserResumes } from "@/lib/supabase-functions"



 export const loadUserResumes = async ({loadingResumes,setResumes,setHasLoadedResumes,setLoadingResumes}) => {
    
    setLoadingResumes(true)
    try {
      const result = await getUserResumes()
      if (result.success) {
        setResumes(result.data || [])
        setHasLoadedResumes(true)
      } else {
    
      }
    } catch (error) {
  
    } finally {
      setLoadingResumes(false)
    }
  }