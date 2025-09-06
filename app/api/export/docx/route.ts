import { NextResponse } from 'next/server'

// Deprecated: client-side helpers handle downloads now.
export async function POST() {
  return new NextResponse('Export API deprecated. Use client download helpers.', { status: 410 })
}
