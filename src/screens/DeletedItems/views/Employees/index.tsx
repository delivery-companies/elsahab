import { type EmployeesFilters, useEmployees } from "@/hooks/useEmployees";
import { type rolesArabicNames, rolesArray } from "@/lib/rolesArabicNames";
import { DataTable } from "@/screens/Employees/data-table";
import { Accordion, LoadingOverlay, MultiSelect } from "@mantine/core";
import { useState } from "react";
import { columns } from "./columns";

export const DeletedEmployees = () => {
    const [filters, setFilters] = useState<EmployeesFilters>({
        page: 1,
        size: 10,
        deleted: true
    });
    const {
        data: employees = {
            data: [],
            pagesCount: 0
        },
        isInitialLoading
    } = useEmployees(filters);

    const handleSelect = (value: (keyof typeof rolesArabicNames)[]) => {
        setFilters((prev) => ({
            ...prev,
            roles: value
        }));
    };

    return (
        <>
            <Accordion variant="separated">
                <Accordion.Item className="rounded-md mb-8" value="deleted-employees-filter">
                    <Accordion.Control> الفلاتر</Accordion.Control>
                    <Accordion.Panel>
                        <MultiSelect
                            className="mt-4 my-10"
                            label="الدور"
                            data={rolesArray.filter(
                                (role) => role.value !== "ADMIN" && role.value !== "ADMIN_ASSISTANT"
                            )}
                            clearable
                            placeholder="الدور"
                            value={filters.roles}
                            onChange={(e) => handleSelect(e as (keyof typeof rolesArabicNames)[])}
                        />
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
            <div className="relative mt-12">
                <LoadingOverlay visible={isInitialLoading} />
                <DataTable
                    columns={columns}
                    data={employees.data}
                    setFilters={setFilters}
                    filters={{
                        ...filters,
                        pagesCount: employees.pagesCount
                    }}
                />
            </div>
        </>
    );
};
