import { getOrderTimeline } from "@/services/getOrderTimeline";
import { useQuery } from "@tanstack/react-query";

export const useOrderTimeline = (id: string) => {
    return useQuery({
        queryKey: ["orderTimeline", id],
        queryFn: () => getOrderTimeline(id)
    });
};
