import { getMongoDb, getCollection } from '@/lib/mongo'
import { DEFAULT_MONTH_USD_LIMIT, DEFAULT_REQUEST_USD_COST } from '@/config/aiConfig'
import type { AiUsageDoc, AiUsageSummary } from '@/types/ai-usage'

const COLLECTION = 'ai_usage'

/** Current month as `YYYY-MM`, the second half of the usage document key. */
export function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7)
}

async function usageCollection() {
  const db = await getMongoDb()
  return getCollection<AiUsageDoc>(db, COLLECTION)
}

/** Read a caller's spend for this month, with defaults for a first-time user. */
export async function getUsage(userId: string): Promise<AiUsageSummary> {
  const col = await usageCollection()
  const month = currentMonthKey()
  const doc = await col.findOne({ userId, month })

  const monthUsdLimit = doc?.monthUsdLimit ?? DEFAULT_MONTH_USD_LIMIT
  const totalUsdUsedThisMonth = doc?.totalUsdUsedThisMonth ?? 0

  return {
    monthUsdLimit,
    totalUsdUsedThisMonth,
    requestsThisMonth: doc?.requestsThisMonth ?? 0,
    monthUsdRemaining: Math.max(0, monthUsdLimit - totalUsdUsedThisMonth),
  }
}

/**
 * Whether the caller may make another billed request this month.
 *
 * Previously inlined in app/api/openrouter/route.ts, which left
 * app/api/ai/parse — the other route that spends the OpenRouter key — with no
 * ceiling at all.
 */
export async function hasBudgetRemaining(userId: string): Promise<boolean> {
  const { totalUsdUsedThisMonth, monthUsdLimit } = await getUsage(userId)
  return totalUsdUsedThisMonth < monthUsdLimit
}

/** Charge a request against the caller's monthly budget. */
export async function recordUsage(
  userId: string,
  usdCost: number = DEFAULT_REQUEST_USD_COST,
): Promise<AiUsageSummary> {
  const col = await usageCollection()
  const month = currentMonthKey()
  const cost = Math.max(0, Number(usdCost) || 0)

  const doc = await col.findOneAndUpdate(
    { userId, month },
    {
      $setOnInsert: { userId, month, monthUsdLimit: DEFAULT_MONTH_USD_LIMIT },
      $inc: { totalUsdUsedThisMonth: cost, requestsThisMonth: 1 },
    },
    { upsert: true, returnDocument: 'after' },
  )

  const monthUsdLimit = doc?.monthUsdLimit ?? DEFAULT_MONTH_USD_LIMIT
  const totalUsdUsedThisMonth = doc?.totalUsdUsedThisMonth ?? cost

  return {
    monthUsdLimit,
    totalUsdUsedThisMonth,
    requestsThisMonth: doc?.requestsThisMonth ?? 1,
    monthUsdRemaining: Math.max(0, monthUsdLimit - totalUsdUsedThisMonth),
  }
}
