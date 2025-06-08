import apiClient from "@/services/api";
import { createQueryKeys } from "@lukemorales/query-key-factory";

export const imagesQueryKey = "images";

export const imagesApi = createQueryKeys(imagesQueryKey, {
    all: {
        queryKey: null,
        queryFn: () => {
            return apiClient.get<string[]>(`/images`);
        },
    },
});
