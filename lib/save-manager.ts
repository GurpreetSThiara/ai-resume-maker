"use client"

import type { ResumeData } from "@/types/resume"
import { LS_KEYS, setLocalStorageJSON, getLocalStorageJSON } from "@/utils/localstorage"

export interface SaveManager {
  saveSection: (sectionName: string, data: any) => Promise<void>
  saveAllData: (data: ResumeData) => Promise<void>
  syncToSupabase: (data: ResumeData) => Promise<void>
  loadData: (userId?: string) => Promise<ResumeData | null>
}

// Mock save functions for now
export const saveManager: SaveManager = {
  async saveSection(sectionName: string, data: any) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
   // console.log(`Saving section: ${sectionName}`, data)

    // Simulate occasional errors for testing
    if (Math.random() < 0.1) {
      throw new Error("Failed to save section")
    }
  },

  async saveAllData(data: ResumeData) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
   // console.log("Saving all resume data", data)

    // Store in localStorage for now (centralized util)
    setLocalStorageJSON(LS_KEYS.resumeData, data)

    // Simulate occasional errors for testing
    if (Math.random() < 0.05) {
      throw new Error("Failed to save resume data")
    }
  },

  async syncToSupabase(data: ResumeData) {
    // This will be implemented when Supabase is integrated
    await new Promise((resolve) => setTimeout(resolve, 2000))
   // console.log("Syncing to Supabase", data)
    throw new Error("Supabase integration not yet implemented")
  },

  async loadData(userId?: string) {
    // Load from localStorage for now (centralized util)
    const saved = getLocalStorageJSON<ResumeData>(LS_KEYS.resumeData, null)
    return saved
  },
}
