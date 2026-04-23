import { api } from "@/api";
import { createSizeEndpoint } from "@/api/apisUrl";

export interface CreateSizePayload {
    title: string;
}

export const createSizeService = async (data: CreateSizePayload) => {
    const response = await api.post<CreateSizePayload>(createSizeEndpoint, data);
    return response.data;
};
