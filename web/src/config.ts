const env = import.meta.env;

export const config = {
    domains: {
        api: env.VITE_APP_API_URL,
        apiBasePath: env.VITE_APP_API_BASE_PATH,
    },
};
