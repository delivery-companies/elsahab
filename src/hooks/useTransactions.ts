import { OrdersFilter } from "@/services/getOrders";
import {
  CompanyNetFilters,
  getCompanyNetReportsService,
  getRecevingAgentClientService,
  getTransactionsService,
  getTransactionsStatistics,
} from "@/services/getTransactionsService";
import { useQuery } from "@tanstack/react-query";

export function useTransactions(filter: OrdersFilter = { page: 1, size: 10 }) {
  return useQuery({
    queryKey: [
      "transactions",
      {
        page: filter.page || 1,
        size: 10,
        ...filter,
      },
    ],
    queryFn: () =>
      getTransactionsService({
        page: filter.page || 1,
        size: filter.size || 10,
        ...filter,
      }),
  });
}

export function useTransactionsStatistics(
  filter: OrdersFilter = { page: 1, size: 10 },
) {
  return useQuery({
    queryKey: [
      "allStatistics2",
      {
        page: filter.page || 1,
        size: 10,
        ...filter,
      },
    ],
    queryFn: () =>
      getTransactionsStatistics({
        page: filter.page || 1,
        size: filter.size || 10,
        ...filter,
      }),
  });
}

export function useRecevingAgentClients(
  filter: OrdersFilter = { page: 1, size: 10 },
  enabled = true,
) {
  return useQuery({
    queryKey: [
      "receiving-clients",
      {
        ...filter,
      },
    ],
    queryFn: () =>
      getRecevingAgentClientService({
        ...filter,
      }),
    enabled,
  });
}
export function useCompanyNetReports(
  { page = 1, size = 10 }: CompanyNetFilters = { page: 1, size: 10 },
) {
  return useQuery({
    queryKey: ["companyNetReports", { page, size }],
    queryFn: () => getCompanyNetReportsService({ page, size }),
  });
}
