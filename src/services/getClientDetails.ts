import { api } from "@/api";
import { getClientDetailsEndpoint } from "@/api/apisUrl";
import type { Client } from "./getClients";

export interface GetClientDetailsResponse {
    status: string;
    data: Client;
}

export const getClientDetailsService = async (id: number) => {
    const response = await api.get<GetClientDetailsResponse>(getClientDetailsEndpoint + id);
    return response.data;
};
