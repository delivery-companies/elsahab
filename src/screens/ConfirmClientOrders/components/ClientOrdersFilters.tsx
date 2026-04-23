import { useClients } from "@/hooks/useClients";
import { useStores } from "@/hooks/useStores";
import { convertDateFormat } from "@/lib/convertDate";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { governorateArray } from "@/lib/governorateArabicNames ";
import { orderStatusArray } from "@/lib/orderStatusArabicNames";
import type { OrdersFilter as IOrdersFilter } from "@/services/getOrders";
import { Accordion, Button, Grid, MultiSelect, Select, TextInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";

interface ClientOrdersFiltersProps {
    filters: IOrdersFilter;
    setFilters: React.Dispatch<React.SetStateAction<IOrdersFilter>>;
    search: string;
    setSearch: (newValue: string) => void;
}

export const ClientOrdersFilters = ({ filters, search, setFilters, setSearch }: ClientOrdersFiltersProps) => {
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

    const handleResetRangeDate = () => {
        setFilters({
            ...filters,
            start_date: null,
            end_date: null
        });
    };

    return (
        <Accordion variant="separated">
            <Accordion.Item className="rounded-md mb-8" value="orders-filter">
                <Accordion.Control> الفلاتر</Accordion.Control>
                <Accordion.Panel>
                    <Grid align="center" gutter="lg">
                        <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                            <TextInput
                                placeholder="رقم الكشف, اسم, عنوان او رقم هاتف المستلم"
                                defaultValue={search}
                                label="بحث"
                                onChange={(e) => {
                                    setSearch(e.currentTarget.value);
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
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
                        <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                            <MultiSelect
                                value={filters.statuses}
                                label="الحالة"
                                searchable
                                clearable
                                onChange={(e) => {
                                    setFilters({
                                        ...filters,
                                        statuses: e || ""
                                    });
                                }}
                                placeholder="اختر الحالة"
                                data={orderStatusArray}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
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
                                data={getSelectOptions(clientsData.data)}
                                limit={100}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
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
                                data={getSelectOptions(storesData.data)}
                                limit={100}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 12, sm: 12, xs: 12 }}>
                            <div className="flex items-center gap-2 flex-wrap">
                                <DateTimePicker
                                    className="w-60"
                                    valueFormat="DD MMM YYYY hh:mm A"
                                    label="بداية تاريخ الطلب"
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
                                    className="w-60"
                                    valueFormat="DD MMM YYYY hh:mm A"
                                    label="نهاية تاريخ الطلب"
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
                                    <Button
                                        onClick={handleResetRangeDate}
                                        fullWidth
                                        className="mt-3"
                                        variant="outline"
                                    >
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
