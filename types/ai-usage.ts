/** One user's AI spend for one calendar month, keyed by `userId` + `month`. */
export interface AiUsageDoc {
  userId: string
  /** Calendar month as `YYYY-MM`. */
  month: string
  monthUsdLimit: number
  totalUsdUsedThisMonth: number
  requestsThisMonth: number
}

/** What a caller has left this month. */
export interface AiUsageSummary {
  monthUsdRemaining: number
  monthUsdLimit: number
  totalUsdUsedThisMonth: number
  requestsThisMonth: number
}
