import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding model metadata and prices...');

    // 1. Define metadata map
    const modelMetadata: Record<string, { category: string, energyType: string }> = {
        '秦PLUS': { category: 'Sedan', energyType: 'PHEV' },
        '宋PLUS': { category: 'SUV', energyType: 'PHEV' },
        'Model Y': { category: 'SUV', energyType: 'BEV' },
        'Model 3': { category: 'Sedan', energyType: 'BEV' },
        '问界M7': { category: 'SUV', energyType: 'EREV' },
        '问界M9': { category: 'SUV', energyType: 'EREV' },
        '理想L7': { category: 'SUV', energyType: 'EREV' },
        '理想L9': { category: 'SUV', energyType: 'EREV' },
        '小米SU7': { category: 'Sedan', energyType: 'BEV' },
        '极氪001': { category: 'Sedan', energyType: 'BEV' },
        '元PLUS': { category: 'SUV', energyType: 'BEV' },
        '五菱宏光MINI': { category: 'Sedan', energyType: 'BEV' },
        '海鸥': { category: 'Sedan', energyType: 'BEV' },
        '轩逸': { category: 'Sedan', energyType: 'ICE' },
        '朗逸': { category: 'Sedan', energyType: 'ICE' },
        '瑞虎8': { category: 'SUV', energyType: 'ICE' },
    };

    // 2. Update existing models
    const allModels = await prisma.carModel.findMany();
    for (const model of allModels) {
        const meta = Object.entries(modelMetadata).find(([key]) => model.name.includes(key));
        if (meta) {
            await prisma.carModel.update({
                where: { id: model.id },
                data: {
                    category: meta[1].category,
                    energyType: meta[1].energyType
                }
            });
            console.log(`Updated meta for ${model.name}`);

            // 3. Generate Price Records for top models
            // We'll generate 6 months of price history
            const now = new Date();
            for (let i = 0; i < 6; i++) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                let discountRate = 0.05 + Math.random() * 0.1; // 5-15% random discount

                // Special logic for BYD (Glory edition drop in early 2024 - simulated here as higher discount)
                if (model.name.includes('秦PLUS') || model.name.includes('宋PLUS')) {
                    discountRate += 0.05;
                }

                await (prisma as any).priceRecord.upsert({
                    where: {
                        modelId_date_source: {
                            modelId: model.id,
                            date: date,
                            source: 'AUTO_SYNC'
                        }
                    },
                    update: {
                        discountRate: discountRate,
                        terminalPrice: 100000 * (1 - discountRate) // simplified base price
                    },
                    create: {
                        modelId: model.id,
                        date: date,
                        guidePrice: 100000,
                        terminalPrice: 100000 * (1 - discountRate),
                        discountRate: discountRate,
                        source: 'AUTO_SYNC'
                    }
                });
            }
        }
    }

    console.log('Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
