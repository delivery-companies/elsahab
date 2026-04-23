import { api } from "@/api";
import { deleteProductEndpoint } from "@/api/apisUrl";

export const deleteProductService = async ({ id }: { id: number }) => {
    const response = await api.delete(deleteProductEndpoint + id);
    return response.data;
};
