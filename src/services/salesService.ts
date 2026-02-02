import { exec } from "child_process";
import path from "path";
import prisma from "@/lib/prisma";

const AKSHARE_MAP: Record<string, string[]> = {
    "比亚迪": ["比亚迪"],
    "理想汽车": ["理想"],
    "蔚来": ["蔚来"],
    "小鹏汽车": ["小鹏"],
    "赛力斯": ["赛力斯", "金康"],
    "小米集团": ["小米"],
    "吉利汽车": ["吉利"],
    "长安汽车": ["长安"],
    "零跑汽车": ["零跑"],
    "长城汽车": ["长城", "哈弗"],
    "上汽集团": ["上汽", "名爵", "荣威"],
    "广汽集团": ["广汽", "埃安", "传祺"],
    "江淮汽车": ["江淮"],
    "北京汽车": ["北京"],
    "北汽蓝谷": ["北汽新能源", "极狐"],
    "东风集团": ["东风"],
};

export async function syncSalesWithAkShare(source: "GASGOO" | "CPCA" | "GASGOO_MODELS" = "GASGOO", months: number = 24) {
    const scriptPath = path.join(process.cwd(), "scripts", "fetch_sales.py");

    return new Promise((resolve, reject) => {
        exec(`python3 ${scriptPath} --months ${months} --source ${source.toLowerCase()}`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`AkShare script error: ${stderr}`);
                return reject(error);
            }

            try {
                const rawData = JSON.parse(stdout);
                const companies = await prisma.company.findMany();
                let syncedCount = 0;

                for (const item of rawData) {
                    const company = companies.find(c =>
                        c.name === item.name ||
                        (AKSHARE_MAP[c.name] && AKSHARE_MAP[c.name].some(alias => item.name.includes(alias)))
                    );

                    if (company) {
                        const year = parseInt(item.date.substring(0, 4));
                        const month = parseInt(item.date.substring(4, 6)) - 1;
                        const date = new Date(year, month, 1);
                        const volume = item.volume;

                        let modelId = null;
                        if (item.model_name) {
                            const model = await (prisma as any).carModel.upsert({
                                where: {
                                    companyId_name: {
                                        companyId: company.id,
                                        name: item.model_name
                                    }
                                },
                                update: {},
                                create: {
                                    name: item.model_name,
                                    companyId: company.id
                                }
                            });
                            modelId = model.id;
                        }

                        const whereCondition = {
                            companyId: company.id,
                            modelId: modelId,
                            date: date,
                            periodType: "MONTH",
                            source: source === "GASGOO_MODELS" ? "GASGOO" : source
                        };

                        const existingRecord = await prisma.salesRecord.findFirst({
                            where: whereCondition
                        });

                        if (existingRecord) {
                            await prisma.salesRecord.update({
                                where: { id: existingRecord.id },
                                data: { volume: volume }
                            });
                        } else {
                            await prisma.salesRecord.create({
                                data: {
                                    companyId: company.id,
                                    modelId: modelId,
                                    date: date,
                                    volume: volume,
                                    periodType: "MONTH",
                                    source: source === "GASGOO_MODELS" ? "GASGOO" : source
                                }
                            });
                        }
                        syncedCount++;
                    }
                }
                resolve(syncedCount);
            } catch (e) {
                reject(e);
            }
        });
    });
}

export async function generateMockSales(companyId: string) {
    const existing = await prisma.salesRecord.count({ where: { companyId } });
    if (existing > 0) return existing;

    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) return 0;

    const records = [];
    const now = new Date();

    let baseMonthly = 30000;
    if (company.name.includes("比亚迪")) baseMonthly = 300000;
    if (company.name.includes("蔚来")) baseMonthly = 18000;
    if (company.name.includes("小鹏")) baseMonthly = 15000;
    if (company.name.includes("理想")) baseMonthly = 45000;
    if (company.name.includes("赛力斯")) baseMonthly = 35000;
    if (company.name.includes("小米")) baseMonthly = 20000;

    for (let i = 0; i < 24; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthlyVolume = Math.floor(baseMonthly * (0.9 + Math.random() * 0.2));

        records.push({
            companyId,
            date: new Date(date),
            volume: Math.max(0, monthlyVolume),
            periodType: "MONTH",
        });
    }

    let count = 0;
    for (const record of records) {
        const whereCondition = {
            companyId: record.companyId,
            modelId: null,
            date: record.date,
            periodType: record.periodType,
            source: "GASGOO"
        };

        const existingRecord = await prisma.salesRecord.findFirst({
            where: whereCondition
        });

        if (existingRecord) {
            await prisma.salesRecord.update({
                where: { id: existingRecord.id },
                data: { volume: record.volume }
            });
        } else {
            await prisma.salesRecord.create({
                data: {
                    ...record,
                    modelId: null,
                    source: "GASGOO"
                }
            });
        }
        count++;
    }

    return count;
}
