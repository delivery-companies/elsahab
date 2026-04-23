import { AppLayout } from "@/components/AppLayout";
import { useStores } from "@/hooks/useStores";
import type { Filters } from "@/services/getEmployeesService";
import { useAuth } from "@/store/authStore";
import { useState } from "react";
import { DataTable } from "../Employees/data-table";
import { columns } from "./columns";
import {
  Accordion,
  Grid,
  LoadingOverlay,
  Select,
  TextInput,
} from "@mantine/core";
import { useClients } from "@/hooks/useClients";
import { getSelectOptions } from "@/lib/getSelectOptions";

export const Stores = () => {
  const { role } = useAuth();
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    size: 10,
  });

  const {
    data: sizes = {
      data: [],
      pagesCount: 0,
      page: 1,
    },
    isLoading,
    isError,
  } = useStores(filters);

  const {
    data: clientsData = {
      data: [],
    },
  } = useClients({ size: 100000, minified: true });

  return (
    <AppLayout isError={isError}>
      <LoadingOverlay visible={isLoading} />
      <Accordion variant="separated">
        <Accordion.Item className="rounded-md mb-8" value="orders-filter">
          <Accordion.Control> الفلاتر </Accordion.Control>
          <Accordion.Panel>
            <Grid align="center" gutter="lg">
              <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                <TextInput
                  placeholder="بحث بالاسم"
                  value={filters.name || ""}
                  label="بحث"
                  onChange={(e) => {
                    setFilters((pre) => ({ ...pre, name: e.target.value }));
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 3, sm: 12, xs: 12 }}>
                <Select
                  value={filters.client_id || null}
                  allowDeselect
                  label="العملاء"
                  searchable
                  clearable
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      client_id: e || "",
                    });
                  }}
                  placeholder="اختر العميل"
                  data={getSelectOptions(clientsData.data)}
                  limit={100}
                />
              </Grid.Col>
            </Grid>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <DataTable
        data={sizes.data}
        navigationURL={
          role !== "ADMIN_ASSISTANT" &&
          role !== "ADMIN" &&
          role !== "CLIENT" &&
          role !== "CLIENT_ASSISTANT"
            ? "/stores/add"
            : ""
        }
        columns={columns}
        filters={{
          ...filters,
          pagesCount: sizes.pagesCount,
        }}
        setFilters={setFilters}
        navButtonTitle="إضافة متجر"
      />
    </AppLayout>
  );
};
