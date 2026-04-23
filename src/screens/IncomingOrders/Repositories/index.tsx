import type { OrdersFilter } from "@/services/getOrders";
import { LoadingOverlay, Select } from "@mantine/core";
import { useEffect, useState } from "react";
import { useAuth } from "@/store/authStore";
import { useRepositories } from "@/hooks/useRepositories";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { useOrdersStore } from "@/store/returnsStors";
import { columns } from "./columns";
import { DataTable } from "@/screens/Employees/data-table";
import { useRepositoryOrdersStatistics } from "@/hooks/useRepoOrdersStatistics";

export const IncomingOrdersStatistics = () => {
  const { repositoryId, role, branchId } = useAuth();
  const { deleteAllOrders } = useOrdersStore();

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

  const { data: repositoriesData } = useRepositories({
    size: 100000,
    minified: true,
    branchId,
  });

  const {
    data: repositories = {
      data: [],
    },
    isLoading,
  } = useRepositoryOrdersStatistics(filters);

  return (
    <>
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
