import { NextResponse } from "next/server";
export const runtime = 'edge';
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const yearStr = searchParams.get("year") || "2025";
    const year = parseInt(yearStr);

    try {
        const companies = await (prisma as any).company.findMany({
            include: {
                salesRecords: {
                    where: {
                        modelId: null,
                        periodType: "MONTH"
                    },
                    orderBy: { date: 'asc' }
                }
            }
        });

        // Fetch policies for the requested year and the year before for context
        const policies = await (prisma as any).policy.findMany({
            where: {
                date: {
                    gte: new Date(`${year - 1}-01-01`),
                    lte: new Date(`${year}-12-31`)
                }
            },
            orderBy: { date: 'asc' }
        });

        const results = companies.map((company: any) => {
            const growthData = Array(12).fill(null);

            for (let month = 1; month <= 12; month++) {
                const currentMonthDate = new Date(year, month - 1, 1);
                const lastYearDate = new Date(year - 1, month - 1, 1);

                const currentMonthSales = company.salesRecords.find((r: any) =>
                    r.date.getFullYear() === currentMonthDate.getFullYear() &&
                    r.date.getMonth() === currentMonthDate.getMonth()
                );

                const lastYearSales = company.salesRecords.find((r: any) =>
                    r.date.getFullYear() === lastYearDate.getFullYear() &&
                    r.date.getMonth() === lastYearDate.getMonth()
                );

                if (currentMonthSales && lastYearSales && lastYearSales.volume > 0) {
                    const yoy = ((currentMonthSales.volume - lastYearSales.volume) / lastYearSales.volume) * 100;
                    growthData[month - 1] = parseFloat(yoy.toFixed(1));
                }
            }

            return {
                id: company.id,
                name: company.name,
                data: growthData
            };
        });

        return NextResponse.json({
            growth: results.filter((r: any) => r.data.some((d: any) => d !== null)),
            policies: policies.map((p: any) => ({
                title: p.title,
                date: p.date.toISOString().substring(0, 10),
                month: p.date.getMonth() + 1,
                year: p.date.getFullYear(),
                impact: p.impactLevel
            }))
        });
    } catch (error) {
        console.error("Growth API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
