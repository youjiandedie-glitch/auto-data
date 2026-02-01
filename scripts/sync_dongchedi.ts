import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BASE_URL = 'https://www.dongchedi.com/motor/pc/car/rank_data';
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.dongchedi.com/sales',
    'Accept': 'application/json, text/plain, */*'
};

async function fetchMonthData(month: string, offset: number = 0, limit: number = 100): Promise<any[]> {
    const params = new URLSearchParams({
        aid: '1839',
        app_name: 'auto_web_pc',
        count: limit.toString(),
        offset: offset.toString(),
        month: month,
        rank_data_type: '11',
        city_name: '全国', // Optional: country level
        brand_id: '',
        price: '',
        series_type: '',
        energy_type: ''
    });

    const url = `${BASE_URL}?${params.toString()}`;
    console.log(`Fetching DCD sales for ${month} (offset ${offset})...`);

    try {
        const res = await fetch(url, { headers: HEADERS });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return json.data?.list || [];
    } catch (e) {
        console.error(`Failed to fetch ${url}:`, e);
        return [];
    }
}

async function main() {
    console.log("Starting Dongchedi (DCD) Sync...");

    // Get last 12 months
    const months = [];
    const now = new Date();
    for (let i = 1; i <= 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const yyyy = d.getFullYear();
        const mm = (d.getMonth() + 1).toString().padStart(2, '0');
        months.push(`${yyyy}${mm}`);
    }

    const companies = await prisma.company.findMany();

    for (const monthStr of months) {
        // Fetch top 100 models per month
        const records = await fetchMonthData(monthStr, 0, 100);

        if (records.length === 0) {
            console.log(`No data for ${monthStr}, skipping.`);
            continue;
        }

        const date = new Date(
            parseInt(monthStr.substring(0, 4)),
            parseInt(monthStr.substring(4, 6)) - 1,
            1
        );

        let syncedCount = 0;

        for (const item of records) {
            const seriesName = item.series_name; // Model Name
            const subBrandName = item.sub_brand_name; // Manufacturer
            const volume = parseInt(item.count);

            // Match Company
            const company = companies.find(c =>
                c.name === subBrandName ||
                subBrandName.includes(c.name) ||
                c.name.includes(subBrandName)
            );

            if (company) {
                // Upsert Model
                const model = await prisma.carModel.upsert({
                    where: {
                        companyId_name: {
                            companyId: company.id,
                            name: seriesName
                        }
                    },
                    update: {},
                    create: {
                        name: seriesName,
                        companyId: company.id,
                        category: item.series_type_name || '轿车', // e.g., using explicit type if available or fallback
                        energyType: item.energy_type_name?.includes('电') ? 'BEV' : 'ICE' // Rudimentary detection
                    }
                });

                // Upsert Sales Record
                await (prisma as any).salesRecord.upsert({
                    where: {
                        companyId_modelId_date_periodType_source: {
                            companyId: company.id,
                            modelId: model.id,
                            date: date,
                            periodType: "MONTH",
                            source: "DCD"
                        },
                    },
                    update: { volume },
                    create: {
                        companyId: company.id,
                        modelId: model.id,
                        date: date,
                        volume: volume,
                        periodType: "MONTH",
                        source: "DCD"
                    }
                });
                syncedCount++;
            }
        }
        console.log(`Synced ${syncedCount} records for ${monthStr}`);

        // Politeness delay
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log("DCD Sync Complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
