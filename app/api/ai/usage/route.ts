import { NextResponse } from "next/server"
import { requireUser } from "@/lib/api/auth"
import { getUsage } from "@/lib/ai-usage"

export async function GET() {
  const { user, response } = await requireUser()
  // Anonymous callers get a null budget rather than a 401 — the client uses
  // this to decide whether to show the AI affordances at all.
  if (response) return NextResponse.json({ usage: null })

  try {
    return NextResponse.json({ usage: await getUsage(user.id) })
  } catch (err) {
    console.error("GET /api/ai/usage error", err)
    return NextResponse.json({ error: "Failed to read AI usage" }, { status: 500 })
  }
}
