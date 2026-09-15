import { ObjectId } from "mongodb"
import { getMongoDb } from "./mongo"
import type { DownloadCounter, DownloadStats } from "@/types/download"
import { DOWNLOAD_COUNT_FALLBACK } from "@/config/resumeConfig"

export type { DownloadStats }

const COUNTER_COLLECTION = 'resume_count'

/** The one counter document every download increments. */
const COUNTER_ID = new ObjectId("68fcca568ea67f8dc0ba7a27")

/**
 * Increment the global download counter.
 *
 * NOTE: the detail arguments below are accepted but not persisted — this
 * collection holds a single counter, not per-download rows. Callers pass them
 * because the signature promises it. Recording them needs a separate
 * collection; until then they are deliberately unused rather than silently
 * half-written.
 */
export async function trackResumeDownload(
  _format: 'pdf' | 'docx',
  _resumeId?: string,
  _template?: string,
  _userAgent?: string,
  _ipAddress?: string
): Promise<void> {
  try {
    const db = await getMongoDb()
    const counters = db.collection<DownloadCounter>(COUNTER_COLLECTION)

    await counters.updateOne({ _id: COUNTER_ID }, { $inc: { count: 1 } }, { upsert: true })

  } catch (error) {
    console.error('Error tracking download:', error)
    // Don't throw error to avoid breaking the download flow
  }
}

// Get download statistics
export async function getDownloadStats(): Promise<DownloadStats> {
  try {
    const db = await getMongoDb()
    const counters = db.collection<DownloadCounter>(COUNTER_COLLECTION)
    const doc = await counters.findOne({ _id: COUNTER_ID })

    return { totalDownloads: doc?.count ?? 0 }
  } catch (error) {
    console.error('Error getting download stats:', error)
    // Return fallback stats
    // Deliberate fallback so the marketing counter still renders if Mongo is
    // unreachable. Reflects the figure the page showed before it was live.
    return { totalDownloads: DOWNLOAD_COUNT_FALLBACK }
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
