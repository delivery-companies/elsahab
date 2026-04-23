import { getClientsService } from "@/services/getClients";
import type { Filters } from "@/services/getEmployeesService";
import { useMutation, useQuery } from "@tanstack/react-query";

export interface ClientsFilters extends Filters {
    branch_id?: string | null;
    phone?: string;
    name?: string;
}

export function useClients(
    { page = 1, size = 10, deleted, minified, ...reset }: ClientsFilters = {
        page: 1,
        size: 10
    }
) {
    return useQuery({
        queryKey: ["clients", { page, size, deleted, minified, ...reset }],
        queryFn: () => getClientsService({ page, size, deleted, minified, ...reset })
    });
}

export const useClientByStoreId = () => {
    return useMutation({
        mutationFn: (store_id: string) => getClientsService({ store_id })
    });
};
