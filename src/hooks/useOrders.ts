import {
  type OrdersFilter,
  getOrdersService,
  getRecevingAgentStores,
  getRepositoryOrders,
} from "@/services/getOrders";
import { useQuery } from "@tanstack/react-query";

export const useOrders = (
  filter: OrdersFilter = { page: 1, size: 10 },
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      "orders",
      {
        page: filter.page || 1,
        size: 10,
        ...filter,
      },
    ],
    queryFn: () =>
      getOrdersService({
        page: filter.page || 1,
        size: filter.size || 10,
        ...filter,
      }),
    enabled,
  });
};

export const useOrdersByAgent = (
  receivingAgentId?: string,
  clientId?: string,
  storeId?: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      "orders",
      {
        receivingAgentId,
        clientId,
        storeId,
      },
    ],
    queryFn: () => getRecevingAgentStores(receivingAgentId, clientId, storeId),
    enabled,
  });
};

export const useRepositoryOrders = (
  filter: OrdersFilter = { page: 1, size: 10 },
  enabled = true,
) => {
  return useQuery({
    queryKey: [
      "orders",
      {
        page: filter.page || 1,
        size: 10,
        ...filter,
      },
    ],
    queryFn: () =>
      getRepositoryOrders({
        page: filter.page || 1,
        size: filter.size || 10,
        ...filter,
      }),
    keepPreviousData: true,
    enabled,
  });
};
