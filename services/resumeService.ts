import type { Dispatch, SetStateAction } from "react"
import { getUserResumes } from "@/lib/supabase-functions"



/**
 * Generic over the caller's row type so a React setState dispatcher can be
 * passed straight in — a `(rows: unknown[]) => void` signature is not
 * assignable from `Dispatch<SetStateAction<T[]>>`.
 */
interface LoadUserResumesArgs<TResume> {
  loadingResumes: boolean
  setResumes: Dispatch<SetStateAction<TResume[]>>
  setHasLoadedResumes: Dispatch<SetStateAction<boolean>>
  setLoadingResumes: Dispatch<SetStateAction<boolean>>
}

export const loadUserResumes = async <TResume,>({
  loadingResumes,
  setResumes,
  setHasLoadedResumes,
  setLoadingResumes,
}: LoadUserResumesArgs<TResume>) => {
    
    setLoadingResumes(true)
    try {
      const result = await getUserResumes()
      if (result.success) {
        setResumes((result.data || []) as TResume[])
        setHasLoadedResumes(true)
      } else {
    
      }
    } catch (error) {
  
    } finally {
      setLoadingResumes(false)
    }
  }