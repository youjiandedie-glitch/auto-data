import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { syncStockPrices } from "@/services/stockService";
import { syncSalesWithAkShare } from "@/services/salesService";

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const source = body.source || "GASGOO";
        const companyId = body.companyId;

        // Sync Sales Globally (One fetch for all companies) (Always 24 months for robustness)
        // We do this first or in parallel
        let salesCount = 0;
        try {
            // Note: This syncs ALL companies found in the AkShare return.
            salesCount = await syncSalesWithAkShare(source, 24) as number;
        } catch (e) {
            console.error("Global sales sync failed", e);
        }

        if (companyId) {
            const company = await prisma.company.findUnique({ where: { id: companyId } });
            if (!company) return NextResponse.json({ error: "公司不存在" }, { status: 404 });

            const stockCount = await syncStockPrices(company.id, company.stockSymbol);
            return NextResponse.json({ success: true, stockCount, salesCount });
        } else {
            const companies = await prisma.company.findMany();
            const results = [];
            for (const company of companies) {
                try {
                    // Add a small delay to avoid rate limiting
                    await new Promise(resolve => setTimeout(resolve, 500));
                    const stockCount = await syncStockPrices(company.id, company.stockSymbol);
                    results.push({ name: company.name, stockCount, salesCount: "Synced Globally" });
                } catch (err: any) {
                    console.error(`Failed to sync ${company.name}:`, err.message);
                    results.push({ name: company.name, error: err.message });
                }
            }
            return NextResponse.json({ success: true, results, globalSalesCount: salesCount });
        }
    } catch (error) {
        console.error("Sync failed:", error);
        return NextResponse.json({ error: "同步失败" }, { status: 500 });
    }
}
