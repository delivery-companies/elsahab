import { type LocationFilters, getLocationsService } from "@/services/getLocations";
import { useQuery } from "@tanstack/react-query";

export const useLocations = (
    { page = 1, size = 10, minified, ...reset }: LocationFilters = {
        page: 1,
        size: 10
    },
    enabled = true
) => {
    return useQuery({
        queryKey: ["locations", { page, size, minified, ...reset }],
        queryFn: () => getLocationsService({ page, size, minified, ...reset }),
        enabled
    });
};
