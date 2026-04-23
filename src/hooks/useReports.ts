import { type ReportsFilters, getReportsService } from "@/services/getReports";
import { useQuery } from "@tanstack/react-query";

export const useReports = (filter: ReportsFilters = { page: 1, size: 10 }) => {
    return useQuery({
        queryKey: [
            "reports",
            {
                page: filter.page || 1,
                size: 10,
                deleted: filter.deleted,
                ...filter
            }
        ],
        queryFn: () =>
            getReportsService({
                page: filter.page || 1,
                size: filter.size || 10,
                deleted: filter.deleted,
                ...filter
            })
    });
};
