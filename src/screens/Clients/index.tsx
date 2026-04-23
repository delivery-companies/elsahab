import { AppLayout } from "@/components/AppLayout";
import { useBranches } from "@/hooks/useBranches";
import { useClients, type ClientsFilters } from "@/hooks/useClients";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { useAuth } from "@/store/authStore";
import { Accordion, Grid, LoadingOverlay, Select, TextInput } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useState } from "react";
import { DataTable } from "../Employees/data-table";
import { columns } from "./columns";

export const ClientsScreen = () => {
    const { role } = useAuth();
    const [name, setName] = useDebouncedState("", 300);
    const [phone, setPhone] = useDebouncedState("", 300);
    const [filters, setFilters] = useState<ClientsFilters>({
        page: 1,
        size: 10,
        branch_id: undefined
    });
    const {
        data: clients = {
            data: [],
            pagesCount: 0
        },
        isError,
        isInitialLoading
    } = useClients({ ...filters, name, phone });

    const { data: branchesData } = useBranches({
        size: 100000,
        minified: true
    });

    return (
        <AppLayout isError={isError}>
            <Accordion variant="separated">
                <Accordion.Item className="rounded-md mb-8" value="employees-filter">
                    <Accordion.Control> الفلاتر</Accordion.Control>
                    <Accordion.Panel>
                        <Grid className="mt-4 my-10">
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
                                            branch_id: e
                                        });
                                    }}
                                />
                            </Grid.Col>
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
                    columns={columns}
                    data={clients?.data}
                    navigationURL={role !== "ADMIN_ASSISTANT" && role !== "ADMIN" ? "/clients/add" : ""}
                    setFilters={setFilters}
                    filters={{
                        ...filters,
                        pagesCount: clients.pagesCount
                    }}
                    navButtonTitle="إضافة عميل"
                />
            </div>
        </AppLayout>
    );
};
