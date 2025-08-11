import { NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase/server"
import { getMongoDb, getCollection } from "@/lib/mongo"

type UsageDoc = {
  userId: string
  month: string // YYYY-MM
  monthUsdLimit: number
  totalUsdUsedThisMonth: number
  requestsThisMonth: number
}

export async function GET(_req: NextRequest) {
  try {
    const supabase = createServerComponentClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ usage: null })
    }

    const db = await getMongoDb()
    const col = getCollection<UsageDoc>(db, "ai_usage")
    const monthKey = new Date().toISOString().slice(0, 7)

    const doc =
      (await col.findOne({ userId: user.id, month: monthKey })) || {
        userId: user.id,
        month: monthKey,
        monthUsdLimit: 2,
        totalUsdUsedThisMonth: 0,
        requestsThisMonth: 0,
      }

    const remaining = Math.max(0, doc.monthUsdLimit - doc.totalUsdUsedThisMonth)

    return NextResponse.json({
      usage: {
        monthUsdRemaining: remaining,
        monthUsdLimit: doc.monthUsdLimit,
        totalUsdUsedThisMonth: doc.totalUsdUsedThisMonth,
        requestsThisMonth: doc.requestsThisMonth,
      },
    })
  } catch (err: any) {
    console.error("GET /api/ai/usage error", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}


