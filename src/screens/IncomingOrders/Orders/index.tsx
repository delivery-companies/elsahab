import type { OrdersFilter } from "@/services/getOrders";
import { Button, LoadingOverlay, Menu, rem, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { useRepositoryOrders } from "@/hooks/useOrders";
import { useAuth } from "@/store/authStore";
import { useRepositories } from "@/hooks/useRepositories";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { useCreateReportsDocumentation } from "@/hooks/useCreateRepoReportsDocumentation";
import { useOrdersStore } from "@/store/returnsStors";
import toast from "react-hot-toast";
import { RepositoryEntriesFilters } from "@/screens/RepostioryOrders/filters";
import { OrdersTable } from "@/screens/Orders/components/OrdersTable";
import { columns } from "./columns";
import { IconCircleArrowRight } from "@tabler/icons-react";

export const IncomingRepoOrders = ({
  repo,
  setRepo,
}: {
  repo?: string | null;
  setRepo: () => void;
}) => {
  const { repositoryId, role, branchId } = useAuth();
  const { orders: selectedOrders, deleteAllOrders } = useOrdersStore();
  const { mutateAsync: crateOrdersDocumentationPDF, isLoading: isloading } =
    useCreateReportsDocumentation();
  const [filters, setfilters] = useState<OrdersFilter>({
    page: 1,
    size: 10,
    pagesCount: 1,
    client_id: undefined,
    repository_id: role === "REPOSITORIY_EMPLOYEE" ? repositoryId : "0",
    to_repository_id: undefined,
    store_id: undefined,
    governorate: undefined,
    secondaryStatus: "IN_CAR",
    getIncoming: true,
  });

  useEffect(() => {
    deleteAllOrders();
  }, []);

  useEffect(() => {
    if (repo) {
      setfilters((f) => ({ ...f, to_repository_id: repo }));
    }
  }, [repo]);

  const { data: repositoriesData } = useRepositories({
    size: 100000,
    minified: true,
    branchId: branchId,
  });

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

      {role === "BRANCH_MANAGER" ? (
        <Select
          data={getSelectOptions(repositoriesData?.data || [])}
          style={{ maxWidth: "400px" }}
          searchable
          clearable
          placeholder="المخزن"
          label="المخزن"
          limit={100}
          value={filters.repository_id}
          onChange={(value) => {
            setfilters({
              ...filters,
              repository_id: value,
            });
          }}
        />
      ) : null}
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
