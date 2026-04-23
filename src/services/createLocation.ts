import { api } from "@/api";
import { createLocationEndpoint } from "@/api/apisUrl";

export interface CreateLocationPayload {
    name: string;
    governorate: string;
    branchID: number;
    deliveryAgentsIDs: number[];
    remote: boolean;
}

export const createLocationService = async (data: CreateLocationPayload) => {
    const response = await api.post<CreateLocationPayload>(createLocationEndpoint, data);
    return response.data;
};
