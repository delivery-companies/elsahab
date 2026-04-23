import { api } from "@/api";
import { deleteStoreEndpoint } from "@/api/apisUrl";

export const activateStoreService = async ({ id }: { id: number }) => {
    const response = await api.patch(`${deleteStoreEndpoint + id}/reactivate`);
    return response.data;
};
