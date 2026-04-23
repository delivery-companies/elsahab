// import { useBranches } from "@/hooks/useBranches";
import { useBranches } from "@/hooks/useBranches";
// import { useClients } from "@/hooks/useClients";
// import { useEmployees } from "@/hooks/useEmployees";
import { useRepositories } from "@/hooks/useRepositories";
import { useStores } from "@/hooks/useStores";
// import { useTenants } from "@/hooks/useTenants";
// import { convertDateFormat } from "@/lib/convertDate";
// import { withReportsDataOptions } from "@/lib/getReportParam";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { governorateArray } from "@/lib/governorateArabicNames ";
// import { repositoryEntriesStatuses } from "@/lib/repositoryEntriesStatuses";
import type { OrdersFilter } from "@/services/getOrders";
import { Accordion, Grid, Select } from "@mantine/core";

interface RepositoryEntriesFiltersProps {
  filters: OrdersFilter;
  setFilters: React.Dispatch<React.SetStateAction<OrdersFilter>>;
  search: string;
  setSearch: (newValue: string) => void;
  receiptError: string | null;
}

export const RepositoryEntriesFilters = ({
  filters,
  setFilters,
}: // search,
// setSearch,
// receiptError
RepositoryEntriesFiltersProps) => {
  const { data: repositoriesData } = useRepositories({
    size: 100000,
    minified: true,
  });

  const { data: branchesData } = useBranches({
    size: 100000,
    minified: true,
  });
  //   const { data: clientsData } = useClients({
  //     size: 100000,
  //     minified: true,
  //   });
  const { data: storesData } = useStores({
    size: 100000,
    minified: true,
  });

  return (
    <div>
      <Accordion variant="separated">
        <Accordion.Item className="rounded-md mb-8" value="orders-filter">
          <Accordion.Control> الفلاتر</Accordion.Control>
          <Accordion.Panel>
            <Grid gutter="lg">
              <Grid.Col span={{ md: 4, lg: 3, sm: 6, xs: 12 }}>
                <Select
                  data={getSelectOptions(repositoriesData?.data || [])}
                  searchable
                  clearable
                  placeholder="المخزن"
                  label="المخزن"
                  limit={100}
                  value={filters.repository_id}
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      repository_id: value,
                    });
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ md: 4, lg: 3, sm: 6, xs: 12 }}>
                <Select
                  searchable
                  label="المحافظة"
                  placeholder="اختار المحافظة"
                  limit={100}
                  data={governorateArray}
                  clearable
                  value={filters.governorate}
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      governorate: value || "",
                    });
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ md: 4, lg: 3, sm: 6, xs: 12 }}>
                <Select
                  data={getSelectOptions(branchesData?.data || [])}
                  searchable
                  clearable
                  placeholder="الفرع"
                  label="الفرع المرسل للطلبات"
                  limit={100}
                  value={filters.branch_id}
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      branch_id: value,
                    });
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ md: 4, lg: 3, sm: 6, xs: 12 }}>
                <Select
                  data={getSelectOptions(storesData?.data || [])}
                  searchable
                  clearable
                  placeholder="المتجر"
                  label="المتجر"
                  limit={100}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      store_id: e || "",
                    });
                  }}
                  value={filters.store_id}
                />
              </Grid.Col>
            </Grid>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};
