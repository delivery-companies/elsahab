import type { rolesArabicNames } from "@/lib/rolesArabicNames";
import { type Filters, getEmployeesService } from "@/services/getEmployeesService";
import { useQuery } from "@tanstack/react-query";

export interface EmployeesFilters extends Filters {
    roles?: (keyof typeof rolesArabicNames)[];
    branch_id?: string | null;
    location_id?: string | null;
    phone?: string;
    name?: string;
}

export const useEmployees = (
    { page = 1, size = 10, roles, deleted, minified, ...reset }: EmployeesFilters = {
        page: 1,
        size: 10
    }
) => {
    return useQuery({
        queryKey: ["employees", { page, size, roles, deleted, minified, ...reset }],
        queryFn: () =>
            getEmployeesService({
                page,
                size,
                roles,
                deleted,
                minified,
                ...reset
            })
    });
};
