import { NextResponse } from "next/server";
export const runtime = 'edge';
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const periodType = searchParams.get("periodType") || "MONTH";

    if (!companyId) return NextResponse.json({ error: "缺少公司ID" }, { status: 400 });

    try {
        const stockPrices = await prisma.stockPrice.findMany({
            where: { companyId },
            orderBy: { date: "asc" },
        });

        const source = searchParams.get("source") || "GASGOO";

        const salesRecords = await prisma.salesRecord.findMany({
            where: {
                companyId,
                periodType,
                volume: { gt: 0 }, // 排除无效的零值数据
                source
            },
            orderBy: { date: "asc" },
        });

        if (stockPrices.length === 0) {
            return NextResponse.json({ error: "未找到数据" }, { status: 404 });
        }

        const baselinePrice = stockPrices[0]?.closePrice || 1;
        const firstSales = salesRecords[0];
        const baselineSales = firstSales ? firstSales.volume : 1;

        // Highcharts format: [timestamp, normalizedValue, rawValue]
        // We'll use the 'custom' property in Highcharts for extra data
        const stockSeries = stockPrices.map(p => ({
            x: p.date.getTime(),
            y: Number(((p.closePrice - baselinePrice) / baselinePrice * 100).toFixed(2)),
            rawValue: p.closePrice
        }));

        const salesSeries = salesRecords.map(s => ({
            x: s.date.getTime(),
            y: Number(((s.volume - baselineSales) / baselineSales * 100).toFixed(2)),
            rawValue: s.volume
        }));

        return NextResponse.json({
            stockSeries,
            salesSeries,
            raw: {
                baselinePrice,
                baselineSales
            }
        });
    } catch (error) {
        console.error("Failed to fetch chart data:", error);
        return NextResponse.json({ error: "服务器内部错误" }, { status: 500 });
    }
}
