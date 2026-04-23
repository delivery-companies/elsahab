import { AppLayout } from "@/components/AppLayout";
// import { useEmployees } from "@/hooks/useEmployees";
// import { useClients, type ClientsFilters } from "@/hooks/useClients";
// import { getSelectOptions } from "@/lib/getSelectOptions";
// import { useAuth } from "@/store/authStore";
// import { Accordion, Grid, LoadingOverlay, Select, TextInput } from "@mantine/core";
// import { useDebouncedState } from "@mantine/hooks";
import { useClients } from "@/hooks/useClients";
import { useEmployees } from "@/hooks/useEmployees";
import { useUsersLoginHistory } from "@/hooks/useUsersLoginHistory";
import { getSelectOptions } from "@/lib/getSelectOptions";
import type { UsersLoginHistoryFilters } from "@/services/getUsersLoginHistory";
import { Accordion, Grid, LoadingOverlay, Select } from "@mantine/core";
import { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export const UsersLoginHistory = () => {
    // const { role } = useAuth();
    // const [name, setName] = useDebouncedState("", 300);

    const { data: employeesData } = useEmployees();
    const { data: clientsData } = useClients();

    // const [userId, setUserId] = useDebouncedState<number | undefined>(undefined, 300);

    const [filters, setFilters] = useState<UsersLoginHistoryFilters>({
        page: 1,
        size: 10
    });

    const {
        data: usersLoginHistory = {
            data: [],
            pagesCount: 0
        },
        isError,
        isInitialLoading
    } = useUsersLoginHistory({ ...filters });

    return (
        <AppLayout isError={isError}>
            <Accordion variant="separated">
                <Accordion.Item className="rounded-md mb-8" value="employees-filter">
                    <Accordion.Control> الفلاتر</Accordion.Control>
                    <Accordion.Panel>
                        <Grid className="mt-4 my-10">
                            <Grid.Col span={{ base: 12, sm: 12, xs: 12, md: 6, lg: 6 }}>
                                <Select
                                    label="المستخدمين"
                                    data={[
                                        ...getSelectOptions(employeesData?.data || []),
                                        ...getSelectOptions(clientsData?.data || [])
                                    ]}
                                    clearable
                                    searchable
                                    limit={50}
                                    placeholder="اختار المستخدم"
                                    value={filters.user_id?.toString()}
                                    onChange={(e) => {
                                        setFilters({
                                            ...filters,
                                            user_id: e === null ? undefined : +e
                                        });
                                    }}
                                />
                            </Grid.Col>
                            {/* <Grid.Col span={{ base: 12, sm: 12, xs: 12, md: 6, lg: 6 }}>
                                <Select
                                    label="العملاء"
                                    data={getSelectOptions(clientsData?.data || [])}
                                    clearable
                                    searchable
                                    limit={50}
                                    placeholder="اختار العميل"
                                    value={filters.user_id?.toString()}
                                    onChange={(e) => {
                                        setFilters({
                                            ...filters,
                                            user_id: e === null ? undefined : +e
                                        });
                                    }}
                                />
                            </Grid.Col> */}
                            {/* <Grid.Col span={{ base: 12, sm: 12, xs: 12, md: 6, lg: 6 }}>
                                <TextInput
                                    label="رقم المستخدم"
                                    defaultValue={undefined}
                                    onChange={(e) => {
                                        setFilters({
                                            ...filters,
                                            user_id: e.target.value === "" ? undefined : +e.target.value
                                        });
                                    }}
                                />
                            </Grid.Col> */}
                        </Grid>
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
            <div className="relative mt-12">
                <LoadingOverlay visible={isInitialLoading} />
                <DataTable
                    columns={columns}
                    data={usersLoginHistory.data}
                    setFilters={setFilters}
                    filters={{
                        ...filters,
                        pagesCount: usersLoginHistory.pagesCount
                    }}
                />
            </div>
        </AppLayout>
    );
};
