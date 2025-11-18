"use client"

import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface SectionVisibilityToggleProps {
  isHidden: boolean
  onToggle: () => void
}

export function SectionVisibilityToggle({ isHidden, onToggle }: SectionVisibilityToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
      <span className="text-xs font-medium text-gray-600">{isHidden ? 'Hidden' : 'Visible'}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        title={isHidden ? 'Click to show in resume' : 'Click to hide from resume'}
        className="h-8 w-8 p-0"
      >
        {isHidden ? (
          <EyeOff className="w-4 h-4 text-gray-400" />
        ) : (
          <Eye className="w-4 h-4 text-blue-500" />
        )}
      </Button>
    </div>
  )
}
