import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/components/DataTablePagination";
import { DataTableViewOptions } from "@/components/DataTableViewOptions";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Filters } from "@/services/getEmployeesService";
import { type Dispatch } from "react";
import { Link } from "react-router-dom";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filters: Filters;
  setFilters: Dispatch<React.SetStateAction<Filters>>;
  navigationURL?: string;
  navButtonTitle?: string;
  showBk?: boolean;
  rowSelection?: any; // 👈 new
  setRowSelection?: (updater: any) => void; // 👈 new
}
interface secondaryType {
  clientReport?: { secondaryType?: string };
  repositoryReport?: { secondaryType?: string };
  companyReport?: { secondaryType?: string };
}
export function DataTable<TData, TValue>({
  columns,
  data,
  setFilters,
  filters,
  navigationURL,
  navButtonTitle,
  rowSelection = {}, // default
  setRowSelection = () => {}, // default
  showBk,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  });

  return (
    <div className="mt-5">
      <div className="flex gap-4 justify-between">
        {navigationURL && navButtonTitle && (
          <Link
            className={buttonVariants({
              variant: "outlineMain",
              size: "sm",
              className: "flex items-center gap-2",
            })}
            to={navigationURL}>
            {navButtonTitle}
          </Link>
        )}
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md border mt-3 relative">
        <Table>
          <TableHeader className="bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-start" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className={
                    row.original && !showBk
                      ? (row.original as secondaryType)?.clientReport
                          ?.secondaryType ||
                        (row.original as secondaryType)?.repositoryReport
                          ?.secondaryType ||
                        (row.original as secondaryType)?.companyReport
                          ?.secondaryType ||
                        ""
                      : ""
                  }
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  لا يوجد بيانات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        setFilters={setFilters}
        filters={filters}
      />
    </div>
  );
}
