import { getColorsService } from "@/services/getColors";
import type { Filters } from "@/services/getEmployeesService";
import { useQuery } from "@tanstack/react-query";

export const useColors = ({ page = 1, size = 10, minified }: Filters = { page: 1, size: 10 }) => {
    return useQuery({
        queryKey: ["colors", { page, size, minified }],
        queryFn: () => getColorsService({ page, size, minified })
    });
};
