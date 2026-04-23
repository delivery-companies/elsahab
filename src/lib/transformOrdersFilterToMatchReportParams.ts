import type { OrdersFilter } from "@/services/getOrders";

export const initialReportOrderStatuses = [
  "DELIVERED",
  "PARTIALLY_RETURNED",
  "REPLACED",
];

export const repositoryReportsOrderStatuses = [
  "PARTIALLY_RETURNED",
  "REPLACED",
  "RETURNED",
];

export const transformOrdersFilterToMatchReportParams = (
  ordersFilter: OrdersFilter,
  statuses = initialReportOrderStatuses
): OrdersFilter => {
  return {
    ...ordersFilter,
    statuses: ordersFilter.statuses?.length ? ordersFilter.statuses : statuses,
  };
};
