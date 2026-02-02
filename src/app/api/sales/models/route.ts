import { NextResponse } from "next/server";
export const runtime = 'edge';
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const date = searchParams.get("date"); // YYYYMM
    const source = searchParams.get("source") || "GASGOO";

    if (!companyId || !date) {
        return NextResponse.json({ error: "companyId and date are required" }, { status: 400 });
    }

    try {
        const year = parseInt(date.substring(0, 4));
        const month = parseInt(date.substring(4, 6)) - 1;
        const targetDate = new Date(year, month, 1);

        const models = await (prisma as any).carModel.findMany({
            where: { companyId: companyId },
            include: {
                salesRecords: {
                    where: {
                        date: targetDate,
                        source: source,
                        periodType: "MONTH"
                    }
                }
            }
        });

        const result = models.map((m: any) => ({
            id: m.id,
            name: m.name,
            volume: m.salesRecords[0]?.volume || 0
        })).sort((a: any, b: any) => b.volume - a.volume);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Models API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
