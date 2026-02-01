import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const companies = [
        {
            name: "比亚迪 (BYD)",
            stockSymbol: "1211.HK",
            market: "HK",
        },
        {
            name: "蔚来 (NIO)",
            stockSymbol: "9866.HK",
            market: "HK",
        },
        {
            name: "小鹏 (XPeng)",
            stockSymbol: "9868.HK",
            market: "HK",
        },
        {
            name: "理想 (Li Auto)",
            stockSymbol: "2015.HK",
            market: "HK",
        },
        {
            name: "赛力斯 (Seres)",
            stockSymbol: "601127.SS",
            market: "A",
        },
        {
            name: "小米 (Xiaomi)",
            stockSymbol: "1810.HK",
            market: "HK",
        },
    ];

    console.log("Seeding companies...");

    for (const company of companies) {
        await prisma.company.upsert({
            where: { stockSymbol: company.stockSymbol },
            update: {},
            create: company,
        });
    }

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
