import { api } from "@/api";
import { deleteRepositoryEndpoint } from "@/api/apisUrl";

export const deleteRepositoryService = async ({ id }: { id: number }) => {
    const response = await api.delete(deleteRepositoryEndpoint + id);
    return response.data;
};
