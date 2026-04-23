import type { storeOrders } from "@/services/getOrders";
import { Checkbox } from "@mantine/core";

import type { ColumnDef } from "@tanstack/react-table";

export const StoresColumns: ColumnDef<storeOrders>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onChange={(e) =>
          table.toggleAllPageRowsSelected(e.currentTarget.checked)
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.currentTarget.checked)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "index",
    header: "#",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "store.name",
    header: "المتجر",
  },
  {
    accessorKey: "client.name",
    header: "العميل",
  },
  {
    accessorKey: "count",
    header: "عدد الطلبات",
  },
  {
    accessorKey: "totalCost",
    header: "المبلغ الكلي",
    cell: ({ row }) => {
      return <span>{row.original.totalCost.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "paidAmount",
    header: "المبلغ المدفوع",
    cell: ({ row }) => {
      return <span>{row.original.paidAmount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "deliveryCost",
    header: "مبلغ التوصيل",
    cell: ({ row }) => {
      return <span>{row.original.deliveryCost.toLocaleString()}</span>;
    },
  },
];
