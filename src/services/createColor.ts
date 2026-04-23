import { api } from "@/api";
import { createColorEndpoint } from "@/api/apisUrl";

export interface CreateColorPayload {
    title: string;
    code: string;
}

export const createColorService = async (data: CreateColorPayload) => {
    const response = await api.post<CreateColorPayload>(createColorEndpoint, data);
    return response.data;
};
