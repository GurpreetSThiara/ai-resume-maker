import type { ObjectId } from 'mongodb'

/**
 * The single counter document in the `resume_count` collection.
 *
 * The previous DownloadRecord type described a per-download row — timestamp,
 * userAgent, ipAddress, template — but no such row is ever written. All the
 * tracker does is $inc one counter, which is why every field of that type
 * mismatched at the call site.
 */
export interface DownloadCounter {
  _id: ObjectId
  count: number
}

export interface DownloadStats {
  totalDownloads: number
}
