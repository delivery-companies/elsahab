import { api } from "@/api";
import { deleteStoreEndpoint } from "@/api/apisUrl";

export const deactivateStoreService = async ({ id }: { id: number }) => {
    const response = await api.patch(`${deleteStoreEndpoint + id}/deactivate`);
    return response.data;
};
