import { AppLayout } from "@/components/AppLayout";
import type { ReportsFilters } from "@/services/getReports";
import { LoadingOverlay, Text } from "@mantine/core";
import { useState } from "react";
import { DataTable } from "../Employees/data-table";
import { columns } from "./columns";
import { useCompanyNetReports } from "@/hooks/useTransactions";

export const WalletsScreen = () => {
  const [filters, setFilters] = useState<ReportsFilters>({
    page: 1,
    size: 10,
  });

  const { data, isLoading, isError } = useCompanyNetReports({
    page: filters.page,
    size: filters.size,
  });

  return (
    <AppLayout isError={isError}>
      {/* <TreasuryFilters filters={filters} setFilters={setFilters} /> */}

      <div className="relative">
        <LoadingOverlay visible={isLoading} />
        <div className="flex justify-between ">
          <Text c="green" size="xl" tt="uppercase" fw={700} mt={25}>
            الصناديق الماليه للموظفين
          </Text>
        </div>
        <DataTable
          data={data?.data || []}
          columns={columns}
          filters={{
            ...filters,
            pagesCount: data?.pagesCount,
          }}
          setFilters={setFilters}
        />
      </div>
    </AppLayout>
  );
};
