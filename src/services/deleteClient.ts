import { api } from "@/api";
import { deleteClientEndpoint } from "@/api/apisUrl";

export const deleteClientService = async ({ id }: { id: number }) => {
    const response = await api.delete(deleteClientEndpoint + id);
    return response.data;
};
