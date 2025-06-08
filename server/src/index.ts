import express from "express";
import config from "@/config";
import log from "@/utils/log";
import router from "@/routes";
import cors from "cors";

const app = express();

app.use(cors());

app.use(config.urls.apiBasePath, router());

const port = config.app.port;
app.listen(port, function () {
    log.info("API server started", { port });
});
