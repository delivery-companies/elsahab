import { getBranchDetails } from "@/services/getBranchDetails";
import { useQuery } from "@tanstack/react-query";

export function useBranchDetails(id: number) {
    return useQuery({
        queryKey: ["branches", id],
        queryFn: () => getBranchDetails(id)
    });
}
