import { api } from "@/api";
import { editCategoryEndpoint } from "@/api/apisUrl";

export const editCategoryService = async ({
    title,
    id
}: {
    title: string;
    id: number;
}) => {
    const response = await api.patch<{
        title: string;
        id: number;
    }>(editCategoryEndpoint + id, { title });
    return response.data;
};
