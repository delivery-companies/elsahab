import type { Filters } from "@/services/getEmployeesService";
import { getProductsService } from "@/services/getProducts";
import { useQuery } from "@tanstack/react-query";

export const useProducts = ({ page = 1, size = 10, minified }: Filters = { page: 1, size: 10 }) => {
    return useQuery({
        queryKey: ["products", { page, size, minified }],
        queryFn: () => getProductsService({ page, size, minified })
    });
};
