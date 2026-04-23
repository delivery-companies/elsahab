import type { OrdersFilter } from "@/services/getOrders";
import { LoadingOverlay } from "@mantine/core";
import { useEffect, useState } from "react";
import { useOrdersStore } from "@/store/returnsStors";
import { columns } from "./columns";
import { DataTable } from "@/screens/Employees/data-table";
import { useRepositoryOrdersStatistics } from "@/hooks/useRepoOrdersStatistics";

export const IncomingOrdersStatistics = () => {
  const { deleteAllOrders } = useOrdersStore();

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

  const {
    data: repositories = {
      data: [],
    },
    isLoading,
  } = useRepositoryOrdersStatistics(filters);

  return (
    <>
      <div className="relative mt-12">
        <LoadingOverlay visible={isLoading} />
        <DataTable
          key={repositories.data.length}
          setFilters={setfilters}
          filters={{
            ...filters,
            pagesCount: 1,
          }}
          data={repositories.data}
          columns={columns}
        />
      </div>
    </>
  );
};
