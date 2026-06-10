"use client"

import React from 'react'
import { SectionReorderModal } from '@/components/section-reorder-modal'
import { Settings } from 'lucide-react'

interface SectionManagementProps {
  sections: any[]
  onReorder: (sections: any[]) => void
  className?: string
  templateId?: string
}

export const SectionManagement: React.FC<SectionManagementProps> = ({
  sections,
  onReorder,
  className = "",
  templateId
}) => {
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
    
        
        <SectionReorderModal
          sections={sections}
          onReorder={onReorder}
          templateId={templateId}
        />
      </div>
    </div>
  )
}
