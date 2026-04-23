import { api } from "@/api";
import { deleteOrderEndpoint } from "@/api/apisUrl";

export const deleteOrderService = async ({ id }: { id: string }) => {
    const response = await api.delete(deleteOrderEndpoint + id);
    return response.data;
};
