import { api } from "@/api";
import { deleteColorEndpoint } from "@/api/apisUrl";

export const deleteColorService = async ({ id }: { id: number }) => {
    const response = await api.delete(deleteColorEndpoint + id);
    return response.data;
};
