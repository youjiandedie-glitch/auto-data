import prisma from "@/lib/prisma";

// This is still a generator but we make numbers more realistic based on 2024 data
export async function generateMockSales(companyId: string) {
    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) return 0;

    const records = [];
    const now = new Date();

    // Real 2024 Avg Monthly Volumes (Approximations)
    let baseMonthly = 30000;
    if (company.name.includes("比亚迪")) baseMonthly = 300000;
    if (company.name.includes("蔚来")) baseMonthly = 18000;
    if (company.name.includes("小鹏")) baseMonthly = 15000;
    if (company.name.includes("理想")) baseMonthly = 45000;
    if (company.name.includes("赛力斯")) baseMonthly = 35000;
    if (company.name.includes("小米")) baseMonthly = 20000;

    // Generate 24 months of data
    for (let i = 0; i < 24; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

        // Monthly (With some seasonality and random noise)
        const monthIndex = (now.getMonth() - i + 24) % 12;
        const seasonality = 1 + (monthIndex === 1 ? -0.2 : monthIndex === 11 ? 0.3 : 0); // Jan dip, Dec peak
        const growth = 1 - (i * 0.015); // Backwards regression
        const monthlyVolume = Math.floor(baseMonthly * (0.9 + Math.random() * 0.2) * seasonality * growth);

        records.push({
            companyId,
            date: new Date(date),
            volume: Math.max(0, monthlyVolume),
            periodType: "MONTH",
        });

        // Weekly
        for (let w = 0; w < 4; w++) {
            const weekDate = new Date(date);
            weekDate.setDate(weekDate.getDate() + w * 7);
            if (weekDate > now) continue;

            const weeklyVolume = Math.floor(monthlyVolume / 4 * (0.8 + Math.random() * 0.4));
            records.push({
                companyId,
                date: new Date(weekDate),
                volume: Math.max(0, weeklyVolume),
                periodType: "WEEK",
            });
        }
    }

    let count = 0;
    for (const record of records) {
        await prisma.salesRecord.upsert({
            where: {
                companyId_date_periodType: {
                    companyId: record.companyId,
                    date: record.date,
                    periodType: record.periodType,
                },
            },
            update: {
                volume: record.volume,
            },
            create: record,
        });
        count++;
    }

    return count;
}
