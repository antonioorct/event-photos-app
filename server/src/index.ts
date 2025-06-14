import express from "express";
import config from "@/config";
import log from "@/utils/log";
import router from "@/routes";
import cors from "cors";
import { imageDB } from "@/services/db/image-db";

const app = express();

app.use(cors());

app.use(config.urls.apiBasePath, router());

const port = config.app.port;

async function startServer() {
    log.info("Starting server...");

    log.info("Initializing image database...");
    await imageDB.initialize();
    log.info("Image database initialized");

    app.listen(port, function () {
        log.info("API server started", { port });
    });
}

startServer().catch((error) => {
    log.error("Failed to start server:", error);
    process.exit(1);
});
