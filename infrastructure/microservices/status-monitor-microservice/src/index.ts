import dotenv from "dotenv";
import { initialize_database } from "./Database/InitializeConnection";
import { createApp } from "./app";
import { runChecksOnce } from "./Services/MonitoringService";

dotenv.config();

async function main() {
    await initialize_database();

    await runChecksOnce();
    
    const app = createApp();
    const port = Number(process.env.PORT) || 5790;

    app.listen(port, () => {
        console.log(`[StatusMonitor] HTTP listening on port ${port}`);
    });
}

main();
