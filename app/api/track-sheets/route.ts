import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // The exact data we want to send, parsed from the incoming request body
        const payload = {
            name: body.name || '',
            email: body.email || '',
            phone: body.phone || '',
            linkedin: body.linkedin || '',
            template: body.template || 'Unknown Template',
            isLoggedIn: body.isLoggedIn || false
        };

        const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_APP_SCRIPT_TRACKER_URL || process.env.GOOGLE_APP_SCRIPT_TRACKER_URL;

        if (!scriptUrl) {
            console.warn('Google App Script URL is not defined for download tracking.');
            return NextResponse.json({ success: false, error: 'Missing Script URL' }, { status: 500 });
        }

        // Send to Google Apps Script silently from the server side
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        // Using no-cors from client would usually swallow errors, 
        // the server-side fetch will let us appropriately observe it.
        if (response.ok || response.type === 'opaque') {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: 'Failed to contact Apps Script' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error in /api/track-sheets endpoint:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
