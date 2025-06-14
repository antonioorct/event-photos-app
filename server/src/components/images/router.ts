import { getPublicUrlForFile, saveFileToS3 } from "@/services/s3";
import { imageDB } from "@/services/db/image-db";
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
            const images = await imageDB.getAllImages();
            return images;
        },
    );

    route(
        app,
        {
            path: "/images/:key",
            params: ["key"],
        },
        async ({ params }) => {
            const image = await imageDB.getImageByFilename(params.key);

            if (!image) {
                throw new Error("Image not found");
            }

            return image;
        },
    );

    app.post("/images", upload.single("image"), async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileName = `images/${Date.now()}-${req.file.originalname}`;
        const result = await saveFileToS3(
            req.file.buffer,
            fileName,
            req.file.mimetype,
        );
        const url = getPublicUrlForFile(result.fileName);

        await imageDB.addImage(
            result.fileName,
            url,
            result.dimensions?.width || null,
            result.dimensions?.height || null,
            req.file.size,
        );

        res.json({
            url,
            width: result.dimensions?.width,
            height: result.dimensions?.height,
        });
    });
};
