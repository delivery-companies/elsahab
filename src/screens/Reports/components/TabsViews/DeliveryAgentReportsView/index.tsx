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
import { DeliveryAgentOrdersFilter } from "./DeliveryAgentOrders";
import { DeliveryAgentStatistics } from "./DeliveryAgentStatistics";
import { columns } from "./columns";

export const DeliveryAgentReportsView = () => {
  const [ordersFilter, setOrdersFilter] = useState<OrdersFilter>({
    ...ordersFilterInitialState,
    delivery_agent_report: "0",
    branch_report: undefined,
    client_report: undefined,
    governorate_report: undefined,
    repository_report: undefined,
    company_report: undefined,
  });
  const [filters, setFilters] = useState<ReportsFilters>({
    page: 1,
    size: 10,
    type: "DELIVERY_AGENT",
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
    !!ordersFilter.delivery_agent_id
  );
  return (
    <>
      <DeliveryAgentOrdersFilter
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
        <DeliveryAgentStatistics
          deliveryAgentID={ordersFilter.delivery_agent_id || ""}
          ordersLength={orders.data.orders.length}
          ordersParams={ordersFilter}
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
