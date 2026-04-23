import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon
} from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Filters } from "@/services/getEmployeesService";
import type { Dispatch } from "react";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    setFilters: Dispatch<React.SetStateAction<Filters>>;
    filters: Filters;
}

export function DataTablePagination<TData>({ table, setFilters, filters }: DataTablePaginationProps<TData>) {
    return (
        <div className="flex items-center justify-between px-2 mt-3">
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">عنصر لكل صفحة</p>
                    <Select
                        value={filters?.size?.toString() || "10"}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                            setFilters((filters) => ({
                                ...filters,
                                size: Number(value)
                            }));
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50, 100, 200, 400, 500].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    الصفحه {filters.page} من {filters.pagesCount}
                </div>
                <div className="flex flex-row-reverse items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => {
                            setFilters({
                                ...filters,
                                page: filters.pagesCount
                            });
                        }}
                        disabled={filters.page === filters.pagesCount}
                    >
                        <DoubleArrowLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            setFilters((filters) => ({
                                ...filters,
                                page: (filters.page || 1) + 1
                            }));
                        }}
                        disabled={filters.page === filters.pagesCount}
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                            table.nextPage();
                            setFilters((filters) => ({
                                ...filters,
                                page: Number(filters?.page) - 1 || 1
                            }));
                        }}
                        disabled={filters.page === 1}
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => {
                            setFilters((filters) => ({
                                ...filters,
                                page: 1
                            }));
                        }}
                        disabled={filters.page === 1}
                    >
                        <DoubleArrowRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
