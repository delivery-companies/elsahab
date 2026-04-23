import { useOrdersByAgent } from "@/hooks/useOrders";
import { useReports } from "@/hooks/useReports";
// import { initialReportOrderStatuses } from "@/lib/transformOrdersFilterToMatchReportParams";
import { DataTable } from "@/screens/Employees/data-table";
import { ordersFilterInitialState } from "@/screens/Orders";
// import { OrdersTable } from "@/screens/Orders/components/OrdersTable";
import type { OrdersFilter } from "@/services/getOrders";
import type { ReportsFilters } from "@/services/getReports";
import { Divider, LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import { ReportsStatistics } from "../../ReportsStatistics";
// import { reportsOrdersColumns } from "../reportsOrdersColumns";
import { ClientOrdersFilter } from "./ClientOrders";
import { ClientOrdersStatistics } from "./ClientOrdersStatistics";
import { columns } from "./columns";
import { StoresColumns } from "./StoresColumns";
import { RowSelectionState } from "@tanstack/react-table";

export const ClientReportsView = () => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [ordersFilter, setOrdersFilter] = useState<OrdersFilter>({
    ...ordersFilterInitialState,
    client_report: "0",
    governorate_report: undefined,
    branch_report: undefined,
    delivery_agent_report: undefined,
    repository_report: undefined,
    company_report: undefined,
    delivered: true,
  });

  const [reportsFilter, setReportFilters] = useState<ReportsFilters>({
    page: 1,
    size: 10,
    type: "CLIENT",
  });

  const { data: reports, isInitialLoading: isReportsInitialLoading } =
    useReports(reportsFilter);

  const {
    data: stores = {
      data: [],
    },
    isInitialLoading: storesLoading,
  } = useOrdersByAgent(
    ordersFilter.delivery_agent_id,
    ordersFilter.client_id,
    ordersFilter.store_id,
    !!ordersFilter.delivery_agent_id ||
      !!ordersFilter.client_id ||
      !!ordersFilter.store_id
  );

  return (
    <>
      <ClientOrdersFilter
        ordersFilters={ordersFilter}
        setOrdersFilters={setOrdersFilter}
        reportsFilters={reportsFilter}
        setReportsFilters={setReportFilters}
      />
      <div className="relative mt-12 mb-12">
        <p className="text-center -mb-5 md:text-3xl text-2xl">الطلبات</p>
        <LoadingOverlay visible={storesLoading} />
        <DataTable
          columns={StoresColumns}
          data={stores.data}
          setFilters={setOrdersFilter}
          filters={{
            ...ordersFilter,
            pagesCount: 1,
            size: 500,
          }}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
        <ClientOrdersStatistics
          storeID={ordersFilter.store_id || ""}
          // ordersMetaData={orders.data.ordersMetaData}
          stores={stores.data}
          selectedStores={rowSelection}
          ordersLength={stores.data.length}
          ordersParams={ordersFilter}
        />
      </div>
      <Divider my="md" size="md" color="red" />
      <Divider my="md" size="md" color="red" />
      {/* <ReportsFilter filters={reportsFilter} setFilters={setReportFilters} /> */}
      <ReportsStatistics
        params={reportsFilter}
        currentPageReportsIDs={
          reports?.data?.reports.map((report) => report.id) || []
        }
        reportsMetaData={reports?.data?.reportsMetaData}
        tapType="CLIENT"
      />
      <div className="relative mt-7">
        <LoadingOverlay visible={isReportsInitialLoading} />
        <DataTable
          data={reports?.data?.reports || []}
          columns={columns}
          filters={{
            ...reportsFilter,
            pagesCount: reports?.pagesCount || 0,
          }}
          setFilters={setReportFilters}
        />
      </div>
    </>
  );
};
