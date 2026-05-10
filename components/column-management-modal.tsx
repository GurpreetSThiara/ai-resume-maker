"use client"

import React, { useState, useEffect } from 'react'
import { Section } from '@/types/resume'
import { getSectionTypeDisplayName, getSectionTypeIcon } from '@/utils/sectionOrdering'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Columns } from 'lucide-react'

interface ColumnManagementModalProps {
  sections: Section[]
  onUpdate: (sections: Section[]) => void
}

export const ColumnManagementModal: React.FC<ColumnManagementModalProps> = ({
  sections,
  onUpdate,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [localSections, setLocalSections] = useState<Section[]>(sections)

  useEffect(() => {
    setLocalSections(sections)
  }, [sections])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="hover:bg-gray-50 flex items-center gap-2">
          <Columns className="w-4 h-4" />
          Layout Settings
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Columns className="w-5 h-5" />
            Column Layout Management
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto mt-4">
          <div className="space-y-2 pr-2">
            {localSections.map((section, index) => (
              <div
                key={section.id}
                className={`
                  flex items-center gap-3 p-4 border rounded-lg transition-all duration-200 hover:bg-gray-50
                `}
              >
                {/* Section Icon */}
                <div className="flex-shrink-0 text-lg w-8 flex justify-center">
                  {getSectionTypeIcon(section.type)}
                </div>
                
                {/* Section Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {section.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getSectionTypeDisplayName(section.type)}
                  </div>
                </div>
                
                {/* Column Selection */}
                <div className="flex items-center gap-3 mr-2">
                  <span className="text-sm font-medium text-gray-600">Placement</span>
                  <Select
                    value={(section.column || (['skills', 'languages'].includes(section.type) ? 1 : 2)).toString()}
                    onValueChange={(val) => {
                      setLocalSections(prev => {
                        const next = prev.map((s, i) => i === index ? { ...s, column: parseInt(val) as 1 | 2 } : s)
                        onUpdate(next)
                        return next
                      })
                    }}
                  >
                    <SelectTrigger className="h-9 w-28 text-sm bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Left Sidebar</SelectItem>
                      <SelectItem value="2">Main Body</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center py-4 border-t mt-4">
          Assign sections to the Left (Sidebar) or Right (Main Body) column to customize your layout.
        </div>
      </DialogContent>
    </Dialog>
  )
}
