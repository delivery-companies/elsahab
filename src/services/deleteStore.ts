import { api } from "@/api";
import { deleteStoreEndpoint } from "@/api/apisUrl";

export const deleteStoreService = async ({ id }: { id: number }) => {
    const response = await api.delete(deleteStoreEndpoint + id);
    return response.data;
};
