import { useReports } from "@/hooks/useReports";
import { DataTable } from "@/screens/Employees/data-table";
import type { ReportsFilters } from "@/services/getReports";
import { LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import { columns } from "./columns";
import { ReportsFilter } from "./ReportsFilter";
import { IconCircleArrowRight } from "@tabler/icons-react";

export const RepositoryReports = ({
  repo,
  setRepo,
}: {
  repo?: string | null;
  setRepo: () => void;
}) => {
  const [filters, setFilters] = useState<ReportsFilters>({
    page: 1,
    size: 10,
    type: "REPOSITORY",
    exported_repository_id: repo || undefined,
  });

  const { data: reports, isInitialLoading } = useReports(filters);

  return (
    <>
      {repo ? (
        <IconCircleArrowRight
          onClick={() => {
            setRepo();
          }}
          size={30}
          color="green"
          cursor={"pointer"}
          strokeWidth={2}
          className="ml-3 mb-5"
        />
      ) : null}
      <ReportsFilter filters={filters} setFilters={setFilters} />
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
