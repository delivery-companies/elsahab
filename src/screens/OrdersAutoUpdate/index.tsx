import { AppLayout } from "@/components/AppLayout";
import { useAutomaticUpdates } from "@/hooks/useAutomaticUpdates";
import type { Filters } from "@/services/getEmployeesService";
import { Grid, LoadingOverlay, Select } from "@mantine/core";
import { useState } from "react";
import { DataTable } from "../Employees/data-table";
import { columns } from "./columns";
import { AddAutomaticUpdateTimer } from "./components/AddAutomaticUpdateTimer";
import { useBranches } from "@/hooks/useBranches";
import { getSelectOptions } from "@/lib/getSelectOptions";

export const OrdersAutoUpdate = () => {
  const [branch, selectedBranch] = useState<string | null>(null);

  const [filters, setFilters] = useState<Filters>({
    page: 1,
    size: 10,
    branchId: branch || undefined,
  });
  const { data: automaticUpdatesData, isInitialLoading } =
    useAutomaticUpdates(filters);

  const {
    data: branches = {
      data: [],
    },
  } = useBranches({
    size: 100000,
    minified: true,
  });

  return (
    <AppLayout>
      <Grid align="center" gutter="lg" className="mb-4">
        <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
          <Select
            searchable
            value={branch}
            onChange={(e) => {
              selectedBranch(e);
              setFilters({
                page: 1,
                size: 10,
                branchId: e,
              });
            }}
            placeholder="اختر الفرع"
            limit={100}
            data={getSelectOptions(branches.data)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
          {branch ? <AddAutomaticUpdateTimer branchId={branch + ""} /> : null}
        </Grid.Col>
      </Grid>

      <div className="relative mt-12">
        <LoadingOverlay visible={isInitialLoading} />
        <DataTable
          navigationURL="/orders/add"
          columns={columns}
          data={filters.branchId ? automaticUpdatesData?.data || [] : []}
          setFilters={setFilters}
          filters={{
            ...filters,
            pagesCount: automaticUpdatesData?.pagesCount,
          }}
        />
      </div>
    </AppLayout>
  );
};
