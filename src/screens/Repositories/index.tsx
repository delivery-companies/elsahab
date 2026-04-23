import { AppLayout } from "@/components/AppLayout";
import { useRepositories } from "@/hooks/useRepositories";
import type { Filters } from "@/services/getEmployeesService";
import { useAuth } from "@/store/authStore";
import { useState } from "react";
import { DataTable } from "../Employees/data-table";
import { columns } from "./columns";

export const RepositoriesScreen = () => {
    const { role } = useAuth();
    const [filters, setFilters] = useState<Filters>({
        page: 1,
        size: 10
    });
    const {
        data: repositories = {
            data: [],
            pagesCount: 0
        },
        isLoading,
        isError
    } = useRepositories(filters);
    return (
        <AppLayout isLoading={isLoading} isError={isError}>
            <DataTable
                columns={columns}
                data={repositories?.data}
                navigationURL={role !== "ADMIN_ASSISTANT" && role !== "ADMIN" ? "/repositories/add" : ""}
                setFilters={setFilters}
                filters={{
                    ...filters,
                    pagesCount: repositories.pagesCount
                }}
                navButtonTitle="إضافة مخزن"
            />
        </AppLayout>
    );
};
