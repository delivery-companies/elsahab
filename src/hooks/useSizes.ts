import type { Filters } from "@/services/getEmployeesService";
import { getSizesService } from "@/services/getSizes";
import { useQuery } from "@tanstack/react-query";

export const useSizes = ({ page = 1, size = 10, minified }: Filters = { page: 1, size: 10 }) => {
    return useQuery({
        queryKey: ["sizes", { page, size, minified }],
        queryFn: () => getSizesService({ page, size, minified })
    });
};
