import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { config } from "@/config";

const apiClient = axios.create({
    baseURL: new URL(config.domains.apiBasePath, config.domains.api).toString(),
});

apiClient.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        const message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Nepoznata greška";

        error.message =
            typeof message === "string" ? message : JSON.stringify(message);

        return Promise.reject(error);
    },
);

export default apiClient as Omit<
    AxiosInstance,
    "request" | "get" | "delete" | "head" | "post" | "put" | "patch"
> & {
    request<ResponseBody = unknown, RequestBody = unknown>(
        config: AxiosRequestConfig<RequestBody>,
    ): Promise<ResponseBody>;
    get<ResponseBody = unknown, RequestBody = unknown>(
        url: string,
        config?: AxiosRequestConfig<RequestBody>,
    ): Promise<ResponseBody>;
    delete<ResponseBody = unknown, RequestBody = unknown>(
        url: string,
        config?: AxiosRequestConfig<RequestBody>,
    ): Promise<ResponseBody>;
    head<ResponseBody = unknown, RequestBody = unknown>(
        url: string,
        config?: AxiosRequestConfig<RequestBody>,
    ): Promise<ResponseBody>;
    post<ResponseBody = unknown, RequestBody = unknown>(
        url: string,
        data?: RequestBody,
        config?: AxiosRequestConfig<RequestBody>,
    ): Promise<ResponseBody>;
    put<ResponseBody = unknown, RequestBody = unknown>(
        url: string,
        data?: RequestBody,
        config?: AxiosRequestConfig<RequestBody>,
    ): Promise<ResponseBody>;
    patch<ResponseBody = unknown, RequestBody = unknown>(
        url: string,
        data?: RequestBody,
        config?: AxiosRequestConfig<RequestBody>,
    ): Promise<ResponseBody>;
};
