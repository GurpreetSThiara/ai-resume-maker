"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Save, Check, AlertCircle, Loader2, CloudOff } from "lucide-react"
import type { SaveState } from "@/hooks/use-save-state"

interface SaveButtonProps {
  saveState: SaveState
  onSave: () => void
  onSyncToSupabase?: () => void
  disabled?: boolean
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "secondary"
}

export function SaveButton({
  saveState,
  onSave,
  onSyncToSupabase,
  disabled = false,
  size = "default",
  variant = "default",
}: SaveButtonProps) {
  const getSaveIcon = () => {
    if (saveState.isSaving) return <Loader2 className="w-4 h-4 animate-spin" />
    if (saveState.error) return <AlertCircle className="w-4 h-4" />
    if (!saveState.hasUnsavedChanges && saveState.lastSaved) return <Check className="w-4 h-4" />
    return <Save className="w-4 h-4" />
  }

  const getSaveText = () => {
    if (saveState.isSaving) return "Saving..."
    if (saveState.error) return "Retry Save"
    if (!saveState.hasUnsavedChanges && saveState.lastSaved) return "Saved"
    return "Save Changes"
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={onSave}
        disabled={disabled || saveState.isSaving || (!saveState.hasUnsavedChanges && !saveState.error)}
        size={size}
        variant={variant}
        className="flex items-center gap-2"
      >
        {getSaveIcon()}
        {getSaveText()}
      </Button>

      {onSyncToSupabase && (
        <Button
          onClick={onSyncToSupabase}
          disabled={true} // Disabled for now as requested
          size={size}
          variant="outline"
          className="flex items-center gap-2 bg-transparent"
        >
          <CloudOff className="w-4 h-4" />
          Sync to Cloud
        </Button>
      )}

      {saveState.hasUnsavedChanges && (
        <Badge variant="secondary" className="text-xs">
          Unsaved changes
        </Badge>
      )}

      {saveState.lastSaved && !saveState.hasUnsavedChanges && (
        <span className="text-xs text-muted-foreground">Last saved: {saveState.lastSaved.toLocaleTimeString()}</span>
      )}

      {saveState.error && (
        <Badge variant="destructive" className="text-xs">
          {saveState.error}
        </Badge>
      )}
    </div>
  )
}
