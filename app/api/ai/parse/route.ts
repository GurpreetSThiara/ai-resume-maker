import { NextResponse } from "next/server"
import { openRouter } from "@/lib/openrouter"
import { requireUser } from "@/lib/api/auth"
import { hasBudgetRemaining, recordUsage } from "@/lib/ai-usage"
import { RESUME_PARSE_SYSTEM_PROMPT, AI_ERROR_CODES } from "@/constants/aiConstants"
import { AI_PARSE_MAX_BYTES } from "@/config/aiConfig"
import { MESSAGES } from "@/constants/messages"

export const dynamic = "force-dynamic"

const MAX_RETRIES = 3
const INITIAL_DELAY_MS = 1000

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function callAIWithRetry(text: string, systemPrompt: string, retries = 0): Promise<any> {
  try {
    const client = openRouter()
    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
    })

    const result = response.choices?.[0]?.message?.content?.trim()
    if (!result) throw new Error("No response from model")

    try {
      return JSON.parse(result)
    } catch {
      // Models sometimes wrap the object in prose despite the instruction not to.
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0])
        } catch (extractError) {
          console.error("Failed to extract JSON from response:", extractError)
        }
      }
      throw new Error("Invalid JSON response from AI service")
    }
  } catch (error: any) {
    if (error.status === 429 && retries < MAX_RETRIES) {
      const delay = INITIAL_DELAY_MS * Math.pow(2, retries)
      console.warn(`Rate limited. Retrying in ${delay}ms (attempt ${retries + 1}/${MAX_RETRIES})`)
      await sleep(delay)
      return callAIWithRetry(text, systemPrompt, retries + 1)
    }
    throw error
  }
}

export async function POST(request: Request) {
  // This route spends the server's OpenRouter key. It previously had no
  // identity check and no quota, so an anonymous caller could bill the
  // account indefinitely — see QA_AUDIT.md C3.
  const { user, response } = await requireUser()
  if (response) return response

  if (!(await hasBudgetRemaining(user.id))) {
    return NextResponse.json(
      { error: MESSAGES.AI_CREDITS_EXHAUSTED, code: AI_ERROR_CODES.CREDITS_EXHAUSTED },
      { status: 402 },
    )
  }

  try {
    const { text } = await request.json()
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: MESSAGES.AI_PARSE_MISSING_TEXT }, { status: 400 })
    }

    const textBytes = new TextEncoder().encode(text).length
    if (textBytes > AI_PARSE_MAX_BYTES) {
      const limitMb = (AI_PARSE_MAX_BYTES / 1024 / 1024).toFixed(0)
      const actualMb = (textBytes / 1024 / 1024).toFixed(2)
      return NextResponse.json(
        {
          error: `Resume file exceeds ${limitMb}MB limit. Current size: ${actualMb}MB`,
          code: AI_ERROR_CODES.TEXT_TOO_LARGE,
        },
        { status: 413 },
      )
    }

    try {
      const parsed = await callAIWithRetry(text, RESUME_PARSE_SYSTEM_PROMPT)
      await recordUsage(user.id)
      return NextResponse.json(parsed)
    } catch (error: any) {
      console.error("Error parsing resume:", error)

      if (error.status === 429) {
        return NextResponse.json(
          { error: MESSAGES.AI_RATE_LIMITED, code: AI_ERROR_CODES.RATE_LIMITED },
          { status: 429 },
        )
      }

      if (error.message?.includes("Invalid JSON response")) {
        return NextResponse.json(
          { error: MESSAGES.AI_INVALID_RESPONSE, code: AI_ERROR_CODES.INVALID_RESPONSE },
          { status: 422 },
        )
      }

      return NextResponse.json({ error: MESSAGES.AI_SERVICE_FAILED }, { status: 500 })
    }
  } catch (error) {
    console.error("Error parsing resume:", error)
    return NextResponse.json({ error: MESSAGES.AI_SERVICE_FAILED }, { status: 500 })
  }
}
