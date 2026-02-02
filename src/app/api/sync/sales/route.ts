import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST() {
    return NextResponse.json({
        message: "Sales data sync via Python script is not supported on Cloudflare Edge Runtime. Please run sync locally."
    }, { status: 501 });
}
