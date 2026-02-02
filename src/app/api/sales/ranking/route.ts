import { NextResponse } from "next/server";
export const runtime = 'edge';
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date"); // YYYYMM
    const type = searchParams.get("type") || "company"; // company or model
    const source = searchParams.get("source") || "GASGOO";

    if (!dateStr) {
        return NextResponse.json({ error: "Month is required (YYYYMM)" }, { status: 400 });
    }

    try {
        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(4, 6)) - 1;
        const targetDate = new Date(year, month, 1);

        if (type === "model") {
            const rankings = await (prisma as any).salesRecord.findMany({
                where: {
                    date: targetDate,
                    source: source,
                    periodType: "MONTH",
                    modelId: { not: null }
                },
                include: {
                    company: true,
                    model: true
                },
                orderBy: {
                    volume: "desc"
                },
                take: 50
            });

            return NextResponse.json(rankings.map((r: any) => ({
                id: r.id,
                name: r.model?.name || "未知车型",
                company: r.company.name,
                volume: r.volume,
                logoUrl: r.company.logoUrl
            })));
        } else {
            // Aggregate by company for the given month
            // Since some records might be model-specific and some company-specific (if source is CPCA/GASGOO mix)
            // We'll prioritize records where modelId is NULL for company rankings if they exist, 
            // or sum up model volumes.

            // For simplicity and consistency with current data pipeline:
            const companySales = await (prisma as any).salesRecord.findMany({
                where: {
                    date: targetDate,
                    source: source,
                    periodType: "MONTH",
                    modelId: null
                },
                include: {
                    company: true
                },
                orderBy: {
                    volume: "desc"
                },
                take: 30
            });

            return NextResponse.json(companySales.map((s: any) => ({
                id: s.companyId,
                name: s.company.name,
                volume: s.volume,
                logoUrl: s.company.logoUrl,
                market: s.company.market
            })));
        }
    } catch (error) {
        console.error("Ranking API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
