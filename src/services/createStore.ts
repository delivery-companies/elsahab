import { api } from "@/api";
import { createStoreEndpoint } from "@/api/apisUrl";

export interface CreateStorePayload {
    name: string;
    clientID: number;
    notes: string;
}

export const createStoreService = async (data: FormData) => {
    const response = await api.post<FormData>(createStoreEndpoint, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};
