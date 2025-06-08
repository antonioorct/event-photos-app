import apiClient from "@/services/api";
import { useMutation } from "@tanstack/react-query";

export function useUploadImage() {
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("image", file);

            return apiClient.post<{ url: string }>("/images", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        },
    });
}
