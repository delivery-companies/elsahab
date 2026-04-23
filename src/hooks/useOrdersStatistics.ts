import {
    type OrdersStatisticsFilter,
    getOrdersStatisticsService
} from "@/services/getOrdersStatisticsService";
import { useQuery } from "@tanstack/react-query";

export const useOrdersStatistics = (filter: OrdersStatisticsFilter) => {
    return useQuery({
        queryKey: [
            "ordersStatistics",
            {
                ...filter
            }
        ],
        queryFn: () => getOrdersStatisticsService(filter)
    });
};
