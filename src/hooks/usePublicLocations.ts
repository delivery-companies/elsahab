import { getPublicLocationsService } from "@/services/getPublicLocations";
import { useQuery } from "@tanstack/react-query";

export const usePublicLocations = () => {
    return useQuery({
        queryKey: ["publicLocations"],
        queryFn: () => getPublicLocationsService()
    });
};
