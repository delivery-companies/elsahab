import { AppLayout } from "@/components/AppLayout";
import { useBranches } from "@/hooks/useBranches";
import { type EmployeesFilters, useEmployees } from "@/hooks/useEmployees";
import { useLocations } from "@/hooks/useLocations";
import { getSelectOptions } from "@/lib/getSelectOptions";
import {
  clientAssistantPermissionsArray,
  type permissionsArabicNames,
  permissionsArray,
} from "@/lib/persmissionArabicNames";
import {
  type rolesArabicNames,
  rolesArray,
  branchRolesArray,
} from "@/lib/rolesArabicNames";
import {
  Accordion,
  Grid,
  LoadingOverlay,
  MultiSelect,
  Select,
  TextInput,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useAuth } from "@/store/authStore";
import { clientAssistantColumns } from "./clientAssistantColumns";

export const Employees = () => {
  const { role } = useAuth();
  const [name, setName] = useDebouncedState("", 300);
  const [phone, setPhone] = useDebouncedState("", 300);
  const [filters, setFilters] = useState<EmployeesFilters>({
    page: 1,
    size: 10,
    branch_id: undefined,
    location_id: undefined,
    roles: [],
  });

  const {
    data: employees = {
      data: [],
      pagesCount: 0,
    },
    isError,
    isInitialLoading,
  } = useEmployees({
    ...filters,
    name,
    phone,
  });

  const handleSelect = (value: (keyof typeof rolesArabicNames)[]) => {
    setFilters({
      ...filters,
      roles: value,
    });
  };

  const handleChangePermissions = (
    value: (keyof typeof permissionsArabicNames)[],
  ) => {
    setFilters({
      ...filters,
      permissions: value,
    });
  };

  const { data: branchesData } = useBranches({
    size: 100000,
    minified: true,
  });
  const { data: locationsData } = useLocations({
    size: 100000,
    minified: true,
  });

  return (
    <AppLayout isError={isError}>
      <Accordion variant="separated">
        <Accordion.Item className="rounded-md mb-8" value="employees-filter">
          <Accordion.Control> الفلاتر</Accordion.Control>
          <Accordion.Panel>
            <Grid className="mt-4 my-10">
              {role !== "CLIENT" && role !== "CLIENT_ASSISTANT" ? (
                <Grid.Col span={{ base: 12, sm: 12, xs: 12, md: 6, lg: 6 }}>
                  <MultiSelect
                    label="الدور"
                    data={
                      role === "BRANCH_MANAGER"
                        ? branchRolesArray
                        : rolesArray.filter(
                            (role) =>
                              role.value !== "ADMIN" &&
                              role.value !== "CLIENT_ASSISTANT" &&
                              role.value !== "ADMIN_ASSISTANT",
                          )
                    }
                    clearable
                    searchable
                    limit={50}
                    placeholder="الدور"
                    value={filters.roles}
                    onChange={(e) =>
                      handleSelect(e as (keyof typeof rolesArabicNames)[])
                    }
                  />
                </Grid.Col>
              ) : null}
              <Grid.Col span={{ base: 12, sm: 12, xs: 12, md: 6, lg: 6 }}>
                <MultiSelect
                  label="الصلاحيات"
                  data={
                    role === "CLIENT" || role === "CLIENT_ASSISTANT"
                      ? clientAssistantPermissionsArray
                      : permissionsArray
                  }
                  clearable
                  searchable
                  limit={50}
                  placeholder="الصلاحيات"
                  value={filters.permissions}
                  onChange={(e) =>
                    handleChangePermissions(
                      e as (keyof typeof permissionsArabicNames)[],
                    )
                  }
                />
              </Grid.Col>
              {role !== "CLIENT" && role !== "CLIENT_ASSISTANT" ? (
                <>
                  <Grid.Col span={{ base: 12, sm: 12, xs: 12, md: 6, lg: 6 }}>
                    <Select
                      label="الفروع"
                      data={getSelectOptions(branchesData?.data || [])}
                      clearable
                      searchable
                      limit={50}
                      placeholder="اختار الفرع"
                      value={filters.branch_id?.toString()}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          branch_id: e,
                        });
                      }}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 12, xs: 12, md: 6, lg: 6 }}>
                    <Select
                      label="المناطق"
                      data={getSelectOptions(locationsData?.data || [])}
                      clearable
                      limit={50}
                      searchable
                      placeholder="اختار المنطقة"
                      disabled={
                        !filters.branch_id ||
                        !filters.roles?.includes("DELIVERY_AGENT")
                      }
                      value={filters.location_id}
                      onChange={(e) => {
                        setFilters({
                          ...filters,
                          location_id: e,
                        });
                      }}
                    />
                  </Grid.Col>
                </>
              ) : null}
              <Grid.Col span={{ base: 12, sm: 12, xs: 12, md: 6, lg: 6 }}>
                <TextInput
                  label="الاسم"
                  defaultValue={name}
                  onChange={(e) => {
                    setName(e.currentTarget.value);
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 12, xs: 12, md: 6, lg: 6 }}>
                <TextInput
                  label="رقم الهاتف"
                  defaultValue={phone}
                  onChange={(e) => {
                    setPhone(e.currentTarget.value);
                  }}
                />
              </Grid.Col>
            </Grid>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <div className="relative mt-12">
        <LoadingOverlay visible={isInitialLoading} />
        <DataTable
          navigationURL="/employees/add"
          columns={
            role === "CLIENT" || role === "CLIENT_ASSISTANT"
              ? clientAssistantColumns
              : columns
          }
          data={employees.data}
          setFilters={setFilters}
          filters={{
            ...filters,
            pagesCount: employees.pagesCount,
          }}
          navButtonTitle="إضافة موظف"
        />
      </div>
    </AppLayout>
  );
};
