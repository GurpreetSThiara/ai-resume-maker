import { NextRequest, NextResponse } from 'next/server'
import { sendOpenRouterMessage } from '@/lib/openrouter'
import { createServerAnonClient } from '@/lib/supabase/server'
import { hasBudgetRemaining, recordUsage } from '@/lib/ai-usage'
import { MESSAGES } from '@/constants/messages'

export async function POST(req: NextRequest) {
  try {
    const { messages, model, siteUrl, siteTitle } = await req.json()

    // This route authenticates by bearer token rather than cookie, because the
    // client calls it directly with the session token it already holds.
    const supabase = createServerAnonClient()
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7) : undefined

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser(token)

    if (userErr || !user) {
      return NextResponse.json({ error: MESSAGES.AUTH_UNAUTHORIZED }, { status: 401 })
    }

    if (!(await hasBudgetRemaining(user.id))) {
      return NextResponse.json({ error: MESSAGES.AI_CREDITS_EXHAUSTED }, { status: 402 })
    }

    const result = await sendOpenRouterMessage({ messages, model, siteUrl, siteTitle })

    await recordUsage(user.id)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('OpenRouter API error:', error)
    return NextResponse.json(
      { error: error?.message || MESSAGES.AI_SERVICE_FAILED },
      { status: 500 },
    )
  }
}
