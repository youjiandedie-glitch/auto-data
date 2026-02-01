import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { syncStockPrices } from "@/services/stockService";
import { generateMockSales } from "@/services/salesService";

export async function POST(request: Request) {
    try {
        let companyId = null;
        try {
            const body = await request.json();
            companyId = body.companyId;
        } catch (e) { }

        if (companyId) {
            const company = await prisma.company.findUnique({ where: { id: companyId } });
            if (!company) return NextResponse.json({ error: "公司不存在" }, { status: 404 });

            const stockCount = await syncStockPrices(company.id, company.stockSymbol);
            const salesCount = await generateMockSales(company.id);

            return NextResponse.json({ success: true, stockCount, salesCount });
        } else {
            const companies = await prisma.company.findMany();
            const results = [];
            for (const company of companies) {
                try {
                    // Add a small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));

                    const stockCount = await syncStockPrices(company.id, company.stockSymbol);
                    const salesCount = await generateMockSales(company.id);
                    results.push({ name: company.name, stockCount, salesCount });
                } catch (err: any) {
                    console.error(`Failed to sync ${company.name}:`, err.message);
                    results.push({ name: company.name, error: err.message });
                }
            }
            return NextResponse.json({ success: true, results });
        }
    } catch (error) {
        console.error("Sync failed:", error);
        return NextResponse.json({ error: "同步失败" }, { status: 500 });
    }
}
