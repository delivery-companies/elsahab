import {
  type OrdersFilter,
  getRepositoryOrdersStatistics,
} from "@/services/getOrders";
import { useQuery } from "@tanstack/react-query";

export const useRepositoryOrdersStatistics = (
  filter: OrdersFilter = { page: 1, size: 10 },
  enabled = true
) => {
  return useQuery({
    queryKey: [
      "repo-orders-statistics",
      {
        page: filter.page || 1,
        size: 10,
        ...filter,
      },
    ],
    queryFn: () =>
      getRepositoryOrdersStatistics({
        page: filter.page || 1,
        size: filter.size || 10,
        ...filter,
      }),
    enabled,
  });
};
