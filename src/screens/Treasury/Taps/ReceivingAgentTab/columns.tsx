/* eslint-disable react-hooks/rules-of-hooks */
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<{
  total: number | undefined;
  deliveredTotal: number | undefined;
  branchProfit: number | undefined;
  name: string;
}>[] = [
  {
    accessorKey: "name",
    header: "اسم العميل",
  },
  {
    accessorKey: "total",
    header: "عدد البريد الاجمالي",
    cell: ({ row }) => {
      const { total } = row.original;
      const formattedNumber = total
        ? total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : 0;
      return formattedNumber;
    },
  },
  {
    accessorKey: "deliveredTotal",
    header: "عدد البريد الواصل",
    cell: ({ row }) => {
      const { deliveredTotal } = row.original;
      const formattedNumber = deliveredTotal
        ? deliveredTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : 0;
      return formattedNumber;
    },
  },
  {
    accessorKey: "branchProfit",
    header: "ارباح الفرع",
    cell: ({ row }) => {
      const { branchProfit } = row.original;
      const formattedNumber = branchProfit
        ? branchProfit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : 0;
      return formattedNumber;
    },
  },
];
