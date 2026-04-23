import { api } from "@/api";
import { deleteAutomaticUpdateEndpoint } from "@/api/apisUrl";

export const deleteAutomaticUpdateDateService = async ({
    id
}: {
    id: number;
}) => {
    const response = await api.delete(deleteAutomaticUpdateEndpoint + id);
    return response.data;
};
