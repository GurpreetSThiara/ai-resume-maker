"use client"

import { useState, useCallback } from "react"

export interface SaveState {
  hasUnsavedChanges: boolean
  isSaving: boolean
  lastSaved: Date | null
  error: string | null
}

export function useSaveState() {
  const [saveState, setSaveState] = useState<SaveState>({
    hasUnsavedChanges: false,
    isSaving: false,
    lastSaved: null,
    error: null,
  })

  const markAsChanged = useCallback(() => {
    setSaveState((prev) => ({
      ...prev,
      hasUnsavedChanges: true,
      error: null,
    }))
  }, [])

  const startSaving = useCallback(() => {
    setSaveState((prev) => ({
      ...prev,
      isSaving: true,
      error: null,
    }))
  }, [])

  const saveSuccess = useCallback(() => {
    setSaveState({
      hasUnsavedChanges: false,
      isSaving: false,
      lastSaved: new Date(),
      error: null,
    })
  }, [])

  const saveError = useCallback((error: string) => {
    setSaveState((prev) => ({
      ...prev,
      isSaving: false,
      error,
    }))
  }, [])

  const resetSaveState = useCallback(() => {
    setSaveState({
      hasUnsavedChanges: false,
      isSaving: false,
      lastSaved: null,
      error: null,
    })
  }, [])

  return {
    saveState,
    markAsChanged,
    startSaving,
    saveSuccess,
    saveError,
    resetSaveState,
  }
}
