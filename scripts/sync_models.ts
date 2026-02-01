import { syncSalesWithAkShare } from "../src/services/salesService";

async function main() {
    console.log("Starting model-level sales sync...");
    try {
        const count = await syncSalesWithAkShare("GASGOO_MODELS", 3);
        console.log(`Successfully synced ${count} model sales records.`);
    } catch (error) {
        console.error("Sync failed:", error);
    }
}

main();
