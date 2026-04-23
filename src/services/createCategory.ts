import { api } from "@/api";
import { createCategoryEndpoint } from "@/api/apisUrl";

export interface CreateCategoryPayload {
    title: string;
}

export const createCategoryService = async (data: CreateCategoryPayload) => {
    const response = await api.post<CreateCategoryPayload>(createCategoryEndpoint, data);
    return response.data;
};
