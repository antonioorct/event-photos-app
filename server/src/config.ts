import dotenv from "dotenv";

dotenv.config();

const env = process.env;

function checkEnv(key: string): boolean {
    const haveEnv = typeof env[key] === "string";

    if (!haveEnv) {
        // eslint-disable-next-line no-console
        console.warn(`${key} environment variable is not set`);
    }

    return haveEnv;
}

const PROD = env.NODE_ENV === "production";

[
    "PORT",
    "LOG_LEVEL",
    "S3_ACCESS_KEY",
    "S3_SECRET_KEY",
    "S3_ENDPOINT",
    "S3_BUCKET",
    "S3_REGION",
].forEach(checkEnv);

const config = {
    app: {
        port: parseInt(env.PORT ?? "3000", 10),
    },
    urls: {
        apiBasePath: env.API_BASE_PATH as string,
    },
    winston: {
        logLevel: (env.LOG_LEVEL ?? "info").toLowerCase(),
    },
    env: {
        prod: PROD,
        dev: !PROD,
        nodeEnv: env.NODE_ENV,
    },
    s3: {
        accessKey: env.S3_ACCESS_KEY as string,
        secretKey: env.S3_SECRET_KEY as string,
        endpoint: env.S3_ENDPOINT as string,
        bucket: env.S3_BUCKET as string,
        region: env.S3_REGION as string,
    },
};

export default config;
