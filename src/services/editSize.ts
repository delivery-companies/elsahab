import { api } from "@/api";
import { editSizeEndpoint } from "@/api/apisUrl";

export const editSizeService = async ({
    title,
    id
}: {
    title: string;
    id: number;
}) => {
    const response = await api.patch<{
        title: string;
        id: number;
    }>(editSizeEndpoint + id, { title });
    return response.data;
};
