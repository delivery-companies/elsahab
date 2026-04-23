import { api } from "@/api";
import { editLocationEndpoint } from "@/api/apisUrl";
import type { governorateArabicNames } from "@/lib/governorateArabicNames ";

export interface EditLocationPayload {
    name?: string;
    governorate?: keyof typeof governorateArabicNames;
    branchID?: number;
    deliveryAgentsIDs?: number[];
    remote?: boolean;
}

export const editLocationService = async ({
    data,
    id
}: {
    data: EditLocationPayload;
    id: number;
}) => {
    const response = await api.patch<EditLocationPayload>(editLocationEndpoint + id, data);
    return response.data;
};

export const editLocationDeliveryAgentsService = async ({
    branchID,
    deliveryAgentsIDs
}: EditLocationPayload) => {
    const response = await api.patch<EditLocationPayload>(editLocationEndpoint + branchID, {
        deliveryAgentsIDs
    });
    return response.data;
};

export const editLocationBranchesService = async ({
    id,
    data
}: {
    id: number;
    data: EditLocationPayload;
}) => {
    const response = await api.patch<EditLocationPayload>(editLocationEndpoint + id, data);
    return response.data;
};
