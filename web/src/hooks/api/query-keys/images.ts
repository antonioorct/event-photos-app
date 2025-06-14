import apiClient from "@/services/api";
import { createQueryKeys } from "@lukemorales/query-key-factory";

type ImageMetadata = {
    url: string;
    key: string;
    filename: string;
    width: number | null;
    height: number | null;
};

export const imagesQueryKey = "images";

export const imagesApi = createQueryKeys(imagesQueryKey, {
    all: {
        queryKey: null,
        queryFn: () => {
            return apiClient.get<ImageMetadata[]>(`/images`);
        },
    },
});
