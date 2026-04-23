import { api } from "@/api";
import { deleteBannerEndpoint } from "@/api/apisUrl";

export const deleteBannerService = async ({ id }: { id: number }) => {
    const response = await api.delete(deleteBannerEndpoint + id);
    return response.data;
};
