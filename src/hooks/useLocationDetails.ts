import { getLocationDetailsService } from "@/services/getLocationDetails";
import { useQuery } from "@tanstack/react-query";

export function useLocationDetails(id: number) {
    return useQuery({
        queryKey: ["locations", id],
        queryFn: () => getLocationDetailsService(id),
        enabled: !!id
    });
}
