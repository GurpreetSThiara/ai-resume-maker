import { NextRequest, NextResponse } from 'next/server';
import { sendOpenRouterMessage } from '@/lib/openrouter';
import { createServerComponentClient } from '@/lib/supabase/server';
import { getMongoDb, getCollection } from '@/lib/mongo';

export async function POST(req: NextRequest) {
  try {
    const { messages, model, siteUrl, siteTitle } = await req.json();

    // Enforce auth and usage check using bearer token from client
    const supabase = createServerComponentClient();
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.toLowerCase().startsWith('bearer ') ? authHeader.slice(7) : undefined;
    // console.log('[OpenRouter] Incoming request', {
    //   hasAuthHeader: Boolean(authHeader),
    //   tokenPresent: Boolean(token),
    //   tokenPreview: token ? token.substring(0, 8) + '...' : null,
    //   siteUrl,
    //   model,
    // });
    const { data: { user }, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !user) {
      console.warn('[OpenRouter] Auth failed', { userErr: userErr?.message || userErr, userPresent: Boolean(user) });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await getMongoDb();
    const col = getCollection<any>(db, 'ai_usage');
    const monthKey = new Date().toISOString().slice(0, 7);
    const doc = await col.findOne({ userId: user.id, month: monthKey });
    const monthUsdLimit = doc?.monthUsdLimit ?? 2;
    const totalUsdUsedThisMonth = doc?.totalUsdUsedThisMonth ?? 0;
    if (totalUsdUsedThisMonth >= monthUsdLimit) {
     // console.log('[OpenRouter] Credits exhausted', { userId: user.id, totalUsdUsedThisMonth, monthUsdLimit });
      return NextResponse.json({ error: 'AI credits exhausted' }, { status: 402 });
    }

    const result = await sendOpenRouterMessage({ 
      messages, 
      model, 
      siteUrl, 
      siteTitle 
    });

    // Heuristic cost tracking: flat $0.02 per request unless provided otherwise
    await col.findOneAndUpdate(
      { userId: user.id, month: monthKey },
      { $setOnInsert: { userId: user.id, month: monthKey, monthUsdLimit }, $inc: { totalUsdUsedThisMonth: 0.02, requestsThisMonth: 1 } },
      { upsert: true }
    );

   // console.log('[OpenRouter] Success - usage updated', { userId: user.id });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('OpenRouter API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to communicate with AI service' }, 
      { status: 500 }
    );
  }
} 