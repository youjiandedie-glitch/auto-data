import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get("source") || "GASGOO";
    const modelIdsStr = searchParams.get("modelIds");

    try {
        let modelIds: string[] = [];
        if (modelIdsStr) {
            modelIds = modelIdsStr.split(",");
        } else {
            // Get top 10 models by peak volume
            const topModels: any[] = await (prisma as any).salesRecord.groupBy({
                by: ['modelId'],
                where: { modelId: { not: null }, source: source },
                _max: { volume: true },
                orderBy: { _max: { volume: 'desc' } },
                take: 10
            });
            modelIds = topModels.map((m: any) => m.modelId as string);
        }

        const lifecycleData = await Promise.all(modelIds.map(async (id) => {
            const model = await (prisma as any).carModel.findUnique({
                where: { id: id },
                include: { company: true }
            });

            if (!model) return null;

            const sales = await (prisma as any).salesRecord.findMany({
                where: {
                    modelId: id,
                    source: source,
                    periodType: "MONTH"
                },
                orderBy: { date: 'asc' }
            });

            if (sales.length === 0) return null;

            const firstSaleDate = sales[0].date;

            const series = sales.map((s: any) => {
                const diffMonths = (s.date.getFullYear() - firstSaleDate.getFullYear()) * 12 + (s.date.getMonth() - firstSaleDate.getMonth());
                return {
                    monthIndex: diffMonths,
                    volume: s.volume,
                    date: s.date.toISOString().substring(0, 7)
                };
            });

            return {
                id: model.id,
                name: model.name,
                company: model.company.name,
                launchDate: firstSaleDate.toISOString().substring(0, 7),
                series
            };
        }));

        return NextResponse.json(lifecycleData.filter(d => d !== null));
    } catch (error) {
        console.error("Lifecycle API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
