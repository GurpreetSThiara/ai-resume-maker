import { NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase/server"
import { getMongoDb, getCollection } from "@/lib/mongo"

type TrackBody = {
  usdCost: number
}

type UsageDoc = {
  userId: string
  month: string
  monthUsdLimit: number
  totalUsdUsedThisMonth: number
  requestsThisMonth: number
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerComponentClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { usdCost } = (await req.json()) as TrackBody
    const cost = Math.max(0, Number(usdCost || 0))

    const db = await getMongoDb()
    const col = getCollection<UsageDoc>(db, "ai_usage")
    const monthKey = new Date().toISOString().slice(0, 7)

    const existing = await col.findOne({ userId: user.id, month: monthKey })
    const monthUsdLimit = existing?.monthUsdLimit ?? 2

    const update = await col.findOneAndUpdate(
      { userId: user.id, month: monthKey },
      {
        $setOnInsert: { userId: user.id, month: monthKey, monthUsdLimit },
        $inc: { totalUsdUsedThisMonth: cost, requestsThisMonth: 1 },
      },
      { upsert: true, returnDocument: "after" }
    )

    return NextResponse.json({ success: true, usage: update?.value })
  } catch (err: any) {
    console.error("POST /api/ai/track error", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}


