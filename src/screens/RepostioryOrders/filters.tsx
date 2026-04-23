import { useClients } from "@/hooks/useClients";
import { useRepositories } from "@/hooks/useRepositories";
import { useStores } from "@/hooks/useStores";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { governorateArray } from "@/lib/governorateArabicNames ";
import type { OrdersFilter } from "@/services/getOrders";
import { useAuth } from "@/store/authStore";
import { Accordion, Grid, Select } from "@mantine/core";

interface RepositoryEntriesFiltersProps {
  filters: OrdersFilter;
  setFilters: React.Dispatch<React.SetStateAction<OrdersFilter>>;
}

export const RepositoryEntriesFilters = ({
  filters,
  setFilters,
}: RepositoryEntriesFiltersProps) => {
  const { mainRepository, type } = useAuth();
  const { data: clientsData } = useClients({
    size: 100000,
    minified: true,
  });
  const { data: storesData } = useStores({
    size: 100000,
    client_id: filters.client_id,
    minified: true,
  });

  const { data: repositoriesData } = useRepositories({
    size: 100000,
    minified: true,
    type,
  });

  return (
    <div>
      <Accordion variant="separated">
        <Accordion.Item className="rounded-md mb-8" value="orders-filter">
          <Accordion.Control> الفلاتر</Accordion.Control>
          <Accordion.Panel>
            <Grid gutter="lg">
              {mainRepository ? (
                <Grid.Col span={{ md: 4, lg: 3, sm: 6, xs: 12 }}>
                  <Select
                    data={getSelectOptions(repositoriesData?.data || [])}
                    style={{ maxWidth: "400px" }}
                    searchable
                    clearable
                    placeholder="المخزن"
                    label="المخزن"
                    limit={100}
                    value={filters.to_repository_id}
                    onChange={(value) => {
                      setFilters({
                        ...filters,
                        to_repository_id: value,
                      });
                    }}
                  />
                </Grid.Col>
              ) : null}
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
                  data={getSelectOptions(clientsData?.data || [])}
                  searchable
                  clearable
                  placeholder="العميل"
                  label="العميل"
                  limit={100}
                  value={filters.client_id}
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      client_id: value || "",
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
