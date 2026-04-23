import { getStoreDetailsService } from "@/services/getStoreDetails";
import { useQuery } from "@tanstack/react-query";

export const useStoreDetails = (id: number) => {
    return useQuery({
        queryKey: ["stores", id],
        queryFn: () => getStoreDetailsService(id),
        enabled: !!id
    });
};
