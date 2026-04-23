import { useBranches } from "@/hooks/useBranches";
import { useEmployees } from "@/hooks/useEmployees";
import { getSelectOptions } from "@/lib/getSelectOptions";
import { type governorateArabicNames, governorateArray } from "@/lib/governorateArabicNames ";
import type { LocationFilters } from "@/services/getLocations";
import { Accordion, Grid, Select, TextInput } from "@mantine/core";

interface ILocationsFilter {
    filters: LocationFilters;
    setFilters: React.Dispatch<React.SetStateAction<LocationFilters>>;
    search: string;
    setSearch: (newValue: string) => void;
}

export const LocationsFilter = ({ filters, search, setFilters, setSearch }: ILocationsFilter) => {
    const {
        data: branchesData = {
            data: []
        }
    } = useBranches({
        size: 100000,
        minified: true
    });
    const {
        data: employeesData = {
            data: []
        }
    } = useEmployees({
        size: 100000,
        minified: true,
        roles: ["DELIVERY_AGENT"]
    });

    return (
        <Accordion variant="separated">
            <Accordion.Item className="rounded-md mb-8 mt-4" value="locations-filter">
                <Accordion.Control> الفلاتر</Accordion.Control>
                <Accordion.Panel>
                    <Grid>
                        <Grid.Col span={{ base: 12, xs: 12, sm: 12, md: 6, lg: 4 }}>
                            <TextInput
                                placeholder="بحث"
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
                                        governorate: (e as keyof typeof governorateArabicNames) || ""
                                    });
                                }}
                                placeholder="اختر المحافظة"
                                data={governorateArray}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                            <Select
                                value={filters.branch_id?.toString()}
                                allowDeselect
                                label="الفروع"
                                searchable
                                clearable
                                onChange={(e) => {
                                    setFilters({
                                        ...filters,
                                        branch_id: Number(e) || 0
                                    });
                                }}
                                placeholder="اختر الفرع"
                                data={getSelectOptions(branchesData.data)}
                                limit={100}
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, md: 6, lg: 4, sm: 12, xs: 12 }}>
                            <Select
                                value={filters.delivery_agent_id?.toString()}
                                allowDeselect
                                label="مندوبين التوصيل"
                                searchable
                                clearable
                                onChange={(e) => {
                                    setFilters({
                                        ...filters,
                                        delivery_agent_id: Number(e) || null
                                    });
                                }}
                                placeholder="اختر مندوب"
                                data={getSelectOptions(employeesData.data)}
                                limit={100}
                            />
                        </Grid.Col>
                    </Grid>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
};
