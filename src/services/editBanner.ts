import { api } from "@/api";
import { editBannerEndpoint } from "@/api/apisUrl";

export const editBannerService = async ({
    data,
    id
}: {
    data: FormData;
    id: number;
}) => {
    const response = await api.patch<FormData>(editBannerEndpoint + id, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};
