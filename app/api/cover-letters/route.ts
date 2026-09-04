import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/api/auth'
import { COVER_LETTER_SAVE_LIMIT } from '@/config/coverLetterConfig'
import { MESSAGES } from '@/constants/messages'
import { createCoverLetterSchema } from '@/types/cover-letter'

const TABLE = 'cover_letters'

export async function GET() {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching cover letters:', error)
    return NextResponse.json({ error: MESSAGES.COVER_LETTER_FETCH_FAILED }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  try {
    const { count, error: countError } = await supabase
      .from(TABLE)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (countError) throw countError

    if (count !== null && count >= COVER_LETTER_SAVE_LIMIT) {
      return NextResponse.json({ error: MESSAGES.COVER_LETTER_LIMIT_REACHED }, { status: 403 })
    }

    const parsed = createCoverLetterSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: MESSAGES.VALIDATION_FAILED, issues: parsed.error.issues },
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        user_id: user.id,
        title: parsed.data.title,
        content: parsed.data.content,
        template_id: parsed.data.templateId,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating cover letter:', error)
    return NextResponse.json({ error: MESSAGES.COVER_LETTER_CREATE_FAILED }, { status: 500 })
  }
}
