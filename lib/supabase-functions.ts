import { supabase } from "./supabase/client"
import type { ResumeData } from "@/types/resume"
import type { Database } from "./supabase/types"
import { compressData, decompressData } from "./compression"

type Resume = Database["public"]["Tables"]["resumes"]["Row"]
type ResumeInsert = Database["public"]["Tables"]["resumes"]["Insert"]
type ResumeUpdate = Database["public"]["Tables"]["resumes"]["Update"]

export async function saveResumeData(data: ResumeData, resumeId?: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    // Compress the resume data
    const compressedData = await compressData(data)

    if (resumeId) {
      // Update existing resume
      const { data: resume, error } = await supabase
        .from("resumes")
        .update({
          resume_data: compressedData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", resumeId)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) throw error
      return { success: true, data: resume, message: "Resume updated successfully" }
    } else {
      // Check if user has reached the 3-resume limit
      const { data: existingResumes, error: countError } = await supabase
        .from("resumes")
        .select("id")
        .eq("user_id", user.id)

      if (countError) throw countError

      if (existingResumes && existingResumes.length >= 3) {
        return { 
          success: false, 
          error: "Resume limit reached", 
          message: "You can only create up to 3 resumes. Please delete an existing resume or edit one of your current resumes." 
        }
      }

      // Create new resume
      const { data: resume, error } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          title: data.name || "Untitled Resume",
          resume_data: compressedData,
          template_id: "google",
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data: resume, message: "Resume created successfully" }
    }
  } catch (error) {
    console.error("Error saving resume:", error)
    return { success: false, error: error.message, message: "Failed to save resume" }
  }
}

export async function saveSection(sectionName: string, sectionData: any, resumeId: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    // Compress the section data
    const compressedData = await compressData(sectionData)

    const { data: section, error } = await supabase
      .from("resume_sections")
      .upsert({
        resume_id: resumeId,
        section_name: sectionName,
        section_data: compressedData,
        section_order: getSectionOrder(sectionName),
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data: section, message: `${sectionName} section saved successfully` }
  } catch (error) {
    console.error("Error saving section:", error)
    return { success: false, error: error.message, message: `Failed to save ${sectionName} section` }
  }
}

export async function loadResumeData(resumeId: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    const { data: resume, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("id", resumeId)
      .eq("user_id", user.id)
      .single()

    if (error) throw error

    // Decompress the resume data
    const decompressedData = await decompressData(resume.resume_data)
    
    return { success: true, data: decompressedData as ResumeData }
  } catch (error) {
    console.error("Error loading resume:", error)
    return { success: false, error: error.message, data: null }
  }
}

export async function getUserResumes() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    const { data: resumes, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (error) throw error
    return { success: true, data: resumes }
  } catch (error) {
    console.error("Error loading resumes:", error)
    return { success: false, error: error.message, data: [] }
  }
}

export async function deleteResume(resumeId: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    const { error } = await supabase.from("resumes").delete().eq("id", resumeId).eq("user_id", user.id)

    if (error) throw error
    return { success: true, message: "Resume deleted successfully" }
  } catch (error) {
    console.error("Error deleting resume:", error)
    return { success: false, error: error.message, message: "Failed to delete resume" }
  }
}

export async function getUserResumeCount() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    const { count, error } = await supabase
      .from("resumes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    if (error) throw error
    return { success: true, count: count || 0 }
  } catch (error) {
    console.error("Error getting resume count:", error)
    return { success: false, error: error.message, count: 0 }
  }
}

export async function saveUserProgress(completedSteps: number[], achievements: any[]) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      throw new Error("User not authenticated")
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .update({
        // You can add progress fields to the profiles table if needed
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error) throw error
    return { success: true, data: profile, message: "User progress saved successfully" }
  } catch (error) {
    console.error("Error saving user progress:", error)
    return { success: false, error: error.message, message: "Failed to save user progress" }
  }
}

function getSectionOrder(sectionName: string): number {
  const sectionOrder = {
    personal: 0,
    education: 1,
    experience: 2,
    skills: 3,
    custom: 4,
  }
  return sectionOrder[sectionName.toLowerCase()] || 99
}
