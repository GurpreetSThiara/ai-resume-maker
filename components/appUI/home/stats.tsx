"use client"

import { useState, useEffect } from "react"
import { getStats } from "@/app/constants/global"

// Format download count for display
function formatDownloadCount(count: number): string {
  if (count >= 1000000) {
    return `${Math.floor(count / 1000000)}M+`
  } else if (count >= 1000) {
    return `${Math.floor(count / 1000)}K+`
  } else {
    return `${count}+`
  }
}

const Stats: React.FC = () => {
  const [downloadCount, setDownloadCount] = useState("50K+") // Fallback value
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch real download count
    const fetchDownloadCount = async () => {
      try {
        const response = await fetch('/api/download-stats')
        if (response.ok) {
          const data = await response.json()
          setDownloadCount(formatDownloadCount(data.totalDownloads))
        }
      } catch (error) {
        console.error('Failed to fetch download stats:', error)
        // Keep fallback value
      } finally {
        setLoading(false)
      }
    }

    fetchDownloadCount()
  }, [])

  // Get stats and update dynamic values
  const stats = getStats().map(stat => 
    stat.dynamic && stat.label === "Resumes Created" 
      ? { ...stat, value: loading ? "..." : downloadCount }
      : stat
  )

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
      {stats.map((stat, index) => (
        <div key={index}>
          <div className={`text-3xl font-bold ${stat.color} ${loading && stat.dynamic ? 'animate-pulse' : ''}`}>
            {stat.value}
          </div>
          <div className="text-slate-500">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

export default Stats