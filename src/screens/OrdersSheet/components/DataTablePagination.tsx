import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon
} from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
    return (
        <div dir="rtl" className="flex items-center justify-between px-2">
            <div dir="rtl" className="flex items-center space-x-6 lg:space-x-8">
                <div dir="rtl" className="flex items-center space-x-2">
                    <p dir="rtl" className="text-sm font-medium">
                        صفوف لكل صفحة
                    </p>
                    <Select
                        dir="rtl"
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger dir="rtl" className="h-8 w-[70px]">
                            <SelectValue dir="rtl" placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent dir="rtl" side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div dir="rtl" className="flex w-[100px] items-center justify-center text-sm font-medium">
                    {table.getState().pagination.pageIndex + 1} من {table.getPageCount()}
                </div>
                <div dir="rtl" className="flex items-center space-x-2">
                    <Button
                        dir="rtl"
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <DoubleArrowRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        dir="rtl"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <DoubleArrowLeftIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
