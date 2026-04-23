import { getCategoriesService } from "@/services/getCategories";
import type { Filters } from "@/services/getEmployeesService";
import { useQuery } from "@tanstack/react-query";

export const useCategory = ({ page = 1, size = 10, minified }: Filters = { page: 1, size: 10 }) => {
    return useQuery({
        queryKey: ["categories", { page, size, minified }],
        queryFn: () => getCategoriesService({ page, size, minified })
    });
};
