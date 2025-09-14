import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    // Redirect to the correct webhook endpoint
    const url = new URL('/api/webhooks', req.url);
    return NextResponse.redirect(url, 307);
}
