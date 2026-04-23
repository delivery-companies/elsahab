import { api } from "@/api";
import { deleteCategoryEndpoint } from "@/api/apisUrl";

export const deleteCategoryService = async ({ id }: { id: number }) => {
    const response = await api.delete(deleteCategoryEndpoint + id);
    return response.data;
};
