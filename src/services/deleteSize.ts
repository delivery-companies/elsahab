import { api } from "@/api";
import { deleteSizeEndpoint } from "@/api/apisUrl";

export const deleteSizeService = async ({ id }: { id: number }) => {
    const response = await api.delete(deleteSizeEndpoint + id);
    return response.data;
};
