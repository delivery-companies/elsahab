import { useOrders } from "@/hooks/useOrders";
import { useReports } from "@/hooks/useReports";
import type { governorateArabicNames } from "@/lib/governorateArabicNames ";
import { initialReportOrderStatuses } from "@/lib/transformOrdersFilterToMatchReportParams";
import { DataTable } from "@/screens/Employees/data-table";
import { ordersFilterInitialState } from "@/screens/Orders";
import type { OrdersFilter, OrdersMetaData } from "@/services/getOrders";
import type { ReportsFilters } from "@/services/getReports";
import { Divider, LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import { ReportsStatistics } from "../../ReportsStatistics";
import { reportsOrdersColumns } from "../reportsOrdersColumns";
import { GovernorateOrdersFilters } from "./GovernorateOrders";
import { GovernorateOrdersStatistics } from "./GovernorateOrdersStatistics";
import { columns } from "./columns";

export const GovernorateReportsView = () => {
  const [governorateFilter, setGovernorateFilter] = useState<OrdersFilter>({
    ...ordersFilterInitialState,
    governorate_report: "0",
    branch_report: undefined,
    client_report: undefined,
    delivery_agent_report: undefined,
    repository_report: undefined,
    company_report: undefined,
    sort: "branchId",
  });
  const [filters, setFilters] = useState<ReportsFilters>({
    page: 1,
    size: 10,
    type: "GOVERNORATE",
  });
  const { data: reports, isInitialLoading } = useReports(filters);

  const {
    data: orders = {
      data: {
        orders: [],
        ordersMetaData: {} as OrdersMetaData,
      },
      pagesCount: 0,
    },
    isInitialLoading: isOrdersInitialLoading,
  } = useOrders(
    {
      ...governorateFilter,
      statuses: governorateFilter.statuses?.length
        ? governorateFilter.statuses
        : initialReportOrderStatuses,
    },
    !!governorateFilter.governorate
  );

  return (
    <>
      <GovernorateOrdersFilters
        governorateFilter={governorateFilter}
        setGovernorateFilter={setGovernorateFilter}
        reportsFilters={filters}
        setReportsFilters={setFilters}
      />
      <div className="relative mt-12 mb-12">
        <p className="text-center -mb-5 md:text-3xl text-2xl">الطلبات</p>
        <LoadingOverlay visible={isOrdersInitialLoading} />
        <DataTable
          columns={reportsOrdersColumns}
          data={orders.data.orders}
          setFilters={setGovernorateFilter}
          filters={{
            ...setGovernorateFilter,
            pagesCount: governorateFilter.pagesCount,
          }}
        />
        <GovernorateOrdersStatistics
          governorate={
            governorateFilter.governorate as keyof typeof governorateArabicNames
          }
          ordersLength={orders.data.orders.length}
          ordersParams={governorateFilter}
          ordersMetaData={orders.data.ordersMetaData}
        />
      </div>
      <Divider my="md" size="md" color="red" />
      <Divider my="md" size="md" color="red" />
      <ReportsStatistics reportsMetaData={reports?.data?.reportsMetaData} />
      <div className="relative mt-12">
        <LoadingOverlay visible={isInitialLoading} />
        <DataTable
          data={reports?.data?.reports || []}
          columns={columns}
          filters={{
            ...filters,
            pagesCount: reports?.pagesCount || 0,
          }}
          setFilters={setFilters}
        />
      </div>
    </>
  );
};
