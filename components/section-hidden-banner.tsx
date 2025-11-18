"use client"

import { EyeOff } from "lucide-react"

export function SectionHiddenBanner() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
      <EyeOff className="w-5 h-5 text-yellow-600 shrink-0" />
      <div>
        <p className="text-sm font-medium text-yellow-800">Section Hidden</p>
        <p className="text-xs text-yellow-700">This section is hidden from your resume. Toggle the visibility to show it.</p>
      </div>
    </div>
  )
}
