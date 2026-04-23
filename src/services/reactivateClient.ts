import { api } from "@/api";
import { deleteClientEndpoint } from "@/api/apisUrl";

export const reactivateClientService = async ({ id }: { id: number }) => {
    const response = await api.patch(`${deleteClientEndpoint + id}/reactivate`);
    return response.data;
};
