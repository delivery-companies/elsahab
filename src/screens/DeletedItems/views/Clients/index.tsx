import { useClients } from "@/hooks/useClients";
import { DataTable } from "@/screens/Employees/data-table";
import type { Filters } from "@/services/getEmployeesService";
import { LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import { columns } from "./columns";

export const DeletedClientsView = () => {
    const [filters, setFilters] = useState<Filters>({
        page: 1,
        size: 10,
        deleted: true
    });

    const {
        data: clients = {
            data: [],
            pagesCount: 0
        },
        isInitialLoading
    } = useClients(filters);

    return (
        <div className="relative">
            <LoadingOverlay visible={isInitialLoading} />
            <DataTable
                columns={columns}
                data={clients?.data}
                setFilters={setFilters}
                filters={{
                    ...filters,
                    pagesCount: clients.pagesCount
                }}
            />
        </div>
    );
};
