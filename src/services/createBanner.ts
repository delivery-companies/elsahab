import { api } from "@/api";
import { createBannerEndpoint } from "@/api/apisUrl";

export const createBannerService = async (data: FormData) => {
    const response = await api.post<FormData>(createBannerEndpoint, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};
