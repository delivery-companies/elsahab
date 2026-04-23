import { useClients } from "@/hooks/useClients";
import { useEmployees } from "@/hooks/useEmployees";
import { useRepositories } from "@/hooks/useRepositories";
import { useStores } from "@/hooks/useStores";
import { convertDateFormat } from "@/lib/convertDate";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { governorateArray } from "@/lib/governorateArabicNames ";
import { reportStatusArray } from "@/lib/reportStatusArabicNames";
import type { ReportsFilters as IReportsFilters } from "@/services/getReports";
import { Accordion, Button, Grid, Select } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import "dayjs/locale/ar";

interface IReportsFilter {
    filters: IReportsFilters;
    setFilters: React.Dispatch<React.SetStateAction<IReportsFilters>>;
}

export const ReportsFilter = ({ filters, setFilters }: IReportsFilter) => {
    const {
        data: clientsData = {
            data: []
        }
    } = useClients({ size: 100000, minified: true });

    const {
        data: storesData = {
            data: []
        }
    } = useStores({ size: 100000, minified: true });

    const {
        data: repositoriesData = {
            data: []
        }
    } = useRepositories({ size: 100000, minified: true });

    const {
        data: employeesData = {
            data: []
        }
    } = useEmployees({
        size: 100000,
        minified: true,
        roles: ["DELIVERY_AGENT"]
    });

    const {
        data: reportCreatedBy = {
            data: []
        }
    } = useEmployees({
        size: 100000,
        minified: true,
        roles: [
            "ACCOUNTANT",
            "ACCOUNT_MANAGER",
            "BRANCH_MANAGER",
            "COMPANY_MANAGER",
            "DATA_ENTRY",
            "EMERGENCY_EMPLOYEE",
            "INQUIRY_EMPLOYEE",
            "RECEIVING_AGENT",
            "REPOSITORIY_EMPLOYEE"
        ]
    });

    const handleResetRangeDate = () => {
        setFilters({
            ...filters,
            start_date: null,
            end_date: null
        });
    };

    return (
        <Accordion variant="separated">
            <Accordion.Item className="rounded-md mb-8" value="reports-filter">
                <Accordion.Control>فلاتر الكشوفات</Accordion.Control>
                <Accordion.Panel>
                    <Grid align="center" gutter="lg" grow>
                        <Grid.Col span={{ base: 12, md: 4, lg: 4, sm: 12, xs: 12 }}>
                            <Select
                                value={filters.type}
                                allowDeselect
                                label="ساحب الكشف"
                                searchable
                                clearable
                                onChange={(e) => {
                                    setFilters({
                                        ...filters,
                                        created_by_id: e || ""
                                    });
                                }}
                                placeholder="اختر ساحب الكشف"
                                data={getSelectOptions(reportCreatedBy.data)}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4, lg: 4, sm: 12, xs: 12 }}>
                            <Select
                                value={filters.governorate}
                                allowDeselect
                                label="المحافظة"
                                searchable
                                clearable
                                onChange={(e) => {
                                    setFilters({
                                        ...filters,
                                        governorate: e || ""
                                    });
                                }}
                                placeholder="اختر المحافظة"
                                data={governorateArray}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4, lg: 4, sm: 12, xs: 12 }}>
                            <Select
                                value={filters.status}
                                allowDeselect
                                label="الحالة"
                                searchable
                                clearable
                                onChange={(e) => {
                                    setFilters({
                                        ...filters,
                                        status: e || ""
                                    });
                                }}
                                placeholder="اختر الحالة"
                                data={reportStatusArray}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4, lg: 4, sm: 12, xs: 12 }}>
                            <Select
                                value={filters.client_id}
                                allowDeselect
                                label="العملاء"
                                searchable
                                clearable
                                onChange={(e) => {
                                    setFilters({
                                        ...filters,
                                        client_id: e || ""
                                    });
                                }}
                                placeholder="اختر العميل"
                                limit={100}
                                data={getSelectOptions(clientsData.data)}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4, lg: 4, sm: 12, xs: 12 }}>
                            <Select
                                value={filters.repository_id}
                                allowDeselect
                                label="المخزن"
                                searchable
                                clearable
                                onChange={(e) => {
                                    setFilters({
                                        ...filters,
                                        repository_id: e || ""
                                    });
                                }}
                                placeholder="اختر المخزن"
                                limit={100}
                                data={getSelectOptions(repositoriesData.data)}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4, lg: 4, sm: 12, xs: 12 }}>
                            <Select
                                value={filters.store_id}
                                allowDeselect
                                label="المتجر"
                                searchable
                                clearable
                                onChange={(e) => {
                                    setFilters({
                                        ...filters,
                                        store_id: e || ""
                                    });
                                }}
                                placeholder="اختر المتجر"
                                limit={100}
                                data={getSelectOptions(storesData.data)}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4, lg: 4, sm: 12, xs: 12 }}>
                            <Select
                                value={filters.delivery_agent_id}
                                allowDeselect
                                label="المندوب"
                                searchable
                                clearable
                                onChange={(e) => {
                                    setFilters({
                                        ...filters,
                                        delivery_agent_id: e || ""
                                    });
                                }}
                                placeholder="اختر المندوب"
                                limit={100}
                                data={getSelectOptions(employeesData.data)}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4, lg: 4, sm: 12, xs: 12 }}>
                            <Select
                                value={filters.sort}
                                allowDeselect
                                label="الترتيب"
                                searchable
                                clearable
                                onChange={(e) => {
                                    setFilters({
                                        ...filters,
                                        sort: e || ""
                                    });
                                }}
                                placeholder="اختر الترتيب"
                                data={[
                                    {
                                        label: "الأحدث",
                                        value: "id:desc"
                                    },
                                    {
                                        label: "الأقدم",
                                        value: "id:asc"
                                    }
                                ]}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 12, lg: 12, sm: 12, xs: 12 }}>
                            <div className="flex items-center gap-4 flex-wrap">
                                <DateTimePicker
                                    valueFormat="DD MMM YYYY hh:mm A"
                                    label="بداية تاريخ الكشف"
                                    value={filters.start_date ? new Date(filters.start_date) : null}
                                    placeholder="اختر تاريخ البداية"
                                    locale="ar"
                                    clearable
                                    onChange={(date) => {
                                        const formattedDate = convertDateFormat(date);
                                        setFilters({
                                            ...filters,
                                            start_date: formattedDate
                                        });
                                    }}
                                />
                                <DateTimePicker
                                    valueFormat="DD MMM YYYY hh:mm A"
                                    label="نهاية تاريخ الكشف"
                                    placeholder="اختر تاريخ النهاية"
                                    value={filters.end_date ? new Date(filters.end_date) : null}
                                    locale="ar"
                                    clearable
                                    onChange={(date) => {
                                        const formattedDate = convertDateFormat(date);
                                        setFilters({
                                            ...filters,
                                            end_date: formattedDate
                                        });
                                    }}
                                />
                                {filters.end_date && filters.start_date && (
                                    <Button onClick={handleResetRangeDate} className="mt-6" variant="outline">
                                        الحذف
                                    </Button>
                                )}
                            </div>
                        </Grid.Col>
                    </Grid>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
};
