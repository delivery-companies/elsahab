import { api } from "@/api";
import { deleteLocationEndpoint } from "@/api/apisUrl";

export const deleteLocationService = async ({ id }: { id: number }) => {
    const response = await api.delete(deleteLocationEndpoint + id);
    return response.data;
};
