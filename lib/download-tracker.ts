import { ObjectId } from "mongodb"
import { getMongoDb } from "./mongo"

export interface DownloadRecord {
  _id?: string
  timestamp: Date
  userAgent?: string
  ipAddress?: string
  resumeId?: string
  template?: string
  format: 'pdf' | 'docx'
}

export interface DownloadStats {
  totalDownloads: number

}

// Track a resume download
export async function trackResumeDownload(
  format: 'pdf' | 'docx',
  resumeId?: string,
  template?: string,
  userAgent?: string,
  ipAddress?: string
): Promise<void> {
  try {
    const db = await getMongoDb()
    const downloadsCollection = db.collection<DownloadRecord>('resume_count')

 

    await downloadsCollection.updateOne(
        { _id: new ObjectId("68fcca568ea67f8dc0ba7a27") },
        { $inc: { count: 1 } }
      );

  } catch (error) {
    console.error('Error tracking download:', error)
    // Don't throw error to avoid breaking the download flow
  }
}

// Get download statistics
export async function getDownloadStats(): Promise<DownloadStats> {
  try {
    const db = await getMongoDb()
    const downloadsCollection = db.collection<DownloadRecord>('resume_count')
    const doc = await downloadsCollection.findOne({ _id: new ObjectId("68fcca568ea67f8dc0ba7a27") });
    let totalDownloads = 0
    if (doc) {
        totalDownloads= doc.count ?? 0
    } 

    return {
      totalDownloads,
  
    }
  } catch (error) {
    console.error('Error getting download stats:', error)
    // Return fallback stats
    return {
      totalDownloads: 50000, // Fallback to current hardcoded value
      downloadsToday: 0,
      downloadsThisMonth: 0,
      downloadsThisYear: 0,
    }
  }
}

// Format download count for display
export function formatDownloadCount(count: number): string {
  if (count >= 1000000) {
    return `${Math.floor(count / 1000000)}M+`
  } else if (count >= 1000) {
    return `${Math.floor(count / 1000)}K+`
  } else {
    return `${count}+`
  }
}
