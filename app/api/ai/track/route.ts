import { NextRequest, NextResponse } from "next/server"
import { requireUser } from "@/lib/api/auth"
import { recordUsage } from "@/lib/ai-usage"

type TrackBody = { usdCost: number }

export async function POST(req: NextRequest) {
  const { user, response } = await requireUser()
  if (response) return response

  try {
    const { usdCost } = (await req.json()) as TrackBody
    const usage = await recordUsage(user.id, usdCost)
    return NextResponse.json({ success: true, usage })
  } catch (err) {
    console.error("POST /api/ai/track error", err)
    return NextResponse.json({ error: "Failed to record AI usage" }, { status: 500 })
  }
}
