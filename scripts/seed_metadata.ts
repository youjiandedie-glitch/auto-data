import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting Universal Data Enrichment Seeder...');

    // 1. Comprehensive Metadata Map
    const modelMetadata: Record<string, { category: string, energyType: string }> = {
        '秦PLUS': { category: 'Sedan', energyType: 'PHEV' },
        '宋PLUS': { category: 'SUV', energyType: 'PHEV' },
        '宋Pro': { category: 'SUV', energyType: 'PHEV' },
        '元PLUS': { category: 'SUV', energyType: 'BEV' },
        '元UP': { category: 'SUV', energyType: 'BEV' },
        '海鸥': { category: 'Sedan', energyType: 'BEV' },
        '海豚': { category: 'Sedan', energyType: 'BEV' },
        '海狮': { category: 'SUV', energyType: 'BEV' },
        'Model Y': { category: 'SUV', energyType: 'BEV' },
        'Model 3': { category: 'Sedan', energyType: 'BEV' },
        '问界M7': { category: 'SUV', energyType: 'EREV' },
        '问界M9': { category: 'SUV', energyType: 'EREV' },
        '理想L7': { category: 'SUV', energyType: 'EREV' },
        '理想L8': { category: 'SUV', energyType: 'EREV' },
        '理想L9': { category: 'SUV', energyType: 'EREV' },
        'ES8': { category: 'SUV', energyType: 'BEV' },
        'ES6': { category: 'SUV', energyType: 'BEV' },
        '小米SU7': { category: 'Sedan', energyType: 'BEV' },
        '极氪001': { category: 'Sedan', energyType: 'BEV' },
        '五菱宏光MINI': { category: 'Sedan', energyType: 'BEV' },
        '轩逸': { category: 'Sedan', energyType: 'ICE' },
        '朗逸': { category: 'Sedan', energyType: 'ICE' },
        '速腾': { category: 'Sedan', energyType: 'ICE' },
        '卡罗拉': { category: 'Sedan', energyType: 'ICE' },
        '瑞虎': { category: 'SUV', energyType: 'ICE' },
        '缤越': { category: 'SUV', energyType: 'ICE' },
        '长安CS75': { category: 'SUV', energyType: 'ICE' },
    };

    // 2. Scan and Inject
    const allModels = await prisma.carModel.findMany({ include: { company: true } });

    for (const model of allModels) {
        let category = 'SUV'; // Default fallback
        let energyType = 'BEV'; // Default fallback for modern fleet

        // Match metadata
        const metaMatch = Object.entries(modelMetadata).find(([key]) => model.name.includes(key));

        if (metaMatch) {
            category = metaMatch[1].category;
            energyType = metaMatch[1].energyType;
        } else {
            // Logic-based deduction for unlisted models
            if (model.name.toLowerCase().includes('ev')) energyType = 'BEV';
            if (model.name.toLowerCase().includes('dm') || model.name.includes('phev')) energyType = 'PHEV';
            if (model.company.name.includes('蔚来') || model.company.name.includes('小米')) energyType = 'BEV';
        }

        await prisma.carModel.update({
            where: { id: model.id },
            data: { category, energyType }
        });

        console.log(`[META] Synced: ${model.name} (${energyType})`);

        // 3. Generate 12-Month Price Fingerprint
        // More robust history generation to avoid "empty" feel
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

            // Base behavior: Pricing pressure increases in 2024-2025
            let baseDiscount = 0.08 + (i * 0.005); // Trends deeper back in time for this sim

            // Specific brand warfare logic
            if (model.company.name.includes('比亚迪')) baseDiscount += 0.05; // BYD Glory Edition
            if (model.company.name.includes('特斯拉')) baseDiscount = 0.04 + (Math.sin(i) * 0.02); // Tesla fluctuations

            const discountRate = Math.min(Math.max(baseDiscount, 0.02), 0.25); // Cap 2-25%

            await (prisma as any).priceRecord.upsert({
                where: {
                    modelId_date_source: {
                        modelId: model.id,
                        date: date,
                        source: 'SYSTEM_SYNC'
                    }
                },
                create: {
                    modelId: model.id,
                    date: date,
                    guidePrice: 200000,
                    terminalPrice: 200000 * (1 - discountRate),
                    discountRate: discountRate,
                    source: 'SYSTEM_SYNC'
                },
                update: {
                    discountRate: discountRate,
                    terminalPrice: 200000 * (1 - discountRate)
                }
            });
        }
    }

    console.log('Seeding process complete. Database enriched.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
