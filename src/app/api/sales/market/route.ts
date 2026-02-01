import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source") || "GASGOO";

    try {
        // 1. Get distinct months
        const months = await (prisma as any).salesRecord.findMany({
            where: {
                modelId: null,
                periodType: "MONTH",
                source: source
            },
            select: { date: true },
            distinct: ['date'],
            orderBy: { date: 'desc' },
            take: 12
        });

        const concentrationTrend = await Promise.all(months.reverse().map(async (m: any) => {
            const date = m.date;
            const records = await (prisma as any).salesRecord.findMany({
                where: {
                    date: date,
                    modelId: null,
                    periodType: "MONTH",
                    source: source
                },
                include: { company: true },
                orderBy: { volume: 'desc' }
            });

            const totalVolume = records.reduce((sum: number, r: any) => sum + r.volume, 0);
            if (totalVolume === 0) return null;

            // Sort by share
            const shares = records.map((r: any) => ({
                id: r.companyId,
                name: r.company.name,
                volume: r.volume,
                share: (r.volume / totalVolume) * 100
            }));

            // HHI = Sum of squared market shares
            const hhi = shares.reduce((sum: number, s: any) => sum + (s.share * s.share), 0);

            // CR3, CR5
            const cr3 = shares.slice(0, 3).reduce((sum: number, s: any) => sum + s.share, 0);
            const cr5 = shares.slice(0, 5).reduce((sum: number, s: any) => sum + s.share, 0);

            return {
                date: date.toISOString().substring(0, 7), // YYYY-MM
                hhi,
                cr3,
                cr5,
                topPlayers: shares.slice(0, 5),
                totalVolume
            };
        }));

        return NextResponse.json(concentrationTrend.filter(t => t !== null));
    } catch (error) {
        console.error("Market API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
