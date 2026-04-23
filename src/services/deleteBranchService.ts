import { api } from "@/api";
import { deleteBranchEndpoint } from "@/api/apisUrl";

export const deleteBranchService = async ({ id }: { id: number }) => {
    const response = await api.delete(deleteBranchEndpoint + id);
    return response.data;
};
