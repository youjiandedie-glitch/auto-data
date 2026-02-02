import { NextResponse } from "next/server";
export const runtime = 'edge';
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const companyIds = searchParams.get("ids")?.split(",") || [];
    const source = searchParams.get("source") || "GASGOO";
    const year = searchParams.get("year") || "2025";

    if (companyIds.length === 0) {
        return NextResponse.json({ error: "At least one company ID is required" }, { status: 400 });
    }

    try {
        const startDate = new Date(`${year}-01-01`);
        const endDate = new Date(`${year}-12-31`);

        const sales = await (prisma as any).salesRecord.findMany({
            where: {
                companyId: { in: companyIds },
                modelId: null, // Company-level sales
                source: source,
                periodType: "MONTH",
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                company: true
            },
            orderBy: {
                date: "asc"
            }
        });

        // Group by company and then by month
        const grouped: Record<string, any> = {};

        companyIds.forEach(id => {
            grouped[id] = {
                name: "",
                data: Array(12).fill(0)
            };
        });

        sales.forEach((s: any) => {
            const month = s.date.getMonth();
            if (grouped[s.companyId]) {
                grouped[s.companyId].name = s.company.name;
                grouped[s.companyId].data[month] = s.volume;
            }
        });

        return NextResponse.json(Object.values(grouped));
    } catch (error) {
        console.error("Comparison API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
