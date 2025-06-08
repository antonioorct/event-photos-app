import apiClient from "@/services/api";

const sendLog = (
    message: string,
    level: "info" | "error",
    metadata?: Record<string, unknown>,
) => {
    apiClient.post("/log", { message, level, metadata }).catch(() => {});
};

export const log = {
    info: (message: string, metadata?: Record<string, unknown>) =>
        sendLog(message, "info", metadata),
    error: (message: string, metadata?: Record<string, unknown>) =>
        sendLog(message, "error", metadata),
};
