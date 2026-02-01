import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const companies = [
        { name: "比亚迪", stockSymbol: "1211.HK", market: "HK" },
        { name: "理想汽车", stockSymbol: "2015.HK", market: "HK" },
        { name: "蔚来", stockSymbol: "9866.HK", market: "HK" },
        { name: "小鹏汽车", stockSymbol: "9868.HK", market: "HK" },
        { name: "赛力斯", stockSymbol: "601127.SS", market: "A" },
        { name: "小米集团", stockSymbol: "1810.HK", market: "HK" },
        { name: "吉利汽车", stockSymbol: "0175.HK", market: "HK" },
        { name: "长安汽车", stockSymbol: "000625.SZ", market: "A" },
        { name: "零跑汽车", stockSymbol: "9863.HK", market: "HK" },
        { name: "长城汽车", stockSymbol: "2333.HK", market: "HK" },
        { name: "上汽集团", stockSymbol: "600104.SS", market: "A" },
        { name: "广汽集团", stockSymbol: "2238.HK", market: "HK" },
        { name: "江淮汽车", stockSymbol: "600418.SS", market: "A" },
        { name: "北京汽车", stockSymbol: "1958.HK", market: "HK" },
        { name: "东风集团", stockSymbol: "0489.HK", market: "HK" },
        { name: "北汽蓝谷", stockSymbol: "600733.SS", market: "A" },
    ];

    console.log("Seeding companies...");

    for (const company of companies) {
        await prisma.company.upsert({
            where: { stockSymbol: company.stockSymbol },
            update: {
                name: company.name,
                market: company.market,
            },
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
