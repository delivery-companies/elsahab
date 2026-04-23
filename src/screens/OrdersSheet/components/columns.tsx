import type { ColumnDef } from "@tanstack/react-table";
import type { OrderSheet } from "..";

export const columns: ColumnDef<OrderSheet>[] = [
  {
    accessorKey: "Governorate",
    header: "المحافظة",
  },
  {
    accessorKey: "city",
    header: "المنطقة",
  },
  {
    accessorKey: "phoneNumber",
    header: "رقم الهاتف",
  },
  {
    accessorKey: "total",
    header: "المبلغ",
    cell: ({ row }) => {
      const { total } = row.original;
      console.log(total);

      const formattedNumber = total
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return formattedNumber;
    },
  },
  {
    header: "ملاحظات",
    accessorKey: "notes",
  },
];
