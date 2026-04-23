import { useReports } from "@/hooks/useReports";
import { DataTable } from "@/screens/Employees/data-table";
import type { ReportsFilters } from "@/services/getReports";
import { LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import { ReportsFilter } from "./ReportsFilter";
// import { ReportsStatistics } from "../../ReportsStatistics";
import { ChangeReportsPaidStatus } from "./ChangeReportsPaidStatus";
// import { DeleteAllSelectedRepositoryOrders } from "./DeleteAllSelectedRepositoryReports";
import { columns } from "./columns";
import { AppLayout } from "@/components/AppLayout";

export const RepositoryReports = () => {
  const [filters, setFilters] = useState<ReportsFilters>({
    page: 1,
    size: 10,
    type: "REPOSITORY",
  });

  const { data: reports, isInitialLoading, isError } = useReports(filters);

  return (
    <>
      <AppLayout isLoading={isInitialLoading} isError={isError}>
        <div className="mb-4 flex items-center gap-4">
          {/* <DeleteAllSelectedRepositoryOrders /> */}
          <ChangeReportsPaidStatus />
        </div>
        <ReportsFilter filters={filters} setFilters={setFilters} />
        {/* <ReportsStatistics reportsMetaData={reports?.data?.reportsMetaData} /> */}
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
      </AppLayout>
    </>
  );
};
