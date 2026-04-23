import type { Filters } from "@/services/getEmployeesService";
import { getTenantsService } from "@/services/getTenants";
import { useQuery } from "@tanstack/react-query";

export const useTenants = (
    { page = 1, size = 10, minified, main_company }: Filters & { main_company?: boolean } = {
        page: 1,
        size: 10
    },
    enabled?: boolean
) => {
    return useQuery({
        queryKey: ["tenants", { page, size, minified, main_company }],
        queryFn: () => getTenantsService({ page, size, minified, main_company }),
        enabled
    });
};
