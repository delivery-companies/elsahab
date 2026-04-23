import { api } from "@/api";
import { deleteClientEndpoint } from "@/api/apisUrl";

export const deactivateClientService = async ({ id }: { id: number }) => {
    const response = await api.patch(`${deleteClientEndpoint + id}/deactivate`);
    return response.data;
};
