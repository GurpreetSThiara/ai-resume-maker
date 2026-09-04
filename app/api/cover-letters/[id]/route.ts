import { NextResponse } from 'next/server'
import { requireUser } from '@/lib/api/auth'
import { MESSAGES } from '@/constants/messages'

const TABLE = 'cover_letters'

/** Next 16 hands route params to the handler as a Promise. */
type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: RouteContext) {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  const { id } = await params

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    if (!data) {
      return NextResponse.json({ error: MESSAGES.COVER_LETTER_NOT_FOUND }, { status: 404 })
    }
    if (data.user_id !== user.id) {
      return NextResponse.json({ error: MESSAGES.FORBIDDEN }, { status: 403 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching cover letter:', error)
    return NextResponse.json({ error: MESSAGES.COVER_LETTER_FETCH_ONE_FAILED }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  const { id } = await params

  try {
    const body = await request.json()

    const { data: existing, error: fetchError } = await supabase
      .from(TABLE)
      .select('user_id')
      .eq('id', id)
      .maybeSingle()

    if (fetchError) throw fetchError
    if (!existing) {
      return NextResponse.json({ error: MESSAGES.COVER_LETTER_NOT_FOUND }, { status: 404 })
    }
    if (existing.user_id !== user.id) {
      return NextResponse.json({ error: MESSAGES.FORBIDDEN }, { status: 403 })
    }

    const { data, error } = await supabase
      .from(TABLE)
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating cover letter:', error)
    return NextResponse.json({ error: MESSAGES.COVER_LETTER_UPDATE_FAILED }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { supabase, user, response } = await requireUser()
  if (response) return response

  const { id } = await params

  try {
    const { data: existing, error: fetchError } = await supabase
      .from(TABLE)
      .select('user_id')
      .eq('id', id)
      .maybeSingle()

    if (fetchError) throw fetchError
    if (!existing) {
      return NextResponse.json({ error: MESSAGES.COVER_LETTER_NOT_FOUND }, { status: 404 })
    }
    if (existing.user_id !== user.id) {
      return NextResponse.json({ error: MESSAGES.FORBIDDEN }, { status: 403 })
    }

    const { error } = await supabase.from(TABLE).delete().eq('id', id)

    if (error) throw error

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting cover letter:', error)
    return NextResponse.json({ error: MESSAGES.COVER_LETTER_DELETE_FAILED }, { status: 500 })
  }
}
