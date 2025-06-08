import {
    listFilesInDirectory,
    getPublicUrlForFile,
    saveFileToS3,
} from "@/services/s3";
import { route } from "@/utils/routes";
import { Router } from "express";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export default (app: Router) => {
    route(
        app,
        {
            path: "/images",
        },
        async () => {
            const response = await listFilesInDirectory("images");

            return (
                response.Contents?.map((file) =>
                    file.Key ? getPublicUrlForFile(file.Key) : null,
                ).filter(Boolean) || []
            );
        },
    );

    route(
        app,
        {
            path: "/images/:key",
            params: ["key"],
        },
        async ({ params }) => {
            const imageKey = `images/${params.key}`;
            const url = getPublicUrlForFile(imageKey);

            return {
                key: imageKey,
                url: url,
                filename: params.key,
            };
        },
    );

    app.post("/images", upload.single("image"), async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileName = `images/${Date.now()}-${req.file.originalname}`;
        await saveFileToS3(req.file.buffer, fileName, req.file.mimetype);
        const url = getPublicUrlForFile(fileName);

        res.json({ url });
    });
};
