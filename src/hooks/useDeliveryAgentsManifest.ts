import { type ManifestFilters, getDeliveryAgentManifest } from "@/services/getDeliveryAgentManifest";
import { useQuery } from "@tanstack/react-query";

export const useDeliveryAgentsManifest = (
    { page = 1, size = 10, ...reset }: ManifestFilters = { page: 1, size: 10 }
) => {
    return useQuery({
        queryKey: ["deliveryAgentsManifest", { page, size, ...reset }],
        queryFn: () => getDeliveryAgentManifest({ page, size, ...reset })
    });
};
