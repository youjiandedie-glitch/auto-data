
import { syncSalesWithAkShare } from "../src/services/salesService";

async function main() {
    console.log("Syncing GASGOO sales data...");
    try {
        const count = await syncSalesWithAkShare("GASGOO");
        console.log(`Successfully synced ${count} records from GASGOO.`);
    } catch (e) {
        console.error("Sync failed:", e);
    }
}

main();
