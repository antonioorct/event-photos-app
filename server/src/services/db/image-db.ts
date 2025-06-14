import {
    listFilesInDirectory,
    getFileFromS3,
    getPublicUrlForFile,
} from "@/services/s3";
import log from "@/utils/log";

interface ImageMetadata {
    url: string;
    key: string;
    filename: string;
    width: number | null;
    height: number | null;
    size?: number;
    lastModified?: Date;
}

class ImageDatabase {
    private images: Map<string, ImageMetadata> = new Map();
    private isInitialized = false;
    private initializationPromise: Promise<void> | null = null;

    async initialize(): Promise<void> {
        if (this.isInitialized) {
            return;
        }
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = this._doInitialize();
        await this.initializationPromise;
    }

    private async _doInitialize(): Promise<void> {
        try {
            const response = await listFilesInDirectory("images");

            if (!response.Contents) {
                this.isInitialized = true;
                return;
            }

            const batchSize = 20;
            const batches = [];

            for (let i = 0; i < response.Contents.length; i += batchSize) {
                batches.push(response.Contents.slice(i, i + batchSize));
            }

            for (const batch of batches) {
                const batchPromises = batch.map(async (file) => {
                    if (!file.Key) {
                        return;
                    }

                    try {
                        const fileData = await getFileFromS3(file.Key);
                        const url = getPublicUrlForFile(file.Key);

                        const width = fileData.Metadata?.width
                            ? parseInt(fileData.Metadata.width)
                            : null;
                        const height = fileData.Metadata?.height
                            ? parseInt(fileData.Metadata.height)
                            : null;

                        const metadata: ImageMetadata = {
                            url,
                            key: file.Key,
                            filename: file.Key.replace("images/", ""),
                            width,
                            height,
                            size: file.Size,
                            lastModified: file.LastModified,
                        };

                        this.images.set(file.Key, metadata);
                    } catch (error) {
                        log.error("Error processing image", {
                            error,
                            fileKey: file.Key,
                        });

                        const metadata: ImageMetadata = {
                            url: getPublicUrlForFile(file.Key),
                            key: file.Key,
                            filename: file.Key.replace("images/", ""),
                            width: null,
                            height: null,
                            size: file.Size,
                            lastModified: file.LastModified,
                        };

                        this.images.set(file.Key, metadata);
                    }
                });

                await Promise.all(batchPromises);
            }

            this.isInitialized = true;
        } catch (error) {
            log.error("Failed to initialize image database", {
                error,
            });
            this.isInitialized = true;
        }
    }

    async addImage(
        key: string,
        url: string,
        width: number | null,
        height: number | null,
        size?: number,
    ): Promise<void> {
        await this.initialize();

        const metadata: ImageMetadata = {
            url,
            key,
            filename: key.replace("images/", ""),
            width,
            height,
            size,
            lastModified: new Date(),
        };

        this.images.set(key, metadata);
    }

    async getAllImages(): Promise<ImageMetadata[]> {
        await this.initialize();
        return Array.from(this.images.values());
    }

    async getImage(key: string): Promise<ImageMetadata | null> {
        await this.initialize();
        return this.images.get(key) || null;
    }

    async getImageByFilename(filename: string): Promise<ImageMetadata | null> {
        await this.initialize();
        const key = `images/${filename}`;
        return this.images.get(key) || null;
    }

    getImageCount(): number {
        return this.images.size;
    }

    isReady(): boolean {
        return this.isInitialized;
    }

    async removeImage(key: string): Promise<boolean> {
        await this.initialize();
        return this.images.delete(key);
    }

    async clear(): Promise<void> {
        this.images.clear();
        this.isInitialized = false;
        this.initializationPromise = null;
    }
}

export const imageDB = new ImageDatabase();
export type { ImageMetadata };
