import { ResumeData } from "@/types/resume"

// New Local Resume Management System
// This file will be completely reimplemented with proper CRUD operations

export type LocalResumeItem = {
  id: string
  title: string
  data: ResumeData
  createdAt: string
  updatedAt: string
  version: number
}

// Storage key for local resumes
const LOCAL_RESUMES_KEY = "local_resumes_v2"

// Helper function to get all local resumes
function getAllLocalResumes(): LocalResumeItem[] {
  if (typeof window === "undefined") return []
  
  try {
    const stored = localStorage.getItem(LOCAL_RESUMES_KEY)
    if (!stored) return []
    
    const resumes = JSON.parse(stored)
    return Array.isArray(resumes) ? resumes : []
  } catch (error) {
    console.error("Error reading local resumes:", error)
    return []
  }
}

// Helper function to save all local resumes
function saveAllLocalResumes(resumes: LocalResumeItem[]): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(LOCAL_RESUMES_KEY, JSON.stringify(resumes))
  } catch (error) {
    console.error("Error saving local resumes:", error)
  }
}

// Generate unique ID for local resumes
function generateLocalResumeId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// CREATE: Create a new local resume
export function createLocalResume(data: ResumeData, title?: string): LocalResumeItem {
  const id = generateLocalResumeId()
  const now = new Date().toISOString()
  
  const newResume: LocalResumeItem = {
    id,
    title: title || data.basics?.name || "Untitled Resume",
    data,
    createdAt: now,
    updatedAt: now,
    version: 1
  }
  
  const allResumes = getAllLocalResumes()
  allResumes.unshift(newResume) // Add to beginning
  saveAllLocalResumes(allResumes)
  
  return newResume
}

// READ: Get all local resumes
export function getLocalResumes(): LocalResumeItem[] {
  return getAllLocalResumes()
}

// READ: Get a specific local resume by ID
export function getLocalResumeById(id: string): LocalResumeItem | null {
  const allResumes = getAllLocalResumes()
  return allResumes.find(resume => resume.id === id) || null
}

// UPDATE: Update an existing local resume
export function updateLocalResume(id: string, data: ResumeData, title?: string): LocalResumeItem | null {
  const allResumes = getAllLocalResumes()
  const index = allResumes.findIndex(resume => resume.id === id)
  
  if (index === -1) {
    console.error(`Local resume with ID ${id} not found`)
    return null
  }
  
  const existingResume = allResumes[index]
  const updatedResume: LocalResumeItem = {
    ...existingResume,
    data,
    title: title || existingResume.title,
    updatedAt: new Date().toISOString(),
    version: existingResume.version + 1
  }
  
  allResumes[index] = updatedResume
  saveAllLocalResumes(allResumes)
  
  return updatedResume
}

// DELETE: Delete a local resume
export function deleteLocalResume(id: string): boolean {
  const allResumes = getAllLocalResumes()
  const filteredResumes = allResumes.filter(resume => resume.id !== id)
  
  if (filteredResumes.length === allResumes.length) {
    console.error(`Local resume with ID ${id} not found`)
    return false
  }
  
  saveAllLocalResumes(filteredResumes)
  return true
}

// UTILITY: Get resume count
export function getLocalResumeCount(): number {
  return getAllLocalResumes().length
}

// UTILITY: Clear all local resumes
export function clearAllLocalResumes(): void {
  saveAllLocalResumes([])
}

// UTILITY: Export all local resumes (for backup)
export function exportLocalResumes(): string {
  return JSON.stringify(getAllLocalResumes(), null, 2)
}

// UTILITY: Import local resumes (for restore)
export function importLocalResumes(jsonData: string): boolean {
  try {
    const resumes = JSON.parse(jsonData)
    if (Array.isArray(resumes)) {
      saveAllLocalResumes(resumes)
      return true
    }
    return false
  } catch (error) {
    console.error("Error importing local resumes:", error)
    return false
  }
}

// UTILITY: Search local resumes by title or content
export function searchLocalResumes(query: string): LocalResumeItem[] {
  const allResumes = getAllLocalResumes()
  const lowercaseQuery = query.toLowerCase()
  
  return allResumes.filter(resume => 
    resume.title.toLowerCase().includes(lowercaseQuery) ||
    resume.data.basics?.name?.toLowerCase().includes(lowercaseQuery) ||
    resume.data.basics?.summary?.toLowerCase().includes(lowercaseQuery)
  )
}

// UTILITY: Get recent local resumes (last 10)
export function getRecentLocalResumes(limit: number = 10): LocalResumeItem[] {
  const allResumes = getAllLocalResumes()
  return allResumes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit)
}

// UTILITY: Duplicate a local resume
export function duplicateLocalResume(id: string): LocalResumeItem | null {
  const originalResume = getLocalResumeById(id)
  if (!originalResume) {
    console.error(`Local resume with ID ${id} not found`)
    return null
  }
  
  const duplicatedData = {
    ...originalResume.data,
    basics: {
      ...originalResume.data.basics,
      name: `${originalResume.data.basics.name} (Copy)`
    }
  }
  
  return createLocalResume(duplicatedData, `${originalResume.title} (Copy)`)
}

// UTILITY: Get storage usage info
export function getLocalResumeStorageInfo(): { count: number; totalSize: number; averageSize: number } {
  const allResumes = getAllLocalResumes()
  const totalSize = allResumes.reduce((total, resume) => {
    return total + JSON.stringify(resume).length
  }, 0)
  
  return {
    count: allResumes.length,
    totalSize,
    averageSize: allResumes.length > 0 ? Math.round(totalSize / allResumes.length) : 0
  }
}