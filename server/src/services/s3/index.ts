import config from "@/config";
import { ApiError } from "@/utils/routes/ApiError";
import {
    DeleteObjectCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3,
} from "@aws-sdk/client-s3";
import JSZip from "jszip";

export const s3Client = new S3({
    forcePathStyle: true,
    endpoint: config.s3.endpoint,
    region: config.s3.region,
    credentials: {
        accessKeyId: config.s3.accessKey,
        secretAccessKey: config.s3.secretKey,
    },
});

/**
 * Save a file to S3 and return the URL for the uploaded file
 * @param fileBuffer - The file buffer to save
 * @param fileName - The name of the file to save, if there are subdirectories, they should be included in this parameter
 * @param contentType - Optional MIME type of the file
 * @returns The URL for the uploaded file
 */
export async function saveFileToS3(
    fileBuffer: Buffer,
    fileName: string,
    contentType?: string,
) {
    const command = new PutObjectCommand({
        Bucket: config.s3.bucket,
        Key: fileName,
        Body: fileBuffer,
        ContentType: contentType,
    });

    await s3Client.send(command);

    return fileName;
}

export function getFileFromS3(fileName: string) {
    const command = new GetObjectCommand({
        Bucket: config.s3.bucket,
        Key: fileName,
    });

    return s3Client.send(command);
}

export function deleteFileFromS3(fileName: string) {
    const command = new DeleteObjectCommand({
        Bucket: config.s3.bucket,
        Key: fileName,
    });

    return s3Client.send(command);
}

export function listFilesInDirectory(directoryPath: string) {
    const command = new ListObjectsV2Command({
        Bucket: config.s3.bucket,
        Prefix: directoryPath,
        MaxKeys: 1_000,
    });

    return s3Client.send(command);
}

/**
 * Downloads all files from a directory in S3, zips them, and returns the zip buffer
 * @param directoryPath - The directory path in S3 to download files from
 * @returns Buffer containing the zipped files
 */
export async function downloadAndZipS3Directory(
    directoryPath: string,
    includeKeys?: string[],
): Promise<Buffer> {
    const response = await listFilesInDirectory(directoryPath);

    const zip = new JSZip();
    if (!response.Contents) {
        throw new ApiError({
            status: 404,
            message: "No files found in directory",
        });
    }

    const downloadPromises = response.Contents.map(async (file) => {
        if (!file.Key || (includeKeys && !includeKeys.includes(file.Key))) {
            return;
        }

        const fileData = await getFileFromS3(file.Key);

        if (!fileData.Body) {
            return;
        }

        const fileContent = await fileData.Body.transformToByteArray();
        const fileName = file.Key.replace(directoryPath, "");
        zip.file(fileName, fileContent);
    });

    await Promise.all(downloadPromises);

    return zip.generateAsync({
        type: "nodebuffer",
        compression: "STORE",
    });
}

export function getPublicUrlForFile(fileName: string) {
    return `${
        config.env.dev ? "http://localhost:4566" : config.s3.endpoint
    }/${config.s3.bucket}/${fileName}`;
}
