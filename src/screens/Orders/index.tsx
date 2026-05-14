import { AppLayout } from "@/components/AppLayout";
import { useOrders } from "@/hooks/useOrders";
import type { OrdersFilter, OrdersMetaData } from "@/services/getOrders";
import { useAuth } from "@/store/authStore";
import { LoadingOverlay } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { columns } from "./columns";
import { CustomOrdersFilter } from "./components/OrdersFilter";
import { OrdersStatistics } from "./components/OrdersStatistics";
import { OrdersTable } from "./components/OrdersTable";
import { useOrdersStore } from "@/store/ordersStore";
import { clientColumns } from "./clientColums";

export const ordersFilterInitialState: OrdersFilter = {
  order_id: "",
  page: 1,
  size: 10,
  client_id: "",
  delivery_agent_id: "",
  delivery_date: null,
  delivery_end_date: "",
  delivery_start_date: "",
  delivery_type: "",
  end_date: "",
  governorate: "",
  location_id: "",
  pagesCount: 0,
  product_id: "",
  receipt_number: "",
  recipient_address: "",
  recipient_name: "",
  recipient_phone: "",
  search: "",
  sort: "",
  start_date: "",
  statuses: [],
  status: "",
  store_id: "",
  branch_id: "",
  automatic_update_id: "",
  minified: false,
  confirmed: true,
  branch_report: "0",
  client_report: "0",
  company_report: "0",
  delivery_agent_report: "0",
  governorate_report: "0",
  repository_report: "0",
  processingStatus: "",
  forwarded_by_id: undefined,
};

interface OrdersSearchParameters {
  delivery_agent_id: string;
  orders_end_date: string;
  orders_start_date: string;
  delivery_end_date: string;
  delivery_start_date: string;
  branch_id: string;
  automatic_update_id: string;
}

export const OrdersScreen = () => {
  const { role } = useAuth();
  const location = useLocation();
  const [filters, setFilters] = useState<OrdersFilter>({
    ...ordersFilterInitialState,
    branch_report: undefined,
    client_report: undefined,
    company_report: undefined,
    delivery_agent_report: undefined,
    governorate_report: undefined,
    repository_report: undefined,
    processingStatus: undefined,
  });

  const [search, setSearch] = useDebouncedState("", 300);

  const locationState = location.state as OrdersSearchParameters;

  const { orders: selectedOrders } = useOrdersStore();

  useEffect(() => {
    if (locationState?.delivery_agent_id) {
      setFilters((prev) => ({
        ...prev,
        delivery_agent_id: locationState?.delivery_agent_id,
      }));
    }
    if (locationState?.delivery_end_date) {
      setFilters((prev) => ({
        ...prev,
        delivery_end_date: locationState?.delivery_end_date,
      }));
    }
    if (locationState?.delivery_start_date) {
      setFilters((prev) => ({
        ...prev,
        delivery_start_date: locationState?.delivery_start_date,
      }));
    }
    if (locationState?.automatic_update_id) {
      setFilters((prev) => ({
        ...prev,
        automatic_update_id: locationState?.automatic_update_id,
      }));
    }
  }, [
    locationState?.delivery_agent_id,
    locationState?.delivery_end_date,
    locationState?.delivery_start_date,
    locationState?.automatic_update_id,
  ]);

  // const [receiptError, setReceiptError] = useState<string | null>(null);

  const {
    data: orders = {
      data: {
        orders: [],
        ordersMetaData: {} as OrdersMetaData,
      },
      pagesCount: 0,
    },
    isError,
    isInitialLoading,
  } = useOrders({
    ...filters,
    search,
  });

  return (
    <AppLayout isError={isError}>
      {selectedOrders.length ? (
        <p
          style={{
            marginBottom: "10px",
          }}>{`تم تحديد ${selectedOrders.length} طلب`}</p>
      ) : (
        ""
      )}
      <CustomOrdersFilter
        filters={filters}
        search={search}
        setFilters={setFilters}
        currentPageOrdersIDs={orders.data.orders.map((order) => order.id)}
        setSearch={setSearch}
        // receiptError={receiptError}
      />
      <div className="relative mt-12">
        <LoadingOverlay visible={isInitialLoading} />
        {role === "ACCOUNT_MANAGER" || role === "COMPANY_MANAGER" ? (
          <OrdersStatistics ordersMetaData={orders.data.ordersMetaData} />
        ) : null}
        <OrdersTable
          navigationURL={
            // eslint-disable-next-line no-nested-ternary
            role === "CLIENT"
              ? "/orders-bulk-create"
              : role !== "ADMIN_ASSISTANT" && role !== "ADMIN"
              ? "/orders-bulk-create"
              : ""
          }
          columns={
            role !== "CLIENT" && role !== "CLIENT_ASSISTANT"
              ? columns
              : clientColumns
          }
          data={orders.data.orders}
          setFilters={setFilters}
          filters={{
            ...filters,
            pagesCount: orders.pagesCount,
          }}
        />
      </div>
    </AppLayout>
  );
};
