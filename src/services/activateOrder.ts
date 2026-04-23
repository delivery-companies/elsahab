import { api } from "@/api";
import { deleteOrderEndpoint } from "@/api/apisUrl";

export const activateOrderService = async ({ id }: { id: string }) => {
    const response = await api.patch(`${deleteOrderEndpoint + id}/reactivate`);
    return response.data;
};
