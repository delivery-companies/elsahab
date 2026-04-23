import { useClients } from "@/hooks/useClients";
import { useLocations } from "@/hooks/useLocations";
import { useStores } from "@/hooks/useStores";
import { type deliveryTypesArabicNames, deliveryTypesArray } from "@/lib/deliveryTypesArabicNames";
import { withReportsDataOptions } from "@/lib/getReportParam";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { governorateArray } from "@/lib/governorateArabicNames ";
import { type orderStatusArabicNames, orderStatusArray } from "@/lib/orderStatusArabicNames";
import type { OrdersStatisticsFilter } from "@/services/getOrdersStatisticsService";
import { Accordion, Button, Grid, MultiSelect, Popover, Select, rem } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { format, parseISO } from "date-fns";
import type { Dispatch, SetStateAction } from "react";

interface StatisticsFilterProps {
    statisticsFilter: OrdersStatisticsFilter;
    setStatisticsFilter: Dispatch<SetStateAction<OrdersStatisticsFilter>>;
}

export const StatisticsFilter = ({ setStatisticsFilter, statisticsFilter }: StatisticsFilterProps) => {
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

    const convertDateFormat = (date: Date | null): string | null => {
        if (date) {
            const parsedDate = parseISO(date.toISOString());
            return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        }
        return null;
    };

    const handleResetRangeDate = () => {
        setStatisticsFilter({
            ...statisticsFilter,
            start_date: null,
            end_date: null
        });
    };

    return (
        <Accordion variant="separated">
            <Accordion.Item className="rounded-md mb-8" value="statistics-filter">
                <Accordion.Control> الفلاتر</Accordion.Control>
                <Accordion.Panel>
                    <Grid gutter="md">
                        <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                            <MultiSelect
                                value={statisticsFilter.statuseses}
                                label="الحالة"
                                searchable
                                clearable
                                onChange={(e) => {
                                    setStatisticsFilter({
                                        ...statisticsFilter,
                                        statuseses: (e as (keyof typeof orderStatusArabicNames)[]) || ""
                                    });
                                }}
                                placeholder="اختر الحالة"
                                data={orderStatusArray}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                            <Select
                                value={statisticsFilter.governorate}
                                allowDeselect
                                label="المحافظة"
                                searchable
                                clearable
                                onChange={(e) => {
                                    setStatisticsFilter({
                                        ...statisticsFilter,
                                        governorate: e || ""
                                    });
                                }}
                                placeholder="اختر المحافظة"
                                data={governorateArray}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                            <Select
                                value={statisticsFilter.delivery_type}
                                allowDeselect
                                label="نوع التوصيل"
                                searchable
                                clearable
                                onChange={(e) => {
                                    if (e) {
                                        setStatisticsFilter({
                                            ...statisticsFilter,
                                            delivery_type: e as keyof typeof deliveryTypesArabicNames
                                        });
                                    } else {
                                        setStatisticsFilter({
                                            ...statisticsFilter,
                                            delivery_type: undefined
                                        });
                                    }
                                }}
                                placeholder="اختر نوع التوصيل"
                                data={deliveryTypesArray}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                            <Select
                                value={statisticsFilter.client_id?.toString()}
                                allowDeselect
                                label="العملاء"
                                searchable
                                clearable
                                onChange={(e) => {
                                    if (e) {
                                        setStatisticsFilter({
                                            ...statisticsFilter,
                                            client_id: Number(e)
                                        });
                                    } else {
                                        setStatisticsFilter({
                                            ...statisticsFilter,
                                            client_id: undefined
                                        });
                                    }
                                }}
                                placeholder="اختر العميل"
                                data={getSelectOptions(clientsData.data)}
                                limit={100}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                            <Select
                                value={statisticsFilter.store_id?.toString()}
                                allowDeselect
                                label="المتجر"
                                searchable
                                clearable
                                onChange={(e) => {
                                    setStatisticsFilter({
                                        ...statisticsFilter,
                                        store_id: Number(e)
                                    });
                                }}
                                placeholder="اختر المتجر"
                                data={getSelectOptions(storesData.data)}
                                limit={100}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                            <Select
                                value={statisticsFilter.location_id?.toString()}
                                allowDeselect
                                label="المناطق"
                                searchable
                                clearable
                                onChange={(e) => {
                                    setStatisticsFilter({
                                        ...statisticsFilter,
                                        location_id: Number(e)
                                    });
                                }}
                                placeholder="اختر المنطقة"
                                data={getSelectOptions(locationsData.data)}
                                limit={100}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
                            <Select
                                label="كشف شركة"
                                placeholder="اختر كشف شركة"
                                data={withReportsDataOptions}
                                clearable
                                defaultValue={statisticsFilter.company_report}
                                onChange={(e) => {
                                    setStatisticsFilter({
                                        ...statisticsFilter,
                                        company_report: e
                                    });
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
                            <Select
                                label="كشف مخزن"
                                placeholder="اختر كشف مخزن"
                                data={withReportsDataOptions}
                                clearable
                                defaultValue={statisticsFilter.repository_report}
                                onChange={(e) => {
                                    setStatisticsFilter({
                                        ...statisticsFilter,
                                        repository_report: e
                                    });
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
                            <Select
                                label="كشف عميل"
                                placeholder="اختر كشف عميل"
                                data={withReportsDataOptions}
                                clearable
                                defaultValue={statisticsFilter.client_report}
                                onChange={(e) => {
                                    setStatisticsFilter({
                                        ...statisticsFilter,
                                        client_report: e
                                    });
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
                            <Select
                                label="كشف فرع"
                                placeholder="اختر كشف فرع"
                                data={withReportsDataOptions}
                                clearable
                                defaultValue={statisticsFilter.branch_report}
                                onChange={(e) => {
                                    setStatisticsFilter({
                                        ...statisticsFilter,
                                        branch_report: e
                                    });
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
                            <Select
                                label="كشف مندوب"
                                placeholder="اختر كشف مندوب"
                                data={withReportsDataOptions}
                                clearable
                                defaultValue={statisticsFilter.delivery_agent_report}
                                onChange={(e) => {
                                    setStatisticsFilter({
                                        ...statisticsFilter,
                                        delivery_agent_report: e
                                    });
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 4, lg: 3, sm: 12, xs: 12 }}>
                            <Select
                                label="كشف محافظة"
                                placeholder="اختر كشف محافظة"
                                data={withReportsDataOptions}
                                clearable
                                defaultValue={statisticsFilter.governorate_report}
                                onChange={(e) => {
                                    setStatisticsFilter({
                                        ...statisticsFilter,
                                        governorate_report: e
                                    });
                                }}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 12, sm: 12, xs: 12 }}>
                            <div className="flex items-center gap-2 flex-wrap">
                                <Popover width={rem(300)} trapFocus position="bottom" withArrow shadow="md">
                                    <Popover.Target>
                                        <Button className="mt-6">بداية ونهاية تاريخ عمل الطلب</Button>
                                    </Popover.Target>
                                    <Popover.Dropdown>
                                        <DatePicker
                                            locale="ar"
                                            type="range"
                                            allowSingleDateInRange
                                            value={
                                                statisticsFilter.end_date && statisticsFilter.start_date
                                                    ? [
                                                          new Date(statisticsFilter.start_date),
                                                          new Date(statisticsFilter.end_date)
                                                      ]
                                                    : [null, null]
                                            }
                                            onChange={(date) => {
                                                const formatedStartDate = convertDateFormat(date[0]);
                                                const formatedEndDate = convertDateFormat(date[1]);
                                                setStatisticsFilter({
                                                    ...statisticsFilter,
                                                    start_date: formatedStartDate,
                                                    end_date: formatedEndDate
                                                });
                                            }}
                                        />
                                        {statisticsFilter.end_date && statisticsFilter.start_date && (
                                            <Button
                                                onClick={handleResetRangeDate}
                                                fullWidth
                                                className="mt-3"
                                                variant="outline"
                                            >
                                                الحذف
                                            </Button>
                                        )}
                                    </Popover.Dropdown>
                                </Popover>
                            </div>
                        </Grid.Col>
                    </Grid>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
};
