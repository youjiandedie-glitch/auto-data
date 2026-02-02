import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST() {
    return NextResponse.json({
        message: "Data sync is not supported on Cloudflare Edge Runtime. Please run sync locally."
    }, { status: 501 });
}
