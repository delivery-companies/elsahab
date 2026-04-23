import { api } from "@/api";
import { deleteOrderEndpoint } from "@/api/apisUrl";

export const deactivateOrderService = async ({ id }: { id: string }) => {
    const response = await api.patch(`${deleteOrderEndpoint + id}/deactivate`);
    return response.data;
};
