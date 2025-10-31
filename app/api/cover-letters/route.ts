import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { CoverLetter, CreateCoverLetterInput } from '@/types/cover-letter';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies: cookies() });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('cover_letters')
      .select('*')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching cover letters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cover letters' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies: cookies() });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check user's current cover letter count
    const { count, error: countError } = await supabase
      .from('cover_letters')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id);

    if (countError) throw countError;

    // For now, we'll assume a hard limit of 3 for all users.
    // In a real app, you'd check the user's subscription plan here.
    const SAVE_LIMIT = 3;
    if (count !== null && count >= SAVE_LIMIT) {
      return NextResponse.json(
        { error: 'You have reached the maximum number of saved cover letters.' },
        { status: 403 } // 403 Forbidden is appropriate for this kind of limit
      );
    }

    const body: CreateCoverLetterInput = await request.json();
    
    const { data, error } = await supabase
      .from('cover_letters')
      .insert({
        user_id: session.user.id,
        title: body.title,
        content: body.content,
        template_id: body.templateId,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating cover letter:', error);
    return NextResponse.json(
      { error: 'Failed to create cover letter' },
      { status: 500 }
    );
  }
}
