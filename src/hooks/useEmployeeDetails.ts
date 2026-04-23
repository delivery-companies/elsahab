import { getEmployeeDetailsService } from "@/services/getEmployeeDetails";
import { useQuery } from "@tanstack/react-query";

export function useEmployeeDetails(id: number, enabled?: boolean) {
    const isEnabled = enabled ?? !!id;
    return useQuery({
        queryKey: ["employees", id],
        queryFn: () => getEmployeeDetailsService(id),
        enabled: isEnabled
    });
}
