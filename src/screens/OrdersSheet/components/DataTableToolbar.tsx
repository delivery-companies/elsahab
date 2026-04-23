import { Cross2Icon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";

import { DataTableViewOptions } from "@/components/DataTableViewOptions";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {/* <Input
                    dir="rtl"
                    placeholder="بحث"
                    value={(table.getColumn("orderNumber")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("orderNumber")?.setFilterValue(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                /> */}
                {isFiltered && (
                    <Button
                        dir="rtl"
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        اعادة تعيين
                        <Cross2Icon className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}
