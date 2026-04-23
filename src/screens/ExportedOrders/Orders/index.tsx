import type { OrdersFilter } from "@/services/getOrders";
import { Button, LoadingOverlay, Menu, rem } from "@mantine/core";
import { useEffect, useState } from "react";
import { useRepositoryOrders } from "@/hooks/useOrders";
import { useCreateReportsDocumentation } from "@/hooks/useCreateRepoReportsDocumentation";
import { useOrdersStore } from "@/store/returnsStors";
import toast from "react-hot-toast";
import { RepositoryEntriesFilters } from "@/screens/RepostioryOrders/filters";
import { OrdersTable } from "@/screens/Orders/components/OrdersTable";
import { columns } from "./columns";
import { IconCircleArrowRight } from "@tabler/icons-react";
// import { useNavigate } from "react-router-dom";

export const Orders = ({
  repo,
  setRepo,
}: {
  repo?: string | null;
  setRepo: () => void;
}) => {
  const { orders: selectedOrders, deleteAllOrders } = useOrdersStore();

  const { mutateAsync: crateOrdersDocumentationPDF, isLoading: isloading } =
    useCreateReportsDocumentation();

  // const navigate = useNavigate();

  const [filters, setfilters] = useState<OrdersFilter>({
    client_id: undefined,
    repository_id: undefined,
    store_id: undefined,
    governorate: undefined,
    secondaryStatus: "IN_CAR",
    getOutComing: true,
    to_repository_id: undefined,
    type: "forwarded",
  });

  useEffect(() => {
    deleteAllOrders();
  }, []);

  useEffect(() => {
    if (repo) {
      setfilters((f) => ({ ...f, to_repository_id: repo }));
    }
  }, [repo]);

  const {
    data: orders = {
      data: {
        orders: [],
      },
      pagesCount: 0,
    },
    isFetching,
  } = useRepositoryOrders(filters);

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
        },
      ),
      {
        loading: "جاري تحميل تقرير...",
        success: "تم تحميل تقرير بنجاح",
        error: (error) => error.message || "حدث خطأ ما",
      },
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
      },
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
      },
    );
  };

  return (
    <>
      <div className="mb-3 flex items-center">
        {repo ? (
          <IconCircleArrowRight
            onClick={() => {
              setRepo();
            }}
            size={30}
            color="green"
            cursor={"pointer"}
            strokeWidth={2}
            className="ml-3"
          />
        ) : null}
        <Menu shadow="md" width={rem(180)}>
          <Menu.Target>
            <Button style={{ flexGrow: "1", maxWidth: "250px" }}>
              انشاء تقارير
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>اختار النوع</Menu.Label>
            <Menu.Item disabled={isloading} onClick={handleExportAll}>
              تصدير الكل
            </Menu.Item>
            <Menu.Item
              disabled={orders.data.orders?.length === 0 || isloading}
              onClick={handleExportCurrentPage}>
              تصدير الصفحة الحالية
            </Menu.Item>
            <Menu.Item
              disabled={selectedOrders.length === 0 || isloading}
              onClick={handleCreateOrdersDocumentationForSelectedOrders}>
              تصدير الصفوف المحددة
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>

      <RepositoryEntriesFilters filters={filters} setFilters={setfilters} />

      <div className="relative mt-12">
        <LoadingOverlay visible={isFetching} />
        <OrdersTable
          key={orders.data.orders.length}
          setFilters={setfilters}
          filters={{
            ...filters,
            pagesCount: orders.pagesCount,
          }}
          data={orders.data.orders}
          columns={columns}
        />
      </div>
    </>
  );
};
