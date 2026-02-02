import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import yahooFinance from 'yahoo-finance2';

export async function GET() {
    try {
        const companies = await (prisma as any).company.findMany({
            where: {
                stockSymbol: { not: null }
            }
        });

        const results = await Promise.all(companies.map(async (company: any) => {
            try {
                // 1. Fetch Basic Quote from Yahoo Finance
                let quote: any = null;
                try {
                    quote = await yahooFinance.quote(company.stockSymbol!);
                } catch (err) {
                    console.error(`Quote fetch failed for ${company.stockSymbol}:`, err);
                    quote = null;
                }

                if (!quote) return null;

                const marketCap = quote.marketCap || 0;
                const currency = quote.currency || 'USD';

                // 2. Fetch trailing 12 months sales volume from local DB
                const sales = await (prisma as any).salesRecord.findMany({
                    where: {
                        companyId: company.id,
                        modelId: null,
                        periodType: "MONTH"
                    },
                    orderBy: { date: 'desc' },
                    take: 12
                });

                const totalSalesVolume = sales.reduce((sum: number, s: any) => sum + s.volume, 0);

                if (totalSalesVolume === 0) return null;

                // 3. Fetch Deep Financials (Margins, R&D, etc.)
                let financialDetails: any = {
                    revenue: 0,
                    grossMargin: 0,
                    operatingMargin: 0,
                    ebitdaMargin: 0,
                    rdExpense: 0,
                    netIncome: 0,
                    cash: 0
                };

                try {
                    let summary: any = null;
                    try {
                        summary = await yahooFinance.quoteSummary(company.stockSymbol!, {
                            modules: ["financialData", "incomeStatementHistory"]
                        });
                    } catch (e) {
                        summary = null;
                    }

                    if (summary) {
                        const fd = summary.financialData || {};
                        const isHistory = summary.incomeStatementHistory?.incomeStatementHistory || [];
                        const latestIS = isHistory[0] || {};

                        financialDetails = {
                            revenue: fd.totalRevenue || 0,
                            grossMargin: fd.grossMargins || 0,
                            operatingMargin: fd.operatingMargins || 0,
                            ebitdaMargin: fd.ebitdaMargins || 0,
                            rdExpense: latestIS.researchDevelopment || 0,
                            netIncome: latestIS.netIncome || 0,
                            cash: fd.totalCash || 0
                        };
                    }
                } catch (e) {
                    console.warn(`Could not fetch deep financials for ${company.name}`);
                }

                return {
                    id: company.id,
                    name: company.name,
                    symbol: company.stockSymbol,
                    marketCap,
                    currency,
                    annualSalesVolume: totalSalesVolume,
                    ...financialDetails,
                    psRatio: (financialDetails.revenue > 0) ? (marketCap / financialDetails.revenue) : null,
                    marketCapPerUnit: marketCap / totalSalesVolume,
                    // Derived metrics
                    revenuePerUnit: (financialDetails.revenue > 0) ? (financialDetails.revenue / totalSalesVolume) : 0,
                    grossProfitPerUnit: (financialDetails.revenue > 0 && financialDetails.grossMargin > 0)
                        ? (financialDetails.revenue * financialDetails.grossMargin / totalSalesVolume) : 0
                };
            } catch (error) {
                console.error(`Error processing ${company.name}:`, error);
                return null;
            }
        }));

        return NextResponse.json(results.filter(r => r !== null));
    } catch (error) {
        console.error("Valuation API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
