import { api } from "@/api";
import { deleteTenantEndpoint } from "@/api/apisUrl";

export const deleteTenantService = async ({ id }: { id: number }) => {
    const response = await api.delete(deleteTenantEndpoint + id);
    return response.data;
};
