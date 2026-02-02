import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET() {
    return NextResponse.json({
        message: "Valuation API requires Node.js runtime (Yahoo Finance) and is not supported on Cloudflare Edge. Please deploy to a Node.js environment or run locally."
    }, { status: 501 });
}
