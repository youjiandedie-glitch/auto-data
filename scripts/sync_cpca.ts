
import { syncSalesWithAkShare } from "../src/services/salesService";

async function main() {
    console.log("Syncing CPCA sales data...");
    try {
        const count = await syncSalesWithAkShare("CPCA");
        console.log(`Successfully synced ${count} records from CPCA.`);
    } catch (e) {
        console.error("Sync failed:", e);
    }
}

main();
