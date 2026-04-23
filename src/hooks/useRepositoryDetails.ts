import { getRepositoryDetailsService } from "@/services/getRepositoryDetails";
import { useQuery } from "@tanstack/react-query";

export function useRepositoryDetails(id: number) {
    return useQuery({
        queryKey: ["repositories", id],
        queryFn: () => getRepositoryDetailsService(id),
        enabled: !!id
    });
}
