import { AppLayout } from "@/components/AppLayout";
import type { Filters } from "@/services/getEmployeesService";
import { useState } from "react";
import { DataTable } from "../Employees/data-table";
import { columns } from "./columns";
import { useDepartments } from "@/hooks/useDepartments";

export const Departments = () => {
    const [filters, setFilters] = useState<Filters>({
        page: 1,
        size: 10
    });
    const {
        data: departments = {
            data: [],
            pagesCount: 0
        },
        isLoading,
        isError
    } = useDepartments(filters);

    return (
        <AppLayout isError={isError} isLoading={isLoading}>
            <DataTable
                columns={columns}
                navigationURL={"/department/add"}
                data={departments?.data}
                setFilters={setFilters}
                filters={{
                    ...filters,
                    pagesCount: departments.pagesCount
                }}
                navButtonTitle="إضافة قسم"
            />
        </AppLayout>
    );
};
