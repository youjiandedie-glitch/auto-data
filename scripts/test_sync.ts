import { syncSalesWithAkShare } from "../src/services/salesService";

async function run() {
    console.log("Starting sales sync with AkShare...");
    try {
        const count = await syncSalesWithAkShare("GASGOO", 3); // Just 3 months for quick testing
        console.log(`Successfully synced ${count} records.`);
    } catch (e) {
        console.error("Sync failed:", e);
    }
}

run();
