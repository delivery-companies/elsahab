import { api } from "@/api";
import { getTenantDetailsEndpoint } from "@/api/apisUrl";
import type { Tenant } from "./getTenants";

export interface GetTenantsResponse {
    status: string;
    data: Tenant;
}

export const getTenantDetailsService = async (id: number) => {
    const response = await api.get<GetTenantsResponse>(getTenantDetailsEndpoint + id);
    return response.data;
};
