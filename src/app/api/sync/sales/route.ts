import { NextResponse } from "next/server";
import { syncSalesWithAkShare } from "@/services/salesService";

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const source = body.source || "GASGOO";
        const count = await syncSalesWithAkShare(source, 12);
        return NextResponse.json({
            success: true,
            message: `成功同步 ${count} 条销量数据`
        });
    } catch (error: any) {
        console.error("Sales sync failed:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
