import { AppLayout } from "@/components/AppLayout";
import { useLocations } from "@/hooks/useLocations";
import type { LocationFilters } from "@/services/getLocations";
import { useAuth } from "@/store/authStore";
import { LoadingOverlay } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { useState } from "react";
import { DataTable } from "../Employees/data-table";
import { ChangeLocationBranch } from "./ChangeLocationBranch";
import { ChangeLocationDeliveryAgent } from "./ChangeLocationDeliveryAgent";
import { LocationsFilter } from "./LocationsFilter";
import { columns } from "./columns";

export const LocationsScreen = () => {
    const { role } = useAuth();
    const [filters, setFilters] = useState<LocationFilters>({
        page: 1,
        size: 10
    });

    const [search, setSearch] = useDebouncedState("", 300);

    const {
        data: locations = {
            data: [],
            pagesCount: 0
        },
        isError,
        isInitialLoading
    } = useLocations({
        ...filters,
        search
    });

    return (
        <AppLayout isError={isError}>
            {/* handle responsive on phones */}
            <div className="flex gap-4 sm:flex-row flex-col">
                <ChangeLocationDeliveryAgent />
                <ChangeLocationBranch />
            </div>
            <LocationsFilter
                filters={filters}
                setFilters={setFilters}
                search={search}
                setSearch={setSearch}
            />
            <div className="relative mt-12">
                <LoadingOverlay visible={isInitialLoading} />
                <DataTable
                    columns={columns}
                    navigationURL={role !== "ADMIN_ASSISTANT" && role !== "ADMIN" ? "/locations/add" : ""}
                    data={locations.data}
                    setFilters={setFilters}
                    filters={{
                        ...filters,
                        pagesCount: locations.pagesCount
                    }}
                    navButtonTitle="إضافة منطقة"
                />
            </div>
        </AppLayout>
    );
};
