"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface FileUploadProps {
  onFileUpload: (file: File) => void
  isLoading: boolean
}

export function ResumeFileUpload({ onFileUpload, isLoading }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      onFileUpload(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        disabled={isLoading}
        className="hidden"
      />
      <Button onClick={handleClick} disabled={isLoading} className="w-full">
        <Upload className="w-4 h-4 mr-2" />
        {isLoading ? "Processing..." : "Upload PDF"}
      </Button>
    </div>
  )
}
