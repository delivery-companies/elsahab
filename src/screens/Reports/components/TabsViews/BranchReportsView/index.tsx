import { useOrders } from "@/hooks/useOrders";
import { useReports } from "@/hooks/useReports";
import { initialReportOrderStatuses } from "@/lib/transformOrdersFilterToMatchReportParams";
import { DataTable } from "@/screens/Employees/data-table";
import { ordersFilterInitialState } from "@/screens/Orders";
import { OrdersTable } from "@/screens/Orders/components/OrdersTable";
import type { OrdersFilter, OrdersMetaData } from "@/services/getOrders";
import type { ReportsFilters } from "@/services/getReports";
import { Divider, LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import { ReportsStatistics } from "../../ReportsStatistics";
import { reportsOrdersColumns } from "../reportsOrdersColumns";
import { BranchOrdersFilters } from "./BranchOrdersFilters";
import { BranchesOrdersStatistics } from "./BranchesOrdersStatistics";
import { columns } from "./columns";

export const BranchReportsView = () => {
  const [ordersFilter, setOrdersFilter] = useState<OrdersFilter>({
    ...ordersFilterInitialState,
    branch_report: "0",
    client_report: undefined,
    delivery_agent_report: undefined,
    governorate_report: undefined,
    repository_report: undefined,
    company_report: undefined,
    delivered: undefined,
  });
  const [filters, setFilters] = useState<ReportsFilters>({
    page: 1,
    size: 10,
    type: "BRANCH",
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
      ...ordersFilter,
      statuses: ordersFilter.statuses?.length
        ? ordersFilter.statuses
        : initialReportOrderStatuses,
    },
    !!ordersFilter.branch_id && !!ordersFilter.orderType
  );

  return (
    <>
      <BranchOrdersFilters
        ordersFilters={ordersFilter}
        setOrdersFilters={setOrdersFilter}
        reportsFilters={filters}
        setReportsFilters={setFilters}
      />
      <div className="relative mt-12 mb-12">
        <p className="text-center -mb-5 md:text-3xl text-2xl">الطلبات</p>
        <LoadingOverlay visible={isOrdersInitialLoading} />
        <OrdersTable
          columns={reportsOrdersColumns}
          data={orders.data.orders}
          setFilters={setOrdersFilter}
          filters={{
            ...ordersFilter,
            pagesCount: orders.pagesCount,
          }}
        />
        <BranchesOrdersStatistics
          branchId={ordersFilter.branch_id || ""}
          ordersMetaData={orders.data.ordersMetaData}
          ordersLength={orders.data.orders.length}
          ordersParams={ordersFilter}
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
