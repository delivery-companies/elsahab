import { useClients } from "@/hooks/useClients";
import { useLocations } from "@/hooks/useLocations";
import { useStores } from "@/hooks/useStores";
import { deliveryTypesArray } from "@/lib/deliveryTypesArabicNames";
import { governorateArray } from "@/lib/governorateArabicNames ";
import { orderStatusArray } from "@/lib/orderStatusArabicNames";
import { DateTimePicker } from "@mantine/dates";
import "dayjs/locale/ar";
import { useDeactivateOrder } from "@/hooks/useDeactivateOrder";
import { useEmployees } from "@/hooks/useEmployees";
import { getSelectOptions } from "@/lib/getSelectOptions";
import type { OrdersFilter as IOrdersFilter } from "@/services/getOrders";
import { useOrdersForwardedToCompany } from "@/store/ordersForwardedToCompany";
import { Accordion, Button, Grid, MultiSelect, Select, TextInput } from "@mantine/core";
import { format, parseISO } from "date-fns";

interface ForwardedOrdersToCompanyFiltersProps {
    filters: IOrdersFilter;
    setFilters: React.Dispatch<React.SetStateAction<IOrdersFilter>>;
    search: string;
    setSearch: (newValue: string) => void;
}

export const ForwardedOrdersToCompanyFilters = ({
    filters,
    setFilters,
    search,
    setSearch
}: ForwardedOrdersToCompanyFiltersProps) => {
    const { orders } = useOrdersForwardedToCompany();

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
        data: locationsData = {
            data: []
        }
    } = useLocations({ size: 100000, minified: true });
    const {
        data: employeesData = {
            data: []
        }
    } = useEmployees({
        size: 100000,
        minified: true,
        roles: [
            "ACCOUNTANT",
            "EMERGENCY_EMPLOYEE",
            "ACCOUNT_MANAGER",
            "BRANCH_MANAGER",
            "COMPANY_MANAGER",
            "REPOSITORIY_EMPLOYEE"
        ]
    });

    const { mutateAsync: deactivateOrder, isLoading: isEditingOrderLoading } = useDeactivateOrder();

    const handleResetRangeDate = () => {
        setFilters({
            ...filters,
            start_date: null,
            end_date: null
        });
    };

    const convertDateFormat = (date: Date | null): string | null => {
        if (date) {
            const parsedDate = parseISO(date.toISOString());
            return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        }
        return null;
    };

    const handleConfirmSelectedOrders = async () => {
        await Promise.all(
            orders.map(async (order) => {
                await deactivateOrder(order.id);
            })
        );
    };

    return (
        <>
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
                                    value={filters.delivery_type}
                                    allowDeselect
                                    label="نوع التوصيل"
                                    searchable
                                    clearable
                                    onChange={(e) => {
                                        setFilters({
                                            ...filters,
                                            delivery_type: e || ""
                                        });
                                    }}
                                    placeholder="اختر نوع التوصيل"
                                    data={deliveryTypesArray}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                                <Select
                                    value={filters.forwarded_by_id?.toString()}
                                    allowDeselect
                                    label="المسئول عن التحويل"
                                    searchable
                                    clearable
                                    onChange={(e) => {
                                        setFilters({
                                            ...filters,
                                            forwarded_by_id: e || ""
                                        });
                                    }}
                                    placeholder="اختر المسئول عن التحويل"
                                    data={getSelectOptions(employeesData.data)}
                                    limit={100}
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
                            <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                                <Select
                                    value={filters.location_id}
                                    allowDeselect
                                    label="المناطق"
                                    searchable
                                    clearable
                                    onChange={(e) => {
                                        setFilters({
                                            ...filters,
                                            location_id: e || ""
                                        });
                                    }}
                                    placeholder="اختر المنطقة"
                                    data={getSelectOptions(locationsData.data)}
                                    limit={100}
                                />
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 6, lg: 12, sm: 12, xs: 12 }}>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <DateTimePicker
                                        className="w-60"
                                        valueFormat="DD MMM YYYY hh:mm A"
                                        label="تاريخ توصيل الطلب"
                                        value={filters.delivery_date ? new Date(filters.delivery_date) : null}
                                        placeholder="اختر تاريخ البداية"
                                        locale="ar"
                                        clearable
                                        onChange={(date) => {
                                            const newDeliveryDate = convertDateFormat(date);
                                            setFilters({
                                                ...filters,
                                                delivery_date: newDeliveryDate
                                            });
                                        }}
                                    />
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
            <Button
                disabled={isEditingOrderLoading || orders.length === 0}
                loading={isEditingOrderLoading}
                onClick={handleConfirmSelectedOrders}
            >
                استعادة الطلبات المحددة
            </Button>
        </>
    );
};
