import YahooFinance from "yahoo-finance2";
import prisma from "@/lib/prisma";

const yf = new YahooFinance();

export async function syncStockPrices(companyId: string, symbol: string) {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - 2);

        const result = await yf.historical(symbol, {
            period1: startDate,
            period2: endDate,
            interval: "1d",
        });

        if (!result || result.length === 0) return 0;

        const priceData = result
            .filter((quote: any) => quote.close !== undefined)
            .map((quote: any) => ({
                companyId,
                date: new Date(quote.date),
                closePrice: quote.close as number,
            }));

        for (const data of priceData) {
            await prisma.stockPrice.upsert({
                where: {
                    companyId_date: {
                        companyId: data.companyId,
                        date: data.date,
                    },
                },
                update: {
                    closePrice: data.closePrice,
                },
                create: data,
            });
        }

        return priceData.length;
    } catch (error) {
        console.error(`Error syncing stocks for ${symbol}:`, error);
        throw error;
    }
}
