import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding policy data...');

    await prisma.policy.createMany({
        data: [
            {
                title: '以旧换新补贴政策',
                description: '国家加力支持消费品以旧换新，报废更新补贴标准翻倍。',
                date: new Date('2024-04-26'),
                category: 'SUBSIDY',
                impactLevel: 'HIGH'
            },
            {
                title: '新能源免征购置税延续',
                description: '对新能源汽车免征车辆购置税，进一步稳定市场预期。',
                date: new Date('2024-01-01'),
                category: 'TAX',
                impactLevel: 'MEDIUM'
            },
            {
                title: '国六B排放标准全面实施',
                description: '全国范围全面实施国六排放标准6b阶段，库存车清理加速。',
                date: new Date('2023-07-01'),
                category: 'REGULATION',
                impactLevel: 'HIGH'
            }
        ]
    });

    console.log('Policy seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
