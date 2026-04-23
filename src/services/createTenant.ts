import { api } from "@/api";
import { createTenantEndpoint } from "@/api/apisUrl";

export interface CreateTenantPayload {
    companyData: FormData;
    companyManager: FormData;
}

export const createTenantService = async (data: FormData) => {
    const response = await api.post<FormData>(createTenantEndpoint, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
};
