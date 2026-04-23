import { AppLayout } from "@/components/AppLayout";
// import { useCreateReport } from "@/hooks/useCreateReport";
// import { useCreateReportsDocumentation } from "@/hooks/useCreateReportsDocumentation";
import { useRepositoryOrders } from "@/hooks/useOrders";
import type { OrdersFilter } from "@/services/getOrders";
// import { useRepositoryOrdersStore } from "@/store/repositoryEntriesOrders";
import { Button, LoadingOverlay, Menu, rem } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
import { DataTable } from "../Employees/data-table";
// import { ChangeOrdersRepositories } from "./components/ChangeOrdersRepositories";
// import { DeleteSelectedRepositoryEntriesModal } from "./components/DeleteSelectedRepositoryEntriesModal";
import { RepositoryEntriesFilters } from "./components/RepositoryEntriesFilters";
import { SendOrderToRepository } from "./components/SendOrderToRepository";
import { columns } from "./components/columns";
import { useOrdersStore } from "@/store/returnsStors";
import { useCreateReportsDocumentation } from "@/hooks/useCreateRepoReportsDocumentation";
import toast from "react-hot-toast";

// const repositoryEntriesInitialStatuses = ["RETURNED", "PARTIALLY_RETURNED", "REPLACED"];

export const RepositoryEntries = () => {
  // const { deleteAllRepositoryOrders, repositoryOrders } = useRepositoryOrdersStore();
  const { orders: selectedOrders, deleteAllOrders } = useOrdersStore();
  const { mutateAsync: crateOrdersDocumentationPDF, isLoading } =
    useCreateReportsDocumentation();

  useEffect(() => {
    deleteAllOrders();
  }, []);

  const [filters, setFilters] = useState<OrdersFilter>({
    page: 1,
    size: 10,
    pagesCount: 1,
    client_id: undefined,
    repository_id: undefined,
    store_id: undefined,
    governorate: undefined,
    secondaryStatus: "IN_REPOSITORY",
    status: "RETURNED",
  });

  const [search, setSearch] = useDebouncedState("", 300);

  const {
    data: orders = {
      data: {
        orders: [],
      },
      pagesCount: 0,
    },
    isInitialLoading,
    isError,
  } = useRepositoryOrders(filters);

  const [receiptError] = useState<string | null>(null);

  const handleCreateOrdersDocumentationForSelectedOrders = () => {
    const selectedReportsIDs = selectedOrders.map((order) => order.id);
    toast.promise(
      crateOrdersDocumentationPDF(
        {
          ordersIDs: selectedReportsIDs,
          type: "GENERAL",
          params: filters,
        },
        {
          onSuccess: () => {
            deleteAllOrders();
          },
        }
      ),
      {
        loading: "جاري تحميل تقرير...",
        success: "تم تحميل تقرير بنجاح",
        error: (error) => error.message || "حدث خطأ ما",
      }
    );
  };

  const handleExportCurrentPage = () => {
    if (!orders.data.orders) return;
    toast.promise(
      crateOrdersDocumentationPDF({
        ordersIDs: orders.data.orders.map((o) => o.id),
        type: "GENERAL",
        params: filters,
      }),
      {
        loading: "جاري تحميل تقرير...",
        success: "تم تحميل تقرير بنجاح",
        error: (error) => error.message || "حدث خطأ ما",
      }
    );
  };

  const handleExportAll = () => {
    toast.promise(
      crateOrdersDocumentationPDF({
        ordersIDs: "*",
        type: "GENERAL",
        params: filters || {},
      }),
      {
        loading: "جاري تحميل تقرير بكل الطلبات",
        success: "تم تحميل تقرير بكل الطلبات بنجاح",
        error: (error) => error.message || "حدث خطأ ما",
      }
    );
  };

  return (
    <AppLayout isError={isError}>
      {/* <div className="flex items-center mb-6 gap-2 flex-wrap">
        <h1
          style={{ color: "#e72722", textAlign: "center", fontWeight: "bold" }}>
          ادخال الطلبات الراجعه اللى المخزن
        </h1>
      </div> */}
      <div className="mb-3">
        <Menu shadow="md" width={rem(180)}>
          <Menu.Target>
            <Button style={{ flexGrow: "1", maxWidth: "250px" }}>
              انشاء تقارير
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>اختار النوع</Menu.Label>
            <Menu.Item disabled={isLoading} onClick={handleExportAll}>
              تصدير الكل{" "}
            </Menu.Item>
            <Menu.Item
              disabled={orders.data.orders?.length === 0 || isLoading}
              onClick={handleExportCurrentPage}>
              تصدير الصفحة الحالية
            </Menu.Item>
            <Menu.Item
              disabled={selectedOrders.length === 0 || isLoading}
              onClick={handleCreateOrdersDocumentationForSelectedOrders}>
              تصدير الصفوف المحددة
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <RepositoryEntriesFilters
        filters={filters}
        setFilters={setFilters}
        search={search}
        setSearch={setSearch}
        receiptError={receiptError}
      />
      <SendOrderToRepository />
      <div className="relative mt-12">
        <LoadingOverlay visible={isInitialLoading} />
        <DataTable
          filters={{
            ...filters,
            pagesCount: orders.pagesCount,
          }}
          setFilters={setFilters}
          data={orders.data.orders}
          columns={columns}
        />
      </div>
    </AppLayout>
  );
};
