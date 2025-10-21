"use client"

import React from 'react'
import { SectionReorderModal } from '@/components/section-reorder-modal'
import { Settings } from 'lucide-react'

interface SectionManagementProps {
  sections: any[]
  onReorder: (sections: any[]) => void
  className?: string
}

export const SectionManagement: React.FC<SectionManagementProps> = ({
  sections,
  onReorder,
  className = ""
}) => {
  return (
    <div className={``}>
      <div className="flex items-center justify-between p-4">
    
        
        <SectionReorderModal
          sections={sections}
          onReorder={onReorder}
        />
      </div>
    </div>
  )
}
